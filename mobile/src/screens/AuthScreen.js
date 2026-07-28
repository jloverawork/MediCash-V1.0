import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/config';
import { COLORS } from '../theme/colors';

export default function AuthScreen({ onAuthenticated }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    cedula: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    const endpoint = isRegister ? `${API_BASE_URL}/api/auth/register` : `${API_BASE_URL}/api/auth/login`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al autenticar');
      }

      login(data.user, data.token);
      if (onAuthenticated) onAuthenticated(data.user);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError(`Tiempo de espera agotado al conectar a ${API_BASE_URL}. Verifique que el backend esté corriendo y que su celular esté en la misma red Wi-Fi.`);
      } else if (err.message === 'Network request failed') {
        setError(`Error de red: No se pudo conectar a ${API_BASE_URL}. Asegúrese de estar en la misma red Wi-Fi que su PC.`);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {/* Logo Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="stethoscope" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.brandTitle}>MediCash</Text>
            <Text style={styles.brandSubtitle}>
              {isRegister
                ? 'Crea tu cuenta de paciente para solicitar financiamiento'
                : 'Ingresa a tu cuenta para solicitar tu crédito quirúrgico'}
            </Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Input Fields */}
          <View style={styles.form}>
            {isRegister && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nombre Completo</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={18} color={COLORS.textLight} />
                  <TextInput
                    style={styles.input}
                    value={formData.full_name}
                    onChangeText={(v) => setFormData({ ...formData, full_name: v })}
                    placeholder="Carlos Mendoza"
                    placeholderTextColor={COLORS.textLight}
                  />
                </View>
              </View>
            )}

            {isRegister && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Cédula de Identidad</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="card-outline" size={18} color={COLORS.textLight} />
                  <TextInput
                    style={styles.input}
                    value={formData.cedula}
                    onChangeText={(v) => setFormData({ ...formData, cedula: v })}
                    placeholder="V-18452930"
                    placeholderTextColor={COLORS.textLight}
                  />
                </View>
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={COLORS.textLight} />
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(v) => setFormData({ ...formData, email: v })}
                  placeholder="paciente@email.com"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
            </View>

            {isRegister && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Teléfono Móvil</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={18} color={COLORS.textLight} />
                  <TextInput
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(v) => setFormData({ ...formData, phone: v })}
                    placeholder="+58 414 1234567"
                    placeholderTextColor={COLORS.textLight}
                  />
                </View>
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textLight} />
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(v) => setFormData({ ...formData, password: v })}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              disabled={loading}
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <View style={styles.btnRow}>
                  <Text style={styles.submitButtonText}>
                    {isRegister ? 'Registrarse en MediCash' : 'Iniciar Sesión'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Toggle Register/Login */}
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            <Text style={styles.toggleBtnText}>
              {isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate aquí'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footerShield}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.accent} />
            <Text style={styles.footerShieldText}>Datos protegidos con encriptación médica SSL</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    gap: 16,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  header: {
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  errorBox: {
    backgroundColor: COLORS.dangerLight,
    borderColor: COLORS.danger,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
    textAlign: 'center',
  },
  form: {
    gap: 12,
  },
  fieldGroup: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
    height: 46,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 2,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.white,
  },
  toggleBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    textDecorationLine: 'underline',
  },
  footerShield: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerShieldText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
