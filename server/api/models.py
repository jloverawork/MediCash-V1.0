from django.db import models

class User(models.Model):
    full_name = models.CharField(max_length=150)
    cedula = models.CharField(max_length=20, unique=True)
    email = models.CharField(max_length=150, unique=True)
    password_hash = models.CharField(max_length=255)
    phone = models.CharField(max_length=30)
    role = models.CharField(max_length=20, default='PATIENT')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'
        managed = False  # Use existing PostgreSQL table schema


class Specialty(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, default='Activity')
    is_featured = models.BooleanField(default=False)

    class Meta:
        db_table = 'specialties'
        managed = False


class Clinic(models.Model):
    name = models.CharField(max_length=150)
    city = models.CharField(max_length=100, default='Caracas')
    address = models.TextField()
    phone = models.CharField(max_length=30, blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'clinics'
        managed = False


class Doctor(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, db_column='user_id', null=True, blank=True)
    full_name = models.CharField(max_length=150)
    specialty = models.ForeignKey(Specialty, on_delete=models.CASCADE, db_column='specialty_id')
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, db_column='clinic_id')
    subspecialty = models.CharField(max_length=150, blank=True, null=True)
    mpps_code = models.CharField(max_length=50, blank=True, null=True)
    avatar_url = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'doctors'
        managed = False


class CreditRequest(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, db_column='patient_id')
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, db_column='clinic_id')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, db_column='doctor_id')
    specialty = models.ForeignKey(Specialty, on_delete=models.CASCADE, db_column='specialty_id')
    procedure_name = models.CharField(max_length=200)
    requested_amount = models.DecimalField(max_digits=12, decimal_places=2)
    approved_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    down_payment_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=20.00)
    down_payment_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    installments_count = models.IntegerField(default=6)
    installment_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    report_date = models.DateField(null=True, blank=True)
    medical_notes = models.TextField(blank=True, null=True)
    patient_cedula = models.CharField(max_length=20, blank=True, null=True)
    patient_phone = models.CharField(max_length=30, blank=True, null=True)
    emergency_contact = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=30, default='PENDING')
    admin_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'credit_requests'
        managed = False


class Attachment(models.Model):
    credit_request = models.ForeignKey(CreditRequest, on_delete=models.CASCADE, db_column='credit_request_id')
    attachment_type = models.CharField(max_length=50, default='MEDICAL_REPORT')
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=550)
    file_type = models.CharField(max_length=100, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'attachments'
        managed = False


class PaymentSchedule(models.Model):
    credit_request = models.ForeignKey(CreditRequest, on_delete=models.CASCADE, db_column='credit_request_id')
    installment_number = models.IntegerField()
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, default='PENDING')
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_support_url = models.TextField(null=True, blank=True)
    payment_method = models.CharField(max_length=50, null=True, blank=True)
    reference_number = models.CharField(max_length=100, null=True, blank=True)
    admin_notes = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'payment_schedules'
        managed = False
