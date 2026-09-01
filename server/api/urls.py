from django.urls import path
from . import views

urlpatterns = [
    # Health check
    path('health', views.health_check, name='health_check'),

    # Auth routes
    path('auth/register', views.register_view, name='register'),
    path('auth/login', views.login_view, name='login'),

    # Catalog routes
    path('catalog/specialties', views.specialties_view, name='specialties'),
    path('catalog/clinics', views.clinics_view, name='clinics'),
    path('catalog/doctors', views.doctors_view, name='doctors'),

    # Requests routes
    path('requests', views.create_request_view, name='create_request'),
    path('requests/', views.create_request_view, name='create_request_slash'),
    path('requests/my-requests/<int:patient_id>', views.my_requests_view, name='my_requests'),

    # Admin routes
    path('admin/credit-requests', views.admin_credit_requests_view, name='admin_credit_requests'),
    path('admin/stats', views.admin_stats_view, name='admin_stats'),
    path('admin/credit-requests/<int:req_id>/status', views.admin_update_status_view, name='admin_update_status'),

    # Payments routes
    path('payments/my-payments/<int:patient_id>', views.my_payments_view, name='my_payments'),
    path('payments/submit-support', views.submit_support_view, name='submit_support'),
    path('payments/admin/all-payments', views.admin_all_payments_view, name='admin_all_payments'),
    path('payments/admin/verify/<int:schedule_id>', views.admin_verify_payment_view, name='admin_verify_payment'),
]
