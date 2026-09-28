import os
import django
from decimal import Decimal
from datetime import date, datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medicash_backend.settings')
django.setup()

from api.models import (
    User,
    Specialty,
    Clinic,
    Doctor,
    CreditRequest,
    Attachment,
    PaymentSchedule,
)

def populate():
    print("Iniciando restauración/carga de datos de respaldo desde BD...")

    # 1. Especialidades
    specialties_data = [
        {'id': 1, 'name': 'Oftalmología', 'description': 'Cirugías láser, cataratas y salud visual', 'icon': 'Eye', 'is_featured': True},
        {'id': 2, 'name': 'Traumatología', 'description': 'Cirugía articular, fracturas y prótesis', 'icon': 'Bone', 'is_featured': True},
        {'id': 3, 'name': 'Odontología Quirúrgica', 'description': 'Implantes, ortognática y diseño de sonrisa', 'icon': 'Smile', 'is_featured': True},
        {'id': 4, 'name': 'Cirugía General', 'description': 'Hernias, vesícula y procedimientos laparoscópicos', 'icon': 'Activity', 'is_featured': True},
        {'id': 5, 'name': 'Ginecología y Obstetricia', 'description': 'Procedimientos quirúrgicos y cesáreas', 'icon': 'HeartPulse', 'is_featured': False},
        {'id': 6, 'name': 'Neurocirugía', 'description': 'Cirugía cerebral, columna vertebral y microcirugía neurológica', 'icon': 'Brain', 'is_featured': True},
    ]
    for s_info in specialties_data:
        Specialty.objects.update_or_create(id=s_info["id"], defaults=s_info)
    print(f"[OK] Especialidades: {len(specialties_data)} restauradas.")

    # 2. Clínicas
    clinics_data = [
        {'id': 1, 'name': 'Centro Médico Las Mercedes', 'city': 'Caracas', 'address': 'Av. Principal de Las Mercedes, Edif. Torre Médica, Piso 3', 'phone': '+58 212 999 1122', 'image_url': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600', 'is_active': True},
        {'id': 2, 'name': 'Clínica El Ávila', 'city': 'Caracas', 'address': '6ta Transversal con 7ma Avenida, Altamira', 'phone': '+58 212 276 1111', 'image_url': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=600', 'is_active': True},
        {'id': 3, 'name': 'Instituto Médico Santa Paula', 'city': 'Caracas', 'address': 'Av. Circunvalación del Sol, Urb. Santa Paula', 'phone': '+58 212 600 5000', 'image_url': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600', 'is_active': True},
    ]
    for c_info in clinics_data:
        Clinic.objects.update_or_create(id=c_info["id"], defaults=c_info)
    print(f"[OK] Clínicas: {len(clinics_data)} restauradas.")

    # 3. Usuarios
    users_data = [
        {'id': 1, 'full_name': 'Carlos Mendoza', 'cedula': 'V-18456123', 'email': 'carlos.mendoza@gmail.com', 'password_hash': '$2b$10$q1IpGAxoGWKyfYbcel0iGOV5BsmVnssbUe/34f1UTxDjc8fXlj02e', 'phone': '+58 412 1234567', 'role': 'PATIENT'},
        {'id': 2, 'full_name': 'Elena Salazar', 'cedula': 'V-20345678', 'email': 'elena.salazar@gmail.com', 'password_hash': '$2b$10$q1IpGAxoGWKyfYbcel0iGOV5BsmVnssbUe/34f1UTxDjc8fXlj02e', 'phone': '+58 424 7654321', 'role': 'PATIENT'},
        {'id': 3, 'full_name': 'Dr. Alejandro Ramos', 'cedula': 'V-14567890', 'email': 'alejandro.ramos@medicash.com', 'password_hash': '$2b$10$q1IpGAxoGWKyfYbcel0iGOV5BsmVnssbUe/34f1UTxDjc8fXlj02e', 'phone': '+58 414 9876543', 'role': 'DOCTOR'},
        {'id': 4, 'full_name': 'Dra. Sofía Valenzuela', 'cedula': 'V-16789012', 'email': 'sofia.valenzuela@medicash.com', 'password_hash': '$2b$10$q1IpGAxoGWKyfYbcel0iGOV5BsmVnssbUe/34f1UTxDjc8fXlj02e', 'phone': '+58 416 3456789', 'role': 'DOCTOR'},
        {'id': 5, 'full_name': 'Administrador MediCash', 'cedula': 'V-10000001', 'email': 'admin@medicash.com', 'password_hash': '$2b$10$q1IpGAxoGWKyfYbcel0iGOV5BsmVnssbUe/34f1UTxDjc8fXlj02e', 'phone': '+58 412 0000000', 'role': 'ADMIN'},
        {'id': 6, 'full_name': 'Juan Perez', 'cedula': '11223344', 'email': 'juan@gmail.com', 'password_hash': '$2b$10$q1IpGAxoGWKyfYbcel0iGOV5BsmVnssbUe/34f1UTxDjc8fXlj02e', 'phone': '04247894532', 'role': 'PATIENT'},
        {'id': 7, 'full_name': 'Dr. Ricardo Betancourt', 'cedula': 'V-12345678', 'email': 'ricardo.betancourt@medicash.com', 'password_hash': '$2b$10$q1IpGAxoGWKyfYbcel0iGOV5BsmVnssbUe/34f1UTxDjc8fXlj02e', 'phone': '+58 412 5551234', 'role': 'DOCTOR'},
    ]
    for u_info in users_data:
        User.objects.update_or_create(id=u_info["id"], defaults=u_info)
    print(f"[OK] Usuarios: {len(users_data)} restaurados.")

    # 4. Médicos
    doctors_data = [
        {'id': 1, 'user_id': 3, 'full_name': 'Dr. Alejandro Ramos', 'specialty_id': 1, 'clinic_id': 1, 'subspecialty': 'Cirugía Refractiva y Córnea', 'mpps_code': 'MPPS-84920', 'avatar_url': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'},
        {'id': 2, 'user_id': 4, 'full_name': 'Dra. Sofía Valenzuela', 'specialty_id': 2, 'clinic_id': 2, 'subspecialty': 'Artroscopia y Reconstrucción Articular', 'mpps_code': 'MPPS-92314', 'avatar_url': 'https://images.unsplash.com/photo-1594824813589-a292850901e1?auto=format&fit=crop&q=80&w=400'},
        {'id': 3, 'user_id': 7, 'full_name': 'Dr. Ricardo Betancourt', 'specialty_id': 6, 'clinic_id': 1, 'subspecialty': 'Neurocirugía y Cirugía de Columna Vertebral', 'mpps_code': 'MPPS-77412', 'avatar_url': 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400'},
    ]
    for d_info in doctors_data:
        Doctor.objects.update_or_create(id=d_info["id"], defaults=d_info)
    print(f"[OK] Médicos: {len(doctors_data)} restaurados.")

    # 5. Solicitudes de Crédito
    credit_requests_data = [
        {'id': 1, 'patient_id': 1, 'clinic_id': 1, 'doctor_id': 1, 'specialty_id': 1, 'procedure_name': 'Cirugía Refractiva LASIK Bilateral', 'requested_amount': '1800.00', 'approved_amount': '1800.00', 'down_payment_percentage': '20.00', 'down_payment_amount': '360.00', 'installments_count': 6, 'installment_amount': '240.00', 'report_date': '2026-09-22', 'medical_notes': 'Paciente apto con paquimetría adecuada en ambos ojos.', 'patient_cedula': 'V-18456123', 'patient_phone': '+58 412 1234567', 'emergency_contact': 'María Mendoza - +58 412 8889900', 'status': 'APPROVED', 'admin_notes': 'Validación de ingresos y evaluación oftalmológica conforme.'},
        {'id': 2, 'patient_id': 6, 'clinic_id': 1, 'doctor_id': 1, 'specialty_id': 5, 'procedure_name': 'Intervención de Ginecología y Obstetricia', 'requested_amount': '3500.00', 'approved_amount': '3500.00', 'down_payment_percentage': '20.00', 'down_payment_amount': '700.00', 'installments_count': 18, 'installment_amount': '155.56', 'report_date': '2026-09-28', 'medical_notes': '', 'patient_cedula': '11223344', 'patient_phone': '04247894532', 'emergency_contact': '', 'status': 'PENDING', 'admin_notes': None},
        {'id': 3, 'patient_id': 6, 'clinic_id': 1, 'doctor_id': 1, 'specialty_id': 4, 'procedure_name': 'Rayos X', 'requested_amount': '50.00', 'approved_amount': '50.00', 'down_payment_percentage': '20.00', 'down_payment_amount': '10.00', 'installments_count': 18, 'installment_amount': '2.22', 'report_date': '2026-09-28', 'medical_notes': 'Prueba', 'patient_cedula': '11223344', 'patient_phone': '04247894532', 'emergency_contact': '015456310', 'status': 'APPROVED', 'admin_notes': ''},
        {'id': 4, 'patient_id': 6, 'clinic_id': 2, 'doctor_id': 1, 'specialty_id': 4, 'procedure_name': 'Electromiografía', 'requested_amount': '120.00', 'approved_amount': '120.00', 'down_payment_percentage': '20.00', 'down_payment_amount': '24.00', 'installments_count': 18, 'installment_amount': '5.33', 'report_date': '2026-09-28', 'medical_notes': 'Prueba teléfono ', 'patient_cedula': '11223344', 'patient_phone': '04247894532', 'emergency_contact': '81928338', 'status': 'APPROVED', 'admin_notes': ''},
    ]
    for cr_info in credit_requests_data:
        cr_dict = dict(cr_info)
        for dec_field in ["requested_amount", "approved_amount", "down_payment_percentage", "down_payment_amount", "installment_amount"]:
            if cr_dict[dec_field] is not None:
                cr_dict[dec_field] = Decimal(cr_dict[dec_field])
        CreditRequest.objects.update_or_create(id=cr_dict["id"], defaults=cr_dict)
    print(f"[OK] Solicitudes de Crédito: {len(credit_requests_data)} restauradas.")

    # 6. Adjuntos / Documentos
    attachments_data = [
        {'id': 1, 'credit_request_id': 1, 'attachment_type': 'MEDICAL_REPORT', 'file_name': 'informe_oftalmologico_carlos_mendoza.pdf', 'file_path': 'uploads/reports/carlos_mendoza_2026.pdf', 'file_type': 'application/pdf'},
        {'id': 2, 'credit_request_id': 2, 'attachment_type': 'MEDICAL_REPORT', 'file_name': 'Captura de pantalla 2026-07-27 234030.png', 'file_path': '/uploads/medical_report-1790555967158-652048.png', 'file_type': 'image/png'},
        {'id': 3, 'credit_request_id': 2, 'attachment_type': 'CLINIC_BUDGET', 'file_name': 'Captura de pantalla 2026-07-27 234030.png', 'file_path': '/uploads/clinic_budget-1790555967161-937540.png', 'file_type': 'image/png'},
        {'id': 4, 'credit_request_id': 3, 'attachment_type': 'MEDICAL_REPORT', 'file_name': 'Captura de pantalla 2026-07-27 234030.png', 'file_path': '/uploads/medical_report-1790556457640-795871.png', 'file_type': 'image/png'},
        {'id': 5, 'credit_request_id': 3, 'attachment_type': 'CLINIC_BUDGET', 'file_name': 'Captura de pantalla 2026-07-27 234030.png', 'file_path': '/uploads/clinic_budget-1790556457643-762318.png', 'file_type': 'image/png'},
        {'id': 6, 'credit_request_id': 4, 'attachment_type': 'MEDICAL_REPORT', 'file_name': '546044.jpg', 'file_path': '/uploads/medical_report-1790556627005-905045.jpg', 'file_type': 'image/jpeg'},
        {'id': 7, 'credit_request_id': 4, 'attachment_type': 'CLINIC_BUDGET', 'file_name': '546093.jpg', 'file_path': '/uploads/clinic_budget-1790556627007-976155.jpg', 'file_type': 'image/jpeg'},
    ]
    for att_info in attachments_data:
        Attachment.objects.update_or_create(id=att_info["id"], defaults=att_info)
    print(f"[OK] Adjuntos: {len(attachments_data)} restaurados.")

    # 7. Cronograma de Pagos
    payments_data = [
        {'id': 1, 'credit_request_id': 1, 'installment_number': 1, 'due_date': '2026-10-27', 'amount': '240.00', 'status': 'PAID', 'paid_at': '2026-09-27 00:00:00', 'payment_method': 'PAGO_MOVIL', 'reference_number': '010294829103'},
        {'id': 2, 'credit_request_id': 1, 'installment_number': 2, 'due_date': '2026-11-26', 'amount': '240.00', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 3, 'credit_request_id': 1, 'installment_number': 3, 'due_date': '2026-12-26', 'amount': '240.00', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 4, 'credit_request_id': 1, 'installment_number': 4, 'due_date': '2027-01-25', 'amount': '240.00', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 5, 'credit_request_id': 1, 'installment_number': 5, 'due_date': '2027-02-24', 'amount': '240.00', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 6, 'credit_request_id': 1, 'installment_number': 6, 'due_date': '2027-03-26', 'amount': '240.00', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 7, 'credit_request_id': 3, 'installment_number': 1, 'due_date': '2026-10-27', 'amount': '2.22', 'status': 'PAGADO', 'paid_at': '2026-09-27 20:48:50.791843', 'payment_method': 'PAGO_MOVIL', 'reference_number': '1561561'},
        {'id': 8, 'credit_request_id': 3, 'installment_number': 2, 'due_date': '2026-11-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 9, 'credit_request_id': 3, 'installment_number': 3, 'due_date': '2026-12-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 10, 'credit_request_id': 3, 'installment_number': 4, 'due_date': '2027-01-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 11, 'credit_request_id': 3, 'installment_number': 5, 'due_date': '2027-02-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 12, 'credit_request_id': 3, 'installment_number': 6, 'due_date': '2027-03-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 13, 'credit_request_id': 3, 'installment_number': 7, 'due_date': '2027-04-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 14, 'credit_request_id': 3, 'installment_number': 8, 'due_date': '2027-05-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 15, 'credit_request_id': 3, 'installment_number': 9, 'due_date': '2027-06-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 16, 'credit_request_id': 3, 'installment_number': 10, 'due_date': '2027-07-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 17, 'credit_request_id': 3, 'installment_number': 11, 'due_date': '2027-08-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 18, 'credit_request_id': 3, 'installment_number': 12, 'due_date': '2027-09-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 19, 'credit_request_id': 3, 'installment_number': 13, 'due_date': '2027-10-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 20, 'credit_request_id': 3, 'installment_number': 14, 'due_date': '2027-11-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 21, 'credit_request_id': 3, 'installment_number': 15, 'due_date': '2027-12-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 22, 'credit_request_id': 3, 'installment_number': 16, 'due_date': '2028-01-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 23, 'credit_request_id': 3, 'installment_number': 17, 'due_date': '2028-02-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 24, 'credit_request_id': 3, 'installment_number': 18, 'due_date': '2028-03-27', 'amount': '2.22', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 25, 'credit_request_id': 4, 'installment_number': 1, 'due_date': '2026-10-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 26, 'credit_request_id': 4, 'installment_number': 2, 'due_date': '2026-11-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 27, 'credit_request_id': 4, 'installment_number': 3, 'due_date': '2026-12-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 28, 'credit_request_id': 4, 'installment_number': 4, 'due_date': '2027-01-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 29, 'credit_request_id': 4, 'installment_number': 5, 'due_date': '2027-02-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 30, 'credit_request_id': 4, 'installment_number': 6, 'due_date': '2027-03-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 31, 'credit_request_id': 4, 'installment_number': 7, 'due_date': '2027-04-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 32, 'credit_request_id': 4, 'installment_number': 8, 'due_date': '2027-05-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 33, 'credit_request_id': 4, 'installment_number': 9, 'due_date': '2027-06-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 34, 'credit_request_id': 4, 'installment_number': 10, 'due_date': '2027-07-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 35, 'credit_request_id': 4, 'installment_number': 11, 'due_date': '2027-08-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 36, 'credit_request_id': 4, 'installment_number': 12, 'due_date': '2027-09-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 37, 'credit_request_id': 4, 'installment_number': 13, 'due_date': '2027-10-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 38, 'credit_request_id': 4, 'installment_number': 14, 'due_date': '2027-11-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 39, 'credit_request_id': 4, 'installment_number': 15, 'due_date': '2027-12-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 40, 'credit_request_id': 4, 'installment_number': 16, 'due_date': '2028-01-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 41, 'credit_request_id': 4, 'installment_number': 17, 'due_date': '2028-02-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
        {'id': 42, 'credit_request_id': 4, 'installment_number': 18, 'due_date': '2028-03-27', 'amount': '5.33', 'status': 'PENDING', 'paid_at': None, 'payment_method': None, 'reference_number': None},
    ]
    for p_info in payments_data:
        p_dict = dict(p_info)
        p_dict["amount"] = Decimal(p_dict["amount"])
        PaymentSchedule.objects.update_or_create(id=p_dict["id"], defaults=p_dict)
    print(f"[OK] Cuotas de Pago: {len(payments_data)} restauradas.")

    print("\n[ÉXITO] Proceso de datos finalizado correctamente.")

if __name__ == "__main__":
    populate()