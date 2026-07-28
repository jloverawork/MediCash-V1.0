const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get All Requests for Admin Dashboard
router.get('/credit-requests', async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = `
      SELECT cr.*, 
             u.full_name as patient_name, u.email as patient_email, u.phone as patient_user_phone,
             c.name as clinic_name, c.city as clinic_city,
             d.full_name as doctor_name, d.subspecialty as doctor_subspecialty,
             s.name as specialty_name
      FROM credit_requests cr
      JOIN users u ON cr.patient_id = u.id
      JOIN clinics c ON cr.clinic_id = c.id
      JOIN doctors d ON cr.doctor_id = d.id
      JOIN specialties s ON cr.specialty_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'ALL') {
      params.push(status);
      query += ` AND cr.status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (u.full_name ILIKE $${params.length} OR cr.patient_cedula ILIKE $${params.length} OR cr.procedure_name ILIKE $${params.length})`;
    }

    query += ` ORDER BY cr.created_at DESC`;

    const result = await db.query(query, params);
    const requests = result.rows;

    for (let reqObj of requests) {
      const attsResult = await db.query(
        'SELECT * FROM attachments WHERE credit_request_id = $1',
        [reqObj.id]
      );
      reqObj.attachments = attsResult.rows;
    }

    res.json(requests);
  } catch (err) {
    console.error('Error al listar solicitudes para admin:', err);
    res.status(500).json({ error: 'Error interno al consultar solicitudes de administración.' });
  }
});

// Admin Dashboard KPI Stats
router.get('/stats', async (req, res) => {
  try {
    const totalRes = await db.query('SELECT COUNT(*) as count, COALESCE(SUM(requested_amount), 0) as total_requested FROM credit_requests');
    const pendingRes = await db.query("SELECT COUNT(*) as count FROM credit_requests WHERE status IN ('PENDING', 'UNDER_REVIEW')");
    const approvedRes = await db.query("SELECT COUNT(*) as count, COALESCE(SUM(approved_amount), 0) as total_approved FROM credit_requests WHERE status = 'APPROVED'");
    const clinicsRes = await db.query('SELECT COUNT(*) as count FROM clinics WHERE is_active = true');
    const doctorsRes = await db.query('SELECT COUNT(*) as count FROM doctors');

    res.json({
      total_requests: parseInt(totalRes.rows[0].count, 10),
      total_requested_amount: parseFloat(totalRes.rows[0].total_requested),
      pending_count: parseInt(pendingRes.rows[0].count, 10),
      approved_count: parseInt(approvedRes.rows[0].count, 10),
      total_approved_amount: parseFloat(approvedRes.rows[0].total_approved),
      active_clinics: parseInt(clinicsRes.rows[0].count, 10),
      active_doctors: parseInt(doctorsRes.rows[0].count, 10)
    });
  } catch (err) {
    console.error('Error al obtener estadísticas admin:', err);
    res.status(500).json({ error: 'Error al consultar estadísticas.' });
  }
});

// Update Request Status and Financial Terms (Admin Override)
router.patch('/credit-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      approved_amount,
      down_payment_percentage,
      installments_count,
      admin_notes
    } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'El estatus es requerido.' });
    }

    // Fetch existing request
    const existingRes = await db.query('SELECT * FROM credit_requests WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada.' });
    }
    const currentReq = existingRes.rows[0];

    const finalApprovedAmount = approved_amount !== undefined ? parseFloat(approved_amount) : parseFloat(currentReq.requested_amount);
    const finalDownPct = down_payment_percentage !== undefined ? parseFloat(down_payment_percentage) : parseFloat(currentReq.down_payment_percentage || 20);
    const finalInstallmentsCount = installments_count !== undefined ? parseInt(installments_count, 10) : parseInt(currentReq.installments_count || 6, 10);

    const calculatedDownAmount = (finalApprovedAmount * (finalDownPct / 100)).toFixed(2);
    const remainingToFinance = finalApprovedAmount - calculatedDownAmount;
    const calculatedInstallmentAmount = (remainingToFinance / finalInstallmentsCount).toFixed(2);

    const updateQuery = `
      UPDATE credit_requests
      SET status = $1,
          approved_amount = $2,
          down_payment_percentage = $3,
          down_payment_amount = $4,
          installments_count = $5,
          installment_amount = $6,
          admin_notes = $7,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;

    const result = await db.query(updateQuery, [
      status,
      finalApprovedAmount,
      finalDownPct,
      calculatedDownAmount,
      finalInstallmentsCount,
      calculatedInstallmentAmount,
      admin_notes || '',
      id
    ]);

    res.json({
      message: `Solicitud #${id} actualizada a estatus '${status}'.`,
      credit_request: result.rows[0]
    });
  } catch (err) {
    console.error('Error al actualizar estatus de solicitud:', err);
    res.status(500).json({ error: 'Error interno al actualizar la solicitud.' });
  }
});

module.exports = router;
