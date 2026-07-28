const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/upload');

// Helper: Auto-generate payment schedule if missing for approved request
async function ensureScheduleExists(requestId, reqObj) {
  const check = await db.query('SELECT COUNT(*) as count FROM payment_schedules WHERE credit_request_id = $1', [requestId]);
  if (parseInt(check.rows[0].count, 10) === 0) {
    const numInstallments = parseInt(reqObj.installments_count || 18, 10);
    const amountPerInstallment = parseFloat(reqObj.installment_amount || (reqObj.approved_amount / numInstallments));
    
    const startDate = new Date();
    for (let i = 1; i <= numInstallments; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      const dueDateStr = dueDate.toISOString().split('T')[0];
      
      await db.query(`
        INSERT INTO payment_schedules (credit_request_id, installment_number, due_date, amount, status)
        VALUES ($1, $2, $3, $4, 'PENDING')
      `, [requestId, i, dueDateStr, amountPerInstallment]);
    }
  }
}

// GET Patient Payments and Installment Schedule
router.get('/my-payments/:patient_id', async (req, res) => {
  try {
    const { patient_id } = req.params;

    // Get patient's approved credit requests
    const reqsRes = await db.query(`
      SELECT cr.*, 
             c.name as clinic_name,
             d.full_name as doctor_name,
             s.name as specialty_name
      FROM credit_requests cr
      JOIN clinics c ON cr.clinic_id = c.id
      JOIN doctors d ON cr.doctor_id = d.id
      JOIN specialties s ON cr.specialty_id = s.id
      WHERE cr.patient_id = $1
      ORDER BY cr.created_at DESC
    `, [patient_id]);

    const requests = reqsRes.rows;
    let allSchedules = [];

    for (let reqObj of requests) {
      if (reqObj.status === 'APPROVED') {
        await ensureScheduleExists(reqObj.id, reqObj);
      }

      const schedRes = await db.query(`
        SELECT ps.*, cr.procedure_name, c.name as clinic_name
        FROM payment_schedules ps
        JOIN credit_requests cr ON ps.credit_request_id = cr.id
        JOIN clinics c ON cr.clinic_id = c.id
        WHERE ps.credit_request_id = $1
        ORDER BY ps.installment_number ASC
      `, [reqObj.id]);

      reqObj.schedule = schedRes.rows;
      allSchedules.push(...schedRes.rows);
    }

    // Calculate Summary KPIs
    let totalPaid = 0;
    let totalPending = 0;
    let totalOverdue = 0;

    allSchedules.forEach((item) => {
      const amt = parseFloat(item.amount || 0);
      if (item.status === 'PAGADO') totalPaid += amt;
      else if (item.status === 'OVERDUE') totalOverdue += amt;
      else totalPending += amt;
    });

    res.json({
      requests,
      allSchedules,
      summary: {
        totalPaid: parseFloat(totalPaid.toFixed(2)),
        totalPending: parseFloat(totalPending.toFixed(2)),
        totalOverdue: parseFloat(totalOverdue.toFixed(2)),
        totalInstallments: allSchedules.length
      }
    });
  } catch (err) {
    console.error('Error al obtener pagos de paciente:', err);
    res.status(500).json({ error: 'Error interno al consultar historial de pagos.' });
  }
});

// POST Patient Submit Payment Receipt / Support
router.post('/submit-support', upload.single('payment_support'), async (req, res) => {
  try {
    const { schedule_id, reference_number, payment_method } = req.body;

    if (!schedule_id) {
      return res.status(400).json({ error: 'El ID de la cuota es requerido.' });
    }

    let supportUrl = null;
    if (req.file) {
      supportUrl = `/uploads/${req.file.filename}`;
    }

    const updateQuery = `
      UPDATE payment_schedules
      SET status = 'PAGADO',
          paid_at = CURRENT_TIMESTAMP,
          payment_support_url = COALESCE($1, payment_support_url),
          reference_number = COALESCE($2, reference_number),
          payment_method = COALESCE($3, payment_method)
      WHERE id = $4
      RETURNING *
    `;

    const result = await db.query(updateQuery, [supportUrl, reference_number || '', payment_method || 'TRANSFERENCIA', schedule_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cuota de pago no encontrada.' });
    }

    res.json({
      message: 'Comprobante de pago enviado y registrado exitosamente.',
      schedule: result.rows[0]
    });
  } catch (err) {
    console.error('Error al registrar soporte de pago:', err);
    res.status(500).json({ error: 'Error interno al registrar el soporte de pago.' });
  }
});

// GET Admin List All Patient Payments
router.get('/admin/all-payments', async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT ps.*, 
             cr.procedure_name, cr.patient_cedula,
             u.full_name as patient_name, u.email as patient_email, u.phone as patient_phone,
             c.name as clinic_name
      FROM payment_schedules ps
      JOIN credit_requests cr ON ps.credit_request_id = cr.id
      JOIN users u ON cr.patient_id = u.id
      JOIN clinics c ON cr.clinic_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'ALL') {
      params.push(status);
      query += ` AND ps.status = $${params.length}`;
    }

    query += ` ORDER BY ps.due_date ASC, ps.installment_number ASC`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener lista de pagos para administración:', err);
    res.status(500).json({ error: 'Error interno al consultar pagos de administración.' });
  }
});

// PATCH Admin Verify or Change Installment Status
router.patch('/admin/verify/:schedule_id', async (req, res) => {
  try {
    const { schedule_id } = req.params;
    const { status, admin_notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'El nuevo estatus es requerido.' });
    }

    const query = `
      UPDATE payment_schedules
      SET status = $1,
          admin_notes = COALESCE($2, admin_notes),
          paid_at = CASE WHEN $1 = 'PAGADO' AND paid_at IS NULL THEN CURRENT_TIMESTAMP ELSE paid_at END
      WHERE id = $3
      RETURNING *
    `;

    const result = await db.query(query, [status, admin_notes || '', schedule_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro de cuota no encontrado.' });
    }

    res.json({
      message: `Estatus de cuota actualizado a '${status}'.`,
      schedule: result.rows[0]
    });
  } catch (err) {
    console.error('Error al verificar pago por administración:', err);
    res.status(500).json({ error: 'Error interno al actualizar estatus de pago.' });
  }
});

module.exports = router;
