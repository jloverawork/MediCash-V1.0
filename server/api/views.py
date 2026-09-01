import os
import json
import random
import time
from datetime import datetime, date, timedelta, timezone
from decimal import Decimal

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.db.models import Count, Sum, Q, F

import bcrypt
import jwt

from .models import (
    User, Specialty, Clinic, Doctor,
    CreditRequest, Attachment, PaymentSchedule
)

JWT_SECRET = getattr(settings, 'SECRET_KEY', 'medicash_super_secret_jwt_key_2026')


def parse_json_body(request):
    try:
        return json.loads(request.body.decode('utf-8'))
    except Exception:
        return request.POST.dict()


def serialize_datetime(dt):
    if dt is None:
        return None
    if isinstance(dt, (datetime, date)):
        return dt.isoformat()
    return str(dt)


def serialize_decimal(d):
    if d is None:
        return None
    return float(d)


# ==========================================
# HEALTH CHECK
# ==========================================
def health_check(request):
    return JsonResponse({
        'status': 'OK',
        'message': 'MediCash API v1.0 running successfully (Django Backend).'
    })


# ==========================================
# AUTHENTICATION VIEWS
# ==========================================
@csrf_exempt
def register_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido.'}, status=405)

    data = parse_json_body(request)
    full_name = data.get('full_name')
    cedula = data.get('cedula')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')

    if not all([full_name, cedula, email, password, phone]):
        return JsonResponse({'error': 'Todos los campos son obligatorios.'}, status=400)

    clean_email = email.strip().lower()

    if User.objects.filter(Q(email=clean_email) | Q(cedula=cedula)).exists():
        return JsonResponse({'error': 'Ya existe un usuario registrado con este correo o cédula.'}, status=400)

    # Hash password with bcrypt
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(10)).decode('utf-8')

    user = User.objects.create(
        full_name=full_name,
        cedula=cedula,
        email=clean_email,
        password_hash=hashed,
        phone=phone,
        role='PATIENT'
    )

    payload = {
        'id': user.id,
        'email': user.email,
        'role': user.role,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')

    return JsonResponse({
        'user': {
            'id': user.id,
            'full_name': user.full_name,
            'cedula': user.cedula,
            'email': user.email,
            'phone': user.phone,
            'role': user.role,
            'created_at': serialize_datetime(user.created_at)
        },
        'token': token
    }, status=201)


@csrf_exempt
def login_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido.'}, status=405)

    data = parse_json_body(request)
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return JsonResponse({'error': 'Por favor ingrese correo y contraseña.'}, status=400)

    clean_email = email.strip().lower()
    user = User.objects.filter(email=clean_email).first()

    if not user:
        return JsonResponse({'error': 'Credenciales inválidas.'}, status=401)

    try:
        is_match = bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8'))
    except Exception:
        is_match = False

    if not is_match:
        return JsonResponse({'error': 'Credenciales inválidas.'}, status=401)

    payload = {
        'id': user.id,
        'email': user.email,
        'role': user.role,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')

    return JsonResponse({
        'user': {
            'id': user.id,
            'full_name': user.full_name,
            'cedula': user.cedula,
            'email': user.email,
            'phone': user.phone,
            'role': user.role,
            'created_at': serialize_datetime(user.created_at)
        },
        'token': token
    })


# ==========================================
# CATALOG VIEWS
# ==========================================
DEFAULT_SPECIALTIES = [
    {
        'id': 1,
        'name': 'Medicina Interna',
        'description': 'Evaluación integral, diagnóstico y tratamiento de enfermedades del adulto y afecciones crónicas.',
        'icon': 'Stethoscope',
        'is_featured': True
    },
    {
        'id': 2,
        'name': 'Neurocirugía',
        'description': 'Intervenciones quirúrgicas complejas de cerebro, columna vertebral y sistema nervioso central.',
        'icon': 'Brain',
        'is_featured': True
    },
    {
        'id': 3,
        'name': 'Traumatología',
        'description': 'Cirugía articular, reparación ósea, ligamentos, reemplazos protésicos y traumatología ortopédica.',
        'icon': 'Bone',
        'is_featured': True
    },
    {
        'id': 4,
        'name': 'Psicología',
        'description': 'Evaluación neuropsicológica, terapia clínica especializada y acompañamiento de salud mental.',
        'icon': 'UserCheck',
        'is_featured': False
    }
]

DEFAULT_SERVICES = [
    {
        'id': 101,
        'name': 'Perfil 20 (Laboratorio)',
        'category': 'Laboratorio Clínico',
        'description': 'Hematología completa, química sanguínea, perfil lipídico, glucosa, urea, creatinina y funcional renal/hepático.',
        'estimated_cost': 45.00,
        'icon': 'FlaskConical'
    },
    {
        'id': 102,
        'name': 'Eco Abdominal',
        'category': 'Imagenología',
        'description': 'Ecografía médica de alta definición para exploración de órganos abdominales y pélvicos.',
        'estimated_cost': 70.00,
        'icon': 'Activity'
    },
    {
        'id': 103,
        'name': 'Rayos X',
        'category': 'Radiología',
        'description': 'Estudios radiológicos digitales de tórax, columna, tórax y extremidades con informe médico.',
        'estimated_cost': 50.00,
        'icon': 'FileSearch'
    },
    {
        'id': 104,
        'name': 'Electromiografía',
        'category': 'Neurofisiología',
        'description': 'Estudio neurofisiológico de conducción nerviosa y actividad muscular electromiográfica.',
        'estimated_cost': 120.00,
        'icon': 'Zap'
    }
]


def specialties_view(request):
    try:
        specialties = Specialty.objects.all().order_by('-is_featured', 'name')
        if specialties.exists():
            data = [{
                'id': s.id,
                'name': s.name,
                'description': s.description,
                'icon': s.icon,
                'is_featured': s.is_featured
            } for s in specialties]
            return JsonResponse(data, safe=False)
    except Exception:
        pass
    return JsonResponse(DEFAULT_SPECIALTIES, safe=False)


def services_view(request):
    return JsonResponse(DEFAULT_SERVICES, safe=False)



def clinics_view(request):
    clinics = Clinic.objects.filter(is_active=True).order_by('name')
    data = [{
        'id': c.id,
        'name': c.name,
        'city': c.city,
        'address': c.address,
        'phone': c.phone,
        'image_url': c.image_url,
        'is_active': c.is_active
    } for c in clinics]
    return JsonResponse(data, safe=False)


def doctors_view(request):
    specialty_id = request.GET.get('specialty_id')
    clinic_id = request.GET.get('clinic_id')

    queryset = Doctor.objects.select_related('specialty', 'clinic').all()

    if specialty_id:
        queryset = queryset.filter(specialty_id=specialty_id)
    if clinic_id:
        queryset = queryset.filter(clinic_id=clinic_id)

    queryset = queryset.order_by('full_name')

    data = [{
        'id': d.id,
        'user_id': d.user_id,
        'full_name': d.full_name,
        'specialty_id': d.specialty_id,
        'clinic_id': d.clinic_id,
        'subspecialty': d.subspecialty,
        'mpps_code': d.mpps_code,
        'avatar_url': d.avatar_url,
        'specialty_name': d.specialty.name if d.specialty else '',
        'clinic_name': d.clinic.name if d.clinic else ''
    } for d in queryset]

    return JsonResponse(data, safe=False)


# ==========================================
# CREDIT REQUESTS VIEWS
# ==========================================
def save_uploaded_file(file_obj, field_name):
    os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
    ext = os.path.splitext(file_obj.name)[1]
    unique_suffix = f"{int(time.time() * 1000)}-{random.randint(100000, 999999)}"
    filename = f"{field_name}-{unique_suffix}{ext}"
    dest_path = os.path.join(settings.MEDIA_ROOT, filename)

    with open(dest_path, 'wb+') as destination:
        for chunk in file_obj.chunks():
            destination.write(chunk)

    return filename, f"/uploads/{filename}"


@csrf_exempt
def create_request_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido.'}, status=405)

    data = request.POST
    patient_id = data.get('patient_id')
    clinic_id = data.get('clinic_id') or 1
    doctor_id = data.get('doctor_id') or 1
    specialty_id = data.get('specialty_id') or 1
    procedure_name = data.get('procedure_name')
    requested_amount = data.get('requested_amount')

    if not patient_id or not procedure_name or not requested_amount:
        return JsonResponse({'error': 'Por favor complete todos los campos obligatorios del procedimiento o estudio.'}, status=400)

    try:
        num_requested = float(requested_amount)
        num_down_pct = float(data.get('down_payment_percentage', 20.0))
        num_installments = int(data.get('installments_count', 6))

        down_amount = round(num_requested * (num_down_pct / 100.0), 2)
        remaining_amount = num_requested - down_amount
        installment_amount = round(remaining_amount / num_installments, 2)

        report_date = data.get('report_date') or date.today().isoformat()

        with transaction.atomic():
            cr = CreditRequest.objects.create(
                patient_id=patient_id,
                clinic_id=clinic_id,
                doctor_id=doctor_id,
                specialty_id=specialty_id,
                procedure_name=procedure_name,
                requested_amount=num_requested,
                approved_amount=num_requested,
                down_payment_percentage=num_down_pct,
                down_payment_amount=down_amount,
                installments_count=num_installments,
                installment_amount=installment_amount,
                report_date=report_date,
                medical_notes=data.get('medical_notes', ''),
                patient_cedula=data.get('patient_cedula', ''),
                patient_phone=data.get('patient_phone', ''),
                emergency_contact=data.get('emergency_contact', ''),
                status='PENDING'
            )

            attachment_records = []
            files = request.FILES

            if 'medical_report' in files:
                f = files['medical_report']
                fname, fpath = save_uploaded_file(f, 'medical_report')
                att = Attachment.objects.create(
                    credit_request=cr,
                    attachment_type='MEDICAL_REPORT',
                    file_name=f.name,
                    file_path=fpath,
                    file_type=f.content_type
                )
                attachment_records.append({
                    'id': att.id,
                    'credit_request_id': cr.id,
                    'attachment_type': att.attachment_type,
                    'file_name': att.file_name,
                    'file_path': att.file_path,
                    'file_type': att.file_type,
                    'uploaded_at': serialize_datetime(att.uploaded_at)
                })

            if 'clinic_budget' in files:
                f = files['clinic_budget']
                fname, fpath = save_uploaded_file(f, 'clinic_budget')
                att = Attachment.objects.create(
                    credit_request=cr,
                    attachment_type='CLINIC_BUDGET',
                    file_name=f.name,
                    file_path=fpath,
                    file_type=f.content_type
                )
                attachment_records.append({
                    'id': att.id,
                    'credit_request_id': cr.id,
                    'attachment_type': att.attachment_type,
                    'file_name': att.file_name,
                    'file_path': att.file_path,
                    'file_type': att.file_type,
                    'uploaded_at': serialize_datetime(att.uploaded_at)
                })

        return JsonResponse({
            'message': 'Solicitud de crédito creada exitosamente. En proceso de revisión.',
            'credit_request': serialize_credit_request(cr),
            'attachments': attachment_records
        }, status=201)

    except Exception as e:
        print("Error al crear solicitud:", str(e))
        return JsonResponse({'error': 'Error interno al procesar la solicitud de crédito.'}, status=500)


def my_requests_view(request, patient_id):
    requests_qs = CreditRequest.objects.filter(patient_id=patient_id).select_related('clinic', 'doctor', 'specialty').order_by('-created_at')

    result = []
    for cr in requests_qs:
        cr_dict = serialize_credit_request(cr)
        attachments = Attachment.objects.filter(credit_request_id=cr.id)
        cr_dict['attachments'] = [{
            'id': a.id,
            'credit_request_id': a.credit_request_id,
            'attachment_type': a.attachment_type,
            'file_name': a.file_name,
            'file_path': a.file_path,
            'file_type': a.file_type,
            'uploaded_at': serialize_datetime(a.uploaded_at)
        } for a in attachments]
        result.append(cr_dict)

    return JsonResponse(result, safe=False)


def serialize_credit_request(cr):
    return {
        'id': cr.id,
        'patient_id': cr.patient_id,
        'clinic_id': cr.clinic_id,
        'doctor_id': cr.doctor_id,
        'specialty_id': cr.specialty_id,
        'procedure_name': cr.procedure_name,
        'requested_amount': serialize_decimal(cr.requested_amount),
        'approved_amount': serialize_decimal(cr.approved_amount),
        'down_payment_percentage': serialize_decimal(cr.down_payment_percentage),
        'down_payment_amount': serialize_decimal(cr.down_payment_amount),
        'installments_count': cr.installments_count,
        'installment_amount': serialize_decimal(cr.installment_amount),
        'report_date': serialize_datetime(cr.report_date),
        'medical_notes': cr.medical_notes,
        'patient_cedula': cr.patient_cedula,
        'patient_phone': cr.patient_phone,
        'emergency_contact': cr.emergency_contact,
        'status': cr.status,
        'admin_notes': cr.admin_notes,
        'created_at': serialize_datetime(cr.created_at),
        'updated_at': serialize_datetime(cr.updated_at),
        'clinic_name': cr.clinic.name if cr.clinic else '',
        'clinic_city': cr.clinic.city if cr.clinic else '',
        'doctor_name': cr.doctor.full_name if cr.doctor else '',
        'doctor_subspecialty': cr.doctor.subspecialty if cr.doctor else '',
        'specialty_name': cr.specialty.name if cr.specialty else '',
    }


# ==========================================
# ADMIN VIEWS
# ==========================================
def admin_credit_requests_view(request):
    status = request.GET.get('status')
    search = request.GET.get('search')

    queryset = CreditRequest.objects.select_related('patient', 'clinic', 'doctor', 'specialty').all()

    if status and status != 'ALL':
        queryset = queryset.filter(status=status)

    if search:
        queryset = queryset.filter(
            Q(patient__full_name__icontains=search) |
            Q(patient_cedula__icontains=search) |
            Q(procedure_name__icontains=search)
        )

    queryset = queryset.order_by('-created_at')

    result = []
    for cr in queryset:
        cr_dict = serialize_credit_request(cr)
        cr_dict['patient_name'] = cr.patient.full_name if cr.patient else ''
        cr_dict['patient_email'] = cr.patient.email if cr.patient else ''
        cr_dict['patient_user_phone'] = cr.patient.phone if cr.patient else ''

        attachments = Attachment.objects.filter(credit_request_id=cr.id)
        cr_dict['attachments'] = [{
            'id': a.id,
            'credit_request_id': a.credit_request_id,
            'attachment_type': a.attachment_type,
            'file_name': a.file_name,
            'file_path': a.file_path,
            'file_type': a.file_type,
            'uploaded_at': serialize_datetime(a.uploaded_at)
        } for a in attachments]

        result.append(cr_dict)

    return JsonResponse(result, safe=False)


def admin_stats_view(request):
    total_agg = CreditRequest.objects.aggregate(
        count=Count('id'),
        total_requested=Sum('requested_amount')
    )
    pending_count = CreditRequest.objects.filter(status__in=['PENDING', 'UNDER_REVIEW']).count()
    approved_agg = CreditRequest.objects.filter(status='APPROVED').aggregate(
        count=Count('id'),
        total_approved=Sum('approved_amount')
    )
    clinics_count = Clinic.objects.filter(is_active=True).count()
    doctors_count = Doctor.objects.count()

    return JsonResponse({
        'total_requests': total_agg['count'] or 0,
        'total_requested_amount': float(total_agg['total_requested'] or 0.0),
        'pending_count': pending_count,
        'approved_count': approved_agg['count'] or 0,
        'total_approved_amount': float(approved_agg['total_approved'] or 0.0),
        'active_clinics': clinics_count,
        'active_doctors': doctors_count
    })


@csrf_exempt
def admin_update_status_view(request, req_id):
    if request.method not in ['PATCH', 'POST']:
        return JsonResponse({'error': 'Método no permitido.'}, status=405)

    data = parse_json_body(request)
    status = data.get('status')

    if not status:
        return JsonResponse({'error': 'El estatus es requerido.'}, status=400)

    cr = CreditRequest.objects.filter(id=req_id).first()
    if not cr:
        return JsonResponse({'error': 'Solicitud no encontrada.'}, status=404)

    approved_amount = float(data.get('approved_amount')) if data.get('approved_amount') is not None else float(cr.requested_amount)
    down_pct = float(data.get('down_payment_percentage')) if data.get('down_payment_percentage') is not None else float(cr.down_payment_percentage or 20.0)
    installments_count = int(data.get('installments_count')) if data.get('installments_count') is not None else int(cr.installments_count or 6)

    calculated_down = round(approved_amount * (down_pct / 100.0), 2)
    remaining_to_finance = approved_amount - calculated_down
    calculated_installment = round(remaining_to_finance / installments_count, 2)

    cr.status = status
    cr.approved_amount = approved_amount
    cr.down_payment_percentage = down_pct
    cr.down_payment_amount = calculated_down
    cr.installments_count = installments_count
    cr.installment_amount = calculated_installment
    cr.admin_notes = data.get('admin_notes', cr.admin_notes or '')
    cr.save()

    return JsonResponse({
        'message': f"Solicitud #{req_id} actualizada a estatus '{status}'.",
        'credit_request': serialize_credit_request(cr)
    })


# ==========================================
# PAYMENTS VIEWS
# ==========================================
def ensure_schedule_exists(cr):
    count = PaymentSchedule.objects.filter(credit_request=cr).count()
    if count == 0:
        num_installments = int(cr.installments_count or 18)
        amount_per_installment = float(cr.installment_amount or (float(cr.approved_amount or 0) / num_installments))

        start_date = date.today()
        schedules = []

        for i in range(1, num_installments + 1):
            # Calculate due_date + i months
            month = start_date.month - 1 + i
            year = start_date.year + month // 12
            month = month % 12 + 1
            day = min(start_date.day, 28)
            due_date = date(year, month, day)

            schedules.append(PaymentSchedule(
                credit_request=cr,
                installment_number=i,
                due_date=due_date,
                amount=amount_per_installment,
                status='PENDING'
            ))

        PaymentSchedule.objects.bulk_create(schedules)


def my_payments_view(request, patient_id):
    requests_qs = CreditRequest.objects.filter(patient_id=patient_id).select_related('clinic', 'doctor', 'specialty').order_by('-created_at')

    requests_list = []
    all_schedules = []

    for cr in requests_qs:
        if cr.status == 'APPROVED':
            ensure_schedule_exists(cr)

        sched_qs = PaymentSchedule.objects.filter(credit_request=cr).select_related('credit_request', 'credit_request__clinic').order_by('installment_number')

        sched_data = [{
            'id': ps.id,
            'credit_request_id': ps.credit_request_id,
            'installment_number': ps.installment_number,
            'due_date': serialize_datetime(ps.due_date),
            'amount': serialize_decimal(ps.amount),
            'status': ps.status,
            'paid_at': serialize_datetime(ps.paid_at),
            'payment_support_url': ps.payment_support_url,
            'payment_method': ps.payment_method,
            'reference_number': ps.reference_number,
            'admin_notes': ps.admin_notes,
            'procedure_name': cr.procedure_name,
            'clinic_name': cr.clinic.name if cr.clinic else ''
        } for ps in sched_qs]

        cr_dict = serialize_credit_request(cr)
        cr_dict['schedule'] = sched_data
        requests_list.append(cr_dict)
        all_schedules.extend(sched_data)

    total_paid = 0.0
    total_pending = 0.0
    total_overdue = 0.0

    for item in all_schedules:
        amt = float(item['amount'] or 0.0)
        st = item['status']
        if st == 'PAGADO':
            total_paid += amt
        elif st == 'OVERDUE':
            total_overdue += amt
        else:
            total_pending += amt

    return JsonResponse({
        'requests': requests_list,
        'allSchedules': all_schedules,
        'summary': {
            'totalPaid': round(total_paid, 2),
            'totalPending': round(total_pending, 2),
            'totalOverdue': round(total_overdue, 2),
            'totalInstallments': len(all_schedules)
        }
    })


@csrf_exempt
def submit_support_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido.'}, status=405)

    data = request.POST
    schedule_id = data.get('schedule_id')
    reference_number = data.get('reference_number', '')
    payment_method = data.get('payment_method', 'TRANSFERENCIA')

    if not schedule_id:
        return JsonResponse({'error': 'El ID de la cuota es requerido.'}, status=400)

    ps = PaymentSchedule.objects.filter(id=schedule_id).first()
    if not ps:
        return JsonResponse({'error': 'Cuota de pago no encontrada.'}, status=404)

    support_url = ps.payment_support_url
    if 'payment_support' in request.FILES:
        _, support_url = save_uploaded_file(request.FILES['payment_support'], 'payment_support')

    ps.status = 'PAGADO'
    ps.paid_at = datetime.now()
    if support_url:
        ps.payment_support_url = support_url
    if reference_number:
        ps.reference_number = reference_number
    if payment_method:
        ps.payment_method = payment_method

    ps.save()

    return JsonResponse({
        'message': 'Comprobante de pago enviado y registrado exitosamente.',
        'schedule': {
            'id': ps.id,
            'credit_request_id': ps.credit_request_id,
            'installment_number': ps.installment_number,
            'due_date': serialize_datetime(ps.due_date),
            'amount': serialize_decimal(ps.amount),
            'status': ps.status,
            'paid_at': serialize_datetime(ps.paid_at),
            'payment_support_url': ps.payment_support_url,
            'payment_method': ps.payment_method,
            'reference_number': ps.reference_number,
            'admin_notes': ps.admin_notes
        }
    })


def admin_all_payments_view(request):
    status = request.GET.get('status')

    queryset = PaymentSchedule.objects.select_related(
        'credit_request',
        'credit_request__patient',
        'credit_request__clinic'
    ).all()

    if status and status != 'ALL':
        queryset = queryset.filter(status=status)

    queryset = queryset.order_by('due_date', 'installment_number')

    result = []
    for ps in queryset:
        cr = ps.credit_request
        patient = cr.patient if cr else None
        clinic = cr.clinic if cr else None

        result.append({
            'id': ps.id,
            'credit_request_id': ps.credit_request_id,
            'installment_number': ps.installment_number,
            'due_date': serialize_datetime(ps.due_date),
            'amount': serialize_decimal(ps.amount),
            'status': ps.status,
            'paid_at': serialize_datetime(ps.paid_at),
            'payment_support_url': ps.payment_support_url,
            'payment_method': ps.payment_method,
            'reference_number': ps.reference_number,
            'admin_notes': ps.admin_notes,
            'procedure_name': cr.procedure_name if cr else '',
            'patient_cedula': cr.patient_cedula if cr else '',
            'patient_name': patient.full_name if patient else '',
            'patient_email': patient.email if patient else '',
            'patient_phone': patient.phone if patient else '',
            'clinic_name': clinic.name if clinic else ''
        })

    return JsonResponse(result, safe=False)


@csrf_exempt
def admin_verify_payment_view(request, schedule_id):
    if request.method not in ['PATCH', 'POST']:
        return JsonResponse({'error': 'Método no permitido.'}, status=405)

    data = parse_json_body(request)
    status = data.get('status')
    admin_notes = data.get('admin_notes')

    if not status:
        return JsonResponse({'error': 'El nuevo estatus es requerido.'}, status=400)

    ps = PaymentSchedule.objects.filter(id=schedule_id).first()
    if not ps:
        return JsonResponse({'error': 'Registro de cuota no encontrado.'}, status=404)

    ps.status = status
    if admin_notes is not None:
        ps.admin_notes = admin_notes

    if status == 'PAGADO' and ps.paid_at is None:
        ps.paid_at = datetime.now()

    ps.save()

    return JsonResponse({
        'message': f"Estatus de cuota actualizado a '{status}'.",
        'schedule': {
            'id': ps.id,
            'credit_request_id': ps.credit_request_id,
            'installment_number': ps.installment_number,
            'due_date': serialize_datetime(ps.due_date),
            'amount': serialize_decimal(ps.amount),
            'status': ps.status,
            'paid_at': serialize_datetime(ps.paid_at),
            'payment_support_url': ps.payment_support_url,
            'payment_method': ps.payment_method,
            'reference_number': ps.reference_number,
            'admin_notes': ps.admin_notes
        }
    })
