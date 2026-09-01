const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  password: process.env.DB_PASSWORD || 'P0stgr3sql',
  port: parseInt(process.env.DB_PORT || '5432', 10),
};

async function initDatabase() {
  console.log('🔄 Conectando a PostgreSQL para verificar la base de datos MediCash...');

  // Connect to default postgres DB to ensure MediCash database exists
  const rootClient = new Client({ ...dbConfig, database: 'postgres' });
  try {
    await rootClient.connect();
    const res = await rootClient.query("SELECT 1 FROM pg_database WHERE datname = 'MediCash'");
    if (res.rowCount === 0) {
      console.log('🔨 Creando base de datos "MediCash"...');
      await rootClient.query('CREATE DATABASE "MediCash"');
      console.log('✅ Base de datos "MediCash" creada con éxito.');
    } else {
      console.log('ℹ️ La base de datos "MediCash" ya existe.');
    }
  } catch (err) {
    console.error('⚠️ Error verificando/creando base de datos:', err.message);
  } finally {
    await rootClient.end();
  }

  // Connect directly to MediCash
  const dbClient = new Client({ ...dbConfig, database: 'MediCash' });
  try {
    await dbClient.connect();
    console.log('⚡ Ejecutando esquemas de tablas en "MediCash"...');

    // Create ENUMs or tables
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        cedula VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        role VARCHAR(20) DEFAULT 'PATIENT',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS specialties (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50) DEFAULT 'Activity',
        is_featured BOOLEAN DEFAULT false
      );

      CREATE TABLE IF NOT EXISTS clinics (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        city VARCHAR(100) DEFAULT 'Caracas',
        address TEXT NOT NULL,
        phone VARCHAR(30),
        image_url TEXT,
        is_active BOOLEAN DEFAULT true
      );

      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        full_name VARCHAR(150) NOT NULL,
        specialty_id INT REFERENCES specialties(id) ON DELETE CASCADE,
        clinic_id INT REFERENCES clinics(id) ON DELETE CASCADE,
        subspecialty VARCHAR(150),
        mpps_code VARCHAR(50),
        avatar_url TEXT
      );

      CREATE TABLE IF NOT EXISTS credit_requests (
        id SERIAL PRIMARY KEY,
        patient_id INT REFERENCES users(id) ON DELETE CASCADE,
        clinic_id INT REFERENCES clinics(id) ON DELETE CASCADE,
        doctor_id INT REFERENCES doctors(id) ON DELETE CASCADE,
        specialty_id INT REFERENCES specialties(id) ON DELETE CASCADE,
        procedure_name VARCHAR(200) NOT NULL,
        requested_amount NUMERIC(12, 2) NOT NULL,
        approved_amount NUMERIC(12, 2),
        down_payment_percentage NUMERIC(5, 2) DEFAULT 20.00,
        down_payment_amount NUMERIC(12, 2),
        installments_count INT DEFAULT 6,
        installment_amount NUMERIC(12, 2),
        report_date DATE,
        medical_notes TEXT,
        patient_cedula VARCHAR(20),
        patient_phone VARCHAR(30),
        emergency_contact VARCHAR(100),
        status VARCHAR(30) DEFAULT 'PENDING',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS attachments (
        id SERIAL PRIMARY KEY,
        credit_request_id INT REFERENCES credit_requests(id) ON DELETE CASCADE,
        attachment_type VARCHAR(50) DEFAULT 'MEDICAL_REPORT',
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(550) NOT NULL,
        file_type VARCHAR(100),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payment_schedules (
        id SERIAL PRIMARY KEY,
        credit_request_id INT REFERENCES credit_requests(id) ON DELETE CASCADE,
        installment_number INT NOT NULL,
        due_date DATE NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING',
        paid_at TIMESTAMP,
        payment_support_url TEXT,
        payment_method VARCHAR(50),
        reference_number VARCHAR(100),
        admin_notes TEXT
      );
      
      -- Ensure payment_schedules has all columns if created previously
      ALTER TABLE payment_schedules ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;
      ALTER TABLE payment_schedules ADD COLUMN IF NOT EXISTS payment_support_url TEXT;
      ALTER TABLE payment_schedules ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
      ALTER TABLE payment_schedules ADD COLUMN IF NOT EXISTS reference_number VARCHAR(100);
      ALTER TABLE payment_schedules ADD COLUMN IF NOT EXISTS admin_notes TEXT;
    `);

    console.log('✅ Tablas creadas / verificadas correctamente.');

    // Seed Data
    console.log('🌱 Insertando datos semilla...');

    // Users (Admin & Patient)
    const adminPass = await bcrypt.hash('admin123', 10);
    const patientPass = await bcrypt.hash('123456', 10);

    await dbClient.query(`
      INSERT INTO users (full_name, cedula, email, password_hash, phone, role)
      VALUES 
        ('Administrador MediCash', 'V-00000000', 'admin@medicash.ve', '${adminPass}', '+58 412 0000000', 'ADMIN'),
        ('Carlos Mendoza', 'V-18452930', 'carlos.mendoza@email.com', '${patientPass}', '+58 414 1234567', 'PATIENT')
      ON CONFLICT (email) DO NOTHING;
    `);

    // Specialties
    await dbClient.query(`
      INSERT INTO specialties (id, name, description, icon, is_featured)
      VALUES 
        (1, 'Neurocirugía', 'Cirugías complejas de cerebro, columna vertebral, hernias discales, aneurismas y tumores cerebrales.', 'Brain', true),
        (2, 'Cardiología & Cirugía Cardiovascular', 'Intervenciones coronarias, marcapasos, bypass y cirugía de corazón abierto.', 'HeartPulse', false),
        (3, 'Traumatología & Ortopedia', 'Reemplazos articulares (cadera, rodilla), artroscopias y fijación de fracturas.', 'Bone', false),
        (4, 'Cirugía General', 'Laparoscopias, hernias abdominales, vesícula y procedimientos gastrointestinales.', 'Stethoscope', false)
      ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name, 
        description = EXCLUDED.description, 
        is_featured = EXCLUDED.is_featured;
    `);

    // Expanded Clinics List in Venezuela
    await dbClient.query(`
      INSERT INTO clinics (id, name, city, address, phone, image_url)
      VALUES 
        (1, 'Clínica El Ávila', 'Caracas', 'Av. San Juan Bosco con 6ta Transversal, Altamira', '+58 212 2761111', 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80'),
        (2, 'Policlínica Metropolitana', 'Caracas', 'Calle A-1, Caurimare', '+58 212 9080111', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'),
        (3, 'Centro Médico Docente La Trinidad', 'Caracas', 'Av. Intercomunal La Trinidad - El Hatillo', '+58 212 9496411', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'),
        (4, 'Hospital de Clínicas Caracas', 'Caracas', 'Av. Panteón con Calle Alameda, San Bernardino', '+58 212 5086111', 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80'),
        (5, 'Centro Médico de Caracas', 'Caracas', 'Av. Eraso, San Bernardino', '+58 212 5550111', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80'),
        (6, 'Clínica Santiago de León', 'Caracas', 'Av. Francisco de Miranda, Chacao', '+58 212 3082111', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=80'),
        (7, 'Centro Médico Guerra Méndez', 'Valencia', 'Calle Rondón con Montes de Oca, Valencia', '+58 241 8501111', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'),
        (8, 'Policlínica Amado', 'Maracaibo', 'Av. 5 de Julio, Maracaibo', '+58 261 7960111', 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80')
      ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name, 
        address = EXCLUDED.address,
        image_url = EXCLUDED.image_url;
    `);

    // Expanded Doctors List with Working Avatar Photos for ALL 8 Clinics
    await dbClient.query(`
      INSERT INTO doctors (id, full_name, specialty_id, clinic_id, subspecialty, mpps_code, avatar_url)
      VALUES 
        -- Clínica 1: Clínica El Ávila
        (1, 'Dr. Alejandro Rivas', 1, 1, 'Neurocirugía de Columna & Hernias Discales', 'MPPS-48291', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'),
        (2, 'Dra. Verónica Tamayo', 1, 1, 'Neurocirugía Estereotáxica & Base de Cráneo', 'MPPS-52190', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),
        (3, 'Dra. María Victoria Gómez', 2, 1, 'Cardiología Intervencionista & Marcapasos', 'MPPS-47120', 'https://images.unsplash.com/photo-1594824813571-27a3f060ee0c?auto=format&fit=crop&w=400&q=80'),
        (4, 'Dr. Carlos Eduardo Rossi', 2, 1, 'Cirugía Cardiovascular & Bypass', 'MPPS-39201', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'),
        (5, 'Dr. Ricardo Machado', 3, 1, 'Reemplazo Articular Cadera & Rodilla', 'MPPS-45102', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'),
        (6, 'Dra. Natalia Gutiérrez', 3, 1, 'Artroscopia & Lesiones Deportivas', 'MPPS-50192', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),
        (7, 'Dr. Juan Carlos Betancourt', 4, 1, 'Cirugía Laparoscópica Bariátrica & Digestiva', 'MPPS-41092', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80'),
        (8, 'Dra. Beatriz Escalona', 4, 1, 'Cirugía General & Pared Abdominal', 'MPPS-48201', 'https://images.unsplash.com/photo-1594824813571-27a3f060ee0c?auto=format&fit=crop&w=400&q=80'),

        -- Clínica 2: Policlínica Metropolitana
        (9, 'Dr. Roberto Briceño', 1, 2, 'Neurocirugía Vascular & Aneurismas', 'MPPS-39102', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'),
        (10, 'Dr. Enrique Cisneros', 1, 2, 'Neuro-Oncología & Tumores Cerebrales', 'MPPS-44109', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'),
        (11, 'Dr. Carlos Benítez', 2, 2, 'Cirugía Cardiovascular & Coronaria', 'MPPS-34190', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80'),
        (12, 'Dra. Gabriela Alfonzo', 2, 2, 'Electrofisiología Cardiacos & Arritmias', 'MPPS-49021', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),
        (13, 'Dr. Andrés Eloy Blanco', 3, 2, 'Artroscopia de Hombro & Rodilla', 'MPPS-48901', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'),
        (14, 'Dr. Mauricio Terán', 3, 2, 'Cirugía de Columna Ortopédica', 'MPPS-43091', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'),
        (15, 'Dra. Isabela Carmona', 4, 2, 'Cirugía Endocrina & Tiroides', 'MPPS-51920', 'https://images.unsplash.com/photo-1594824813571-27a3f060ee0c?auto=format&fit=crop&w=400&q=80'),
        (16, 'Dr. Rafael Antonio Subero', 4, 2, 'Cirugía General & Laparoscopia Avanzada', 'MPPS-40192', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'),

        -- Clínica 3: Centro Médico Docente La Trinidad
        (17, 'Dra. Elena Alarcón', 1, 3, 'Neuro-Oncología & Tumores Cerebrales', 'MPPS-51203', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),
        (18, 'Dr. Tomás Valera', 1, 3, 'Neurocirugía de Columna & Escoliosis', 'MPPS-46102', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80'),
        (19, 'Dr. José Gregorio Castillo', 2, 3, 'Electrofisiología & Arritmias Cardiacas', 'MPPS-50192', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'),
        (20, 'Dra. Luisa Fernanda Rivas', 2, 3, 'Cardiología de Adultos & Insuficiencia', 'MPPS-53091', 'https://images.unsplash.com/photo-1594824813571-27a3f060ee0c?auto=format&fit=crop&w=400&q=80'),
        (21, 'Dr. Gustavo Alfonso Gil', 3, 3, 'Traumatología & Fijación de Fracturas', 'MPPS-42190', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'),
        (22, 'Dra. Daniela Montero', 3, 3, 'Ortopedia Infantil & Deformidades', 'MPPS-51092', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),
        (23, 'Dr. Francisco Javier Torrealba', 4, 3, 'Cirugía Gastrointestinal & Pared Abdominal', 'MPPS-47012', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'),
        (24, 'Dr. Oscar Marcano', 4, 3, 'Cirugía Oncológica & Tejidos Blandos', 'MPPS-39109', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'),

        -- Clínica 4: Hospital de Clínicas Caracas
        (25, 'Dr. Gabriel Mendoza', 1, 4, 'Neurocirugía Pediátrica & Malformaciones', 'MPPS-42109', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'),
        (26, 'Dra. Valentina Silva', 1, 4, 'Neurocirugía Funcional & Parkinson', 'MPPS-52019', 'https://images.unsplash.com/photo-1594824813571-27a3f060ee0c?auto=format&fit=crop&w=400&q=80'),
        (27, 'Dra. Patricia Morales', 2, 4, 'Cirugía Valvular & Valvuloplastias', 'MPPS-52019', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),
        (28, 'Dr. Fernando Cárdenas', 2, 4, 'Cardiología Hemodinámica Intervencionista', 'MPPS-48190', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80'),
        (29, 'Dr. Manuel Salvador Pino', 3, 4, 'Traumatología de Alta Energía & Prótesis', 'MPPS-43092', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'),
        (30, 'Dra. Adriana Villasmil', 3, 4, 'Cirugía de Mano & Microcirugía Vascular', 'MPPS-50192', 'https://images.unsplash.com/photo-1594824813571-27a3f060ee0c?auto=format&fit=crop&w=400&q=80'),
        (31, 'Dr. Daniel Uzcátegui', 4, 4, 'Cirugía Laparoscópica Avanzada & Hernias', 'MPPS-43019', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'),
        (32, 'Dra. Carmen Julia Prieto', 4, 4, 'Cirugía Hepatobiliar & Pancreática', 'MPPS-49102', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),

        -- Clínica 5: Centro Médico de Caracas
        (33, 'Dr. Fernando Salazar', 1, 5, 'Neurocirugía Estereotáxica & Base de Cráneo', 'MPPS-49021', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80'),
        (34, 'Dr. Jaime Alberto Medina', 1, 5, 'Neurocirugía Vascular & Malformaciones AVM', 'MPPS-41092', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'),
        (35, 'Dr. Héctor José Lira', 2, 5, 'Cirugía de Revascularización Miocárdica', 'MPPS-45091', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'),
        (36, 'Dra. Vanessa Colmenarez', 2, 5, 'Cardiología Clínica & Ecocardiografía 3D', 'MPPS-52109', 'https://images.unsplash.com/photo-1594824813571-27a3f060ee0c?auto=format&fit=crop&w=400&q=80'),
        (37, 'Dra. Mariana Colmenares', 3, 5, 'Traumatología Oncológica & Huesos', 'MPPS-51902', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),
        (38, 'Dr. Nelson Chirinos', 3, 5, 'Reemplazo Articular de Cadera Complejo', 'MPPS-39102', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'),
        (39, 'Dr. Julio César Ramos', 4, 5, 'Cirugía General & Laparoscopia Vesicular', 'MPPS-43091', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80'),
        (40, 'Dra. Rebeca Hurtado', 4, 5, 'Cirugía de Hernias Complejas de Pared', 'MPPS-50192', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),

        -- Clínica 6: Clínica Santiago de León
        (41, 'Dra. Sofía Ramírez', 1, 6, 'Neurocirugía de Columna Mínimamente Invasiva', 'MPPS-53102', 'https://images.unsplash.com/photo-1594824813571-27a3f060ee0c?auto=format&fit=crop&w=400&q=80'),
        (42, 'Dr. Antonio José Lucena', 1, 6, 'Neurocirugía de Trauma & Emergencias', 'MPPS-46109', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'),
        (43, 'Dr. Alejandro Monteverde', 2, 6, 'Cardiología Preventiva & Coronaria', 'MPPS-48102', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'),
        (44, 'Dra. Teresa Palacios', 2, 6, 'Cirugía de Válvulas Aórtica & Mitral', 'MPPS-51920', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),
        (45, 'Dr. Francisco Ortiz', 3, 6, 'Traumatología Deportiva & Ligamentos', 'MPPS-42019', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'),
        (46, 'Dra. Claudia Bencomo', 3, 6, 'Prótesis de Rodilla & Pie/Tobillo', 'MPPS-50192', 'https://images.unsplash.com/photo-1594824813571-27a3f060ee0c?auto=format&fit=crop&w=400&q=80'),
        (47, 'Dra. Vanessa Rondón', 4, 6, 'Cirugía General & Laparoscopia Digestiva', 'MPPS-49102', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),
        (48, 'Dr. Edgar José Villegas', 4, 6, 'Cirugía Colorrectal & Proctológica', 'MPPS-41902', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80'),

        -- Clínica 7: Centro Médico Guerra Méndez (Valencia)
        (49, 'Dr. Héctor Villalobos', 1, 7, 'Neurocirugía Trauma & Urgencias', 'MPPS-38291', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'),
        (50, 'Dra. Corina Sequera', 1, 7, 'Neurocirugía Oncología & Tumores', 'MPPS-53019', 'https://images.unsplash.com/photo-1594824813571-27a3f060ee0c?auto=format&fit=crop&w=400&q=80'),
        (51, 'Dr. Samuel David Rangel', 2, 7, 'Cardiología Intervencionista & Stents', 'MPPS-47109', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'),
        (52, 'Dra. Estefanía Carvallo', 2, 7, 'Cirugía Cardiovascular & Marcapasos', 'MPPS-52190', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),
        (53, 'Dr. Gustavo Adolfo Pérez', 3, 7, 'Traumatología general & Fracturas Complejas', 'MPPS-43091', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'),
        (54, 'Dr. Mario Alejandro Lugo', 3, 7, 'Reemplazos Articulares Prótesis Cadera', 'MPPS-41092', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80'),
        (55, 'Dr. Vicente Paolo Rossi', 4, 7, 'Cirugía General & Laparoscopia Abdominal', 'MPPS-44019', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'),
        (56, 'Dra. Lorena D\'\'Agostino', 4, 7, 'Cirugía de Mama & Pared Abdominal', 'MPPS-50192', 'https://images.unsplash.com/photo-1594824813571-27a3f060ee0c?auto=format&fit=crop&w=400&q=80'),

        -- Clínica 8: Policlínica Amado (Maracaibo)
        (57, 'Dr. Luis Eduardo Parra', 1, 8, 'Neurocirugía Endovascular & Aneurismas', 'MPPS-41092', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'),
        (58, 'Dra. Xiomara Urdaneta', 1, 8, 'Neurocirugía de Columna & Hernias Discales', 'MPPS-52019', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),
        (59, 'Dr. Guillermo Enrique Barboza', 2, 8, 'Cirugía Cardiovascular & Bypass Coronario', 'MPPS-46102', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'),
        (60, 'Dra. Rosana Portillo', 2, 8, 'Cardiología Clínica & Angioplastias', 'MPPS-51092', 'https://images.unsplash.com/photo-1594824813571-27a3f060ee0c?auto=format&fit=crop&w=400&q=80'),
        (61, 'Dr. Javier Ignacio Morillo', 3, 8, 'Traumatología & Artroscopia de Rodilla', 'MPPS-43091', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'),
        (62, 'Dr. Humberto Guanipa', 3, 8, 'Cirugía Ortopédica & Prótesis de Hombro', 'MPPS-40192', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80'),
        (63, 'Dr. Alí José Chacín', 4, 8, 'Cirugía Laparoscópica Avanzada & Vesícula', 'MPPS-42190', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'),
        (64, 'Dra. Karina Semprún', 4, 8, 'Cirugía General & Hernias de Pared', 'MPPS-50192', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80')
      ON CONFLICT (id) DO UPDATE SET 
        full_name = EXCLUDED.full_name,
        specialty_id = EXCLUDED.specialty_id,
        clinic_id = EXCLUDED.clinic_id,
        mpps_code = EXCLUDED.mpps_code,
        subspecialty = EXCLUDED.subspecialty,
        avatar_url = EXCLUDED.avatar_url;
    `);

    // Initial Sample Request & Payment Schedule for Carlos Mendoza
    const patientRes = await dbClient.query("SELECT id FROM users WHERE email = 'carlos.mendoza@email.com'");
    if (patientRes.rows.length > 0) {
      const patientId = patientRes.rows[0].id;

      let reqRes = await dbClient.query("SELECT id FROM credit_requests WHERE patient_id = $1", [patientId]);
      let requestId;
      if (reqRes.rowCount === 0) {
        const newReq = await dbClient.query(`
          INSERT INTO credit_requests 
          (patient_id, clinic_id, doctor_id, specialty_id, procedure_name, requested_amount, approved_amount, down_payment_percentage, down_payment_amount, installments_count, installment_amount, report_date, medical_notes, patient_cedula, patient_phone, status, admin_notes)
          VALUES 
          ($1, 1, 1, 1, 'Microdiscectomía Lumbar L4-L5', 4800.00, 4800.00, 20.00, 960.00, 18, 213.33, '2026-07-15', 'Paciente presenta hernia discal extruida con radiculopatía servera L5. Presupuesto aprobado.', 'V-18452930', '+58 414 1234567', 'APPROVED', 'Solicitud aprobada con plan a 18 cuotas.')
          RETURNING id
        `, [patientId]);
        requestId = newReq.rows[0].id;
      } else {
        requestId = reqRes.rows[0].id;
        // Update request to APPROVED for payment demonstration
        await dbClient.query("UPDATE credit_requests SET status = 'APPROVED' WHERE id = $1", [requestId]);
      }

      // Seed Payment Schedule for this request
      const scheduleCheck = await dbClient.query("SELECT id FROM payment_schedules WHERE credit_request_id = $1", [requestId]);
      if (scheduleCheck.rowCount === 0) {
        console.log('💳 Generando cronograma de pagos semilla (PAGADO, PENDIENTE, EN MORA)...');
        await dbClient.query(`
          INSERT INTO payment_schedules (credit_request_id, installment_number, due_date, amount, status, paid_at, reference_number, payment_method, admin_notes)
          VALUES 
            (${requestId}, 1, '2026-05-15', 213.33, 'PAGADO', '2026-05-14 10:30:00', 'REF-98402194', 'TRANSFERENCIA_BANESCO', 'Pago verificado por administración.'),
            (${requestId}, 2, '2026-06-15', 213.33, 'PAGADO', '2026-06-15 14:15:00', 'REF-10928374', 'PAGO_MOVIL', 'Pago verificado por administración.'),
            (${requestId}, 3, '2026-07-15', 213.33, 'OVERDUE', NULL, NULL, NULL, 'Cuota en mora. Favor regularizar pago.'),
            (${requestId}, 4, '2026-08-15', 213.33, 'PENDING', NULL, NULL, NULL, NULL),
            (${requestId}, 5, '2026-09-15', 213.33, 'PENDING', NULL, NULL, NULL, NULL),
            (${requestId}, 6, '2026-10-15', 213.33, 'PENDING', NULL, NULL, NULL, NULL);
        `);
      }
    }

    // Reset sequence counts
    await dbClient.query("SELECT setval('specialties_id_seq', (SELECT MAX(id) FROM specialties))");
    await dbClient.query("SELECT setval('clinics_id_seq', (SELECT MAX(id) FROM clinics))");
    await dbClient.query("SELECT setval('doctors_id_seq', (SELECT MAX(id) FROM doctors))");

    console.log('🎉 Inicialización de BD MediCash completada con éxito.');
  } catch (err) {
    console.error('❌ Error inicializando esquema de BD:', err);
  } finally {
    await dbClient.end();
  }
}

initDatabase();
