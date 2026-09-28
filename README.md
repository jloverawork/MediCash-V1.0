------------------------------
------------------------------
Frontend - React

npm install

npm run dev

------------------------------
------------------------------

Backend - Django

Crear el entorno virtual:
python -m venv venv

Activar el entorno virtual:
source venv/Scripts/activate

Instalar todas las dependencias del proyecto:
pip install -r requirements.txt

Iniciar el servidor:
python run_server.py

------------------------------
------------------------------
Base de Datos - PostgreSQL

CREATE DATABASE "MediCash";

python manage.py makemigrations
python manage.py migrate

Modificar .env

Django administra tablas (solo si aplica):
server/api/models.py
managed = False

------------------------------
------------------------------

Mobile - React Native

npx expo start --tunnel
