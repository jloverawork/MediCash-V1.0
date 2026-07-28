const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get Specialties (highlighting Neurocirugía)
router.get('/specialties', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM specialties ORDER BY is_featured DESC, name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener especialidades:', err);
    res.status(500).json({ error: 'Error al consultar especialidades.' });
  }
});

// Get Clinics
router.get('/clinics', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clinics WHERE is_active = true ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener clínicas:', err);
    res.status(500).json({ error: 'Error al consultar clínicas.' });
  }
});

// Get Doctors (optionally filtered by specialty_id and clinic_id)
router.get('/doctors', async (req, res) => {
  try {
    const { specialty_id, clinic_id } = req.query;
    let query = `
      SELECT d.*, s.name as specialty_name, c.name as clinic_name 
      FROM doctors d
      JOIN specialties s ON d.specialty_id = s.id
      JOIN clinics c ON d.clinic_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (specialty_id) {
      params.push(specialty_id);
      query += ` AND d.specialty_id = $${params.length}`;
    }

    if (clinic_id) {
      params.push(clinic_id);
      query += ` AND d.clinic_id = $${params.length}`;
    }

    query += ` ORDER BY d.full_name ASC`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener doctores:', err);
    res.status(500).json({ error: 'Error al consultar doctores.' });
  }
});

module.exports = router;
