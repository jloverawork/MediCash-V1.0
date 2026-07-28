import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import Header from './src/components/Header';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import MyRequestsScreen from './src/screens/MyRequestsScreen';
import PaymentsScreen from './src/screens/PaymentsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { COLORS } from './src/theme/colors';

function MainApp() {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('new_request'); // 'new_request' | 'my_requests' | 'my_payments' | 'profile'

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Header user={user} onLogout={logout} />

      <View style={styles.content}>
        {activeTab === 'new_request' ? (
          <HomeScreen
            user={user}
            onNavigateToRequests={() => setActiveTab('my_requests')}
          />
        ) : activeTab === 'my_requests' ? (
          <MyRequestsScreen user={user} />
        ) : activeTab === 'my_payments' ? (
          <PaymentsScreen user={user} />
        ) : (
          <ProfileScreen user={user} onLogout={logout} />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('new_request')}
          style={styles.navItem}
        >
          <Ionicons
            name="add-circle"
            size={22}
            color={activeTab === 'new_request' ? COLORS.primary : COLORS.textLight}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'new_request' && styles.navTextActive,
            ]}
          >
            Solicitar Crédito
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('my_requests')}
          style={styles.navItem}
        >
          <Ionicons
            name="clipboard"
            size={22}
            color={activeTab === 'my_requests' ? COLORS.primary : COLORS.textLight}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'my_requests' && styles.navTextActive,
            ]}
          >
            Mis Solicitudes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('my_payments')}
          style={styles.navItem}
        >
          <Ionicons
            name="card"
            size={22}
            color={activeTab === 'my_payments' ? COLORS.primary : COLORS.textLight}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'my_payments' && styles.navTextActive,
            ]}
          >
            Mis Pagos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('profile')}
          style={styles.navItem}
        >
          <Ionicons
            name="person-circle"
            size={22}
            color={activeTab === 'profile' ? COLORS.primary : COLORS.textLight}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'profile' && styles.navTextActive,
            ]}
          >
            Mi Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
  },
  navText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  navTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '900',
  },
});
