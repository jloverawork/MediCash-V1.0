const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/upload');

// Create Credit Request with attachments (Informe Médico y Presupuesto de Clínica)
router.post('/', upload.fields([
  { name: 'medical_report', maxCount: 1 },
  { name: 'clinic_budget', maxCount: 1 }
]), async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const {
      patient_id,
      clinic_id,
      doctor_id,
      specialty_id,
      procedure_name,
      requested_amount,
      down_payment_percentage = 20,
      installments_count = 6,
      report_date,
      medical_notes,
      patient_cedula,
      patient_phone,
      emergency_contact
    } = req.body;

    if (!patient_id || !clinic_id || !doctor_id || !specialty_id || !procedure_name || !requested_amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Por favor complete todos los campos obligatorios del procedimiento.' });
    }

    const numRequested = parseFloat(requested_amount);
    const numDownPct = parseFloat(down_payment_percentage) || 20.0;
    const numInstallments = parseInt(installments_count, 10) || 6;
    const downAmount = (numRequested * (numDownPct / 100)).toFixed(2);
    const remainingAmount = numRequested - downAmount;
    const installmentAmount = (remainingAmount / numInstallments).toFixed(2);

    // Insert Credit Request
    const reqResult = await client.query(`
      INSERT INTO credit_requests 
      (patient_id, clinic_id, doctor_id, specialty_id, procedure_name, requested_amount, approved_amount, down_payment_percentage, down_payment_amount, installments_count, installment_amount, report_date, medical_notes, patient_cedula, patient_phone, emergency_contact, status)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'PENDING')
      RETURNING *
    `, [
      patient_id, clinic_id, doctor_id, specialty_id, procedure_name,
      numRequested, numRequested, numDownPct, downAmount, numInstallments, installmentAmount,
      report_date || new Date().toISOString().split('T')[0], medical_notes || '',
      patient_cedula || '', patient_phone || '', emergency_contact || ''
    ]);

    const creditRequest = reqResult.rows[0];

    // Handle Uploaded Attachments
    const files = req.files || {};
    const attachmentRecords = [];

    if (files.medical_report && files.medical_report[0]) {
      const f = files.medical_report[0];
      const fileUrl = `/uploads/${f.filename}`;
      const attRes = await client.query(`
        INSERT INTO attachments (credit_request_id, attachment_type, file_name, file_path, file_type)
        VALUES ($1, 'MEDICAL_REPORT', $2, $3, $4)
        RETURNING *
      `, [creditRequest.id, f.originalname, fileUrl, f.mimetype]);
      attachmentRecords.push(attRes.rows[0]);
    }

    if (files.clinic_budget && files.clinic_budget[0]) {
      const f = files.clinic_budget[0];
      const fileUrl = `/uploads/${f.filename}`;
      const attRes = await client.query(`
        INSERT INTO attachments (credit_request_id, attachment_type, file_name, file_path, file_type)
        VALUES ($1, 'CLINIC_BUDGET', $2, $3, $4)
        RETURNING *
      `, [creditRequest.id, f.originalname, fileUrl, f.mimetype]);
      attachmentRecords.push(attRes.rows[0]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Solicitud de crédito creada exitosamente. En proceso de revisión.',
      credit_request: creditRequest,
      attachments: attachmentRecords
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al crear solicitud de crédito:', err);
    res.status(500).json({ error: 'Error interno al procesar la solicitud de crédito.' });
  } finally {
    client.release();
  }
});

// Get User's Credit Requests
router.get('/my-requests/:patient_id', async (req, res) => {
  try {
    const { patient_id } = req.params;

    const query = `
      SELECT cr.*, 
             c.name as clinic_name, c.city as clinic_city,
             d.full_name as doctor_name, d.subspecialty as doctor_subspecialty,
             s.name as specialty_name
      FROM credit_requests cr
      JOIN clinics c ON cr.clinic_id = c.id
      JOIN doctors d ON cr.doctor_id = d.id
      JOIN specialties s ON cr.specialty_id = s.id
      WHERE cr.patient_id = $1
      ORDER BY cr.created_at DESC
    `;

    const reqsResult = await db.query(query, [patient_id]);
    const requests = reqsResult.rows;

    // Attach attachments
    for (let reqObj of requests) {
      const attsResult = await db.query(
        'SELECT * FROM attachments WHERE credit_request_id = $1',
        [reqObj.id]
      );
      reqObj.attachments = attsResult.rows;
    }

    res.json(requests);
  } catch (err) {
    console.error('Error al obtener mis solicitudes:', err);
    res.status(500).json({ error: 'Error al consultar solicitudes.' });
  }
});

module.exports = router;
