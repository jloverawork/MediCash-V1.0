const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'medicash_super_secret_jwt_key_2026';

// Register User
router.post('/register', async (req, res) => {
  try {
    const { full_name, cedula, email, password, phone } = req.body;

    if (!full_name || !cedula || !email || !password || !phone) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Check existing
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1 OR cedula = $2',
      [email.toLowerCase(), cedula]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un usuario registrado con este correo o cédula.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (full_name, cedula, email, password_hash, phone, role)
       VALUES ($1, $2, $3, $4, $5, 'PATIENT')
       RETURNING id, full_name, cedula, email, phone, role, created_at`,
      [full_name, cedula, email.toLowerCase(), passwordHash, phone]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error del servidor al registrar usuario.' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Por favor ingrese correo y contraseña.' });
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    delete user.password_hash;

    res.json({ user, token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error del servidor al iniciar sesión.' });
  }
});

module.exports = router;
