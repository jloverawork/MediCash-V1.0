# 🏥 MediCash v1.0 — Sistema de Financiamiento Médico

**MediCash** es una solución integral para el financiamiento médico en cuotas y directorio de salud en Venezuela. Permite a pacientes solicitar crédito para cirugías, tratamientos complejos y exámenes diagnósticos, mientras brinda a la administración un panel completo para la evaluación médica, aprobación de solicitudes y control de mora de cuotas.

---

## 🚀 Requisitos Previos

Asegúrate de tener instalados los siguientes programas antes de comenzar:
- **Node.js** (v18.0.0 o superior) y `npm`
- **Python** (v3.10 o superior)
- **Git**

---

## 📁 Estructura del Proyecto

```text
MediCash-V1.0/
├── server/       # Backend (Django REST API + Base de Datos SQLite/PostgreSQL)
├── frontend/     # Aplicación Web (React + Vite + TailwindCSS)
└── mobile/       # Aplicación Móvil (React Native + Expo)
```

---

## ⚙️ Guía de Instalación y Puesta en Marcha (Paso a Paso)

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/jloverawork/MediCash-V1.0.git
cd MediCash-V1.0
```

---

### 2️⃣ Backend (Django API)

1. **Navegar a la carpeta del servidor:**
   ```bash
   cd server
   ```

2. **Crear el entorno virtual:**
   - **Windows:**
     ```bash
     python -m venv venv
     ```
   - **Linux / macOS:**
     ```bash
     python3 -m venv venv
     ```

3. **Activar el entorno virtual:**
   - **Windows (CMD):**
     ```cmd
     venv\Scripts\activate.bat
     ```
   - **Windows (PowerShell):**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS:**
     ```bash
     source venv/bin/activate
     ```

4. **Instalar dependencias de Python:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Ejecutar migraciones de Base de Datos:**
   ```bash
   python manage.py migrate
   ```

6. **Restaurar/Cargar los datos iniciales y respaldo de BD:**
   ```bash
   python seed_data.py
   ```
   > ℹ️ Este comando poblará automáticamente las especialidades, clínicas, médicos, solicitudes de prueba, cronograma de pagos y cuentas de usuario preconfiguradas.

7. **Iniciar el servidor backend:**
   ```bash
   python run_server.py
   ```
   *El backend quedará ejecutándose en `http://localhost:8000` (y escuchando en tu red local `0.0.0.0:8000`).*

---

### 3️⃣ Frontend Web (React + Vite)

Abre una **nueva terminal** (dejando el servidor backend corriendo):

1. **Navegar a la carpeta del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias de Node:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   *Abre la URL indicada en consola (usualmente `http://localhost:5173`).*

   > 💡 **Nota de Uso:** En la barra superior de la app web puedes alternar libremente entre:
   > - **Vista App Móvil (Paciente):** Simulador interactivo de la experiencia del paciente.
   > - **Vista Web (Administración):** Panel de control para evaluar solicitudes y verificar pagos.

---

### 4️⃣ App Móvil (React Native + Expo)

Abre otra **nueva terminal**:

1. **Navegar a la carpeta mobile:**
   ```bash
   cd mobile
   ```

2. **Instalar dependencias de Node:**
   ```bash
   npm install
   ```

3. *(Opcional)* **Configurar la IP Backend para pruebas en teléfono físico:**
   Si vas a probar en la app Expo Go de tu celular físico, edita `mobile/src/api/config.js` y coloca la IP local de tu PC:
   ```javascript
   export const API_BASE_URL = 'http://TU_IP_LOCAL:8000';
   ```

4. **Iniciar servidor Expo:**
   ```bash
   npx expo start
   ```
   *O con túnel si estás en redes distintas:*
   ```bash
   npx expo start --tunnel
   ```

---

## 🔑 Cuentas de Acceso y Credenciales

Todas las cuentas de prueba tienen asignada la **misma contraseña universal**:

> **Contraseña Única:** `Test2026!`

### 🛡️ Administrador (`ADMIN`)
- **Correo:** `admin@medicash.com`
- **Contraseña:** `Test2026!`
- *Acceso directo en Web:* Clic en **"Vista Web (Administración)"** en la barra superior.

### 👤 Pacientes (`PATIENT`)
- **Juan Pérez:** `juan@gmail.com` | `Test2026!`
- **Carlos Mendoza:** `carlos.mendoza@gmail.com` | `Test2026!`
- **Elena Salazar:** `elena.salazar@gmail.com` | `Test2026!`

---

## ✨ Funcionalidades Principales

1. **Modalidad A — Especialidades con Financiamiento:** Solicitud de crédito quirúrgico en plazos de cuotas adaptables (Medicina Interna, Neurocirugía, Traumatología, etc.).
2. **Modalidad B — Servicios Diagnósticos:** Financiamiento rápido para exámenes de laboratorio, perfil 20, ecografías, rayos X y electromiografías.
3. **Modalidad C — Red Abierta MediCash:** Directorio médico e imagenológico informativo por ciudad y área de especialidad.
4. **Módulo Administrador:** Evaluación y dictamen médico de solicitudes, aprobación de financiamiento y verificación de transferencias y mora de pacientes.
