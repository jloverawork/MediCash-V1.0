import { Platform } from 'react-native';

// In Expo development, change this IP to your local PC Wi-Fi IP address if testing on a physical phone with Expo GO!
// For Android Emulator, 10.0.2.2 points to localhost.
// For iOS Simulator or web, localhost works directly.

const LOCAL_PC_IP = '192.168.1.13'; // IP red Wi-Fi local

export const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    // If running on emulator or device
    return `http://${LOCAL_PC_IP}:5000`;
  } else if (Platform.OS === 'ios') {
    return `http://${LOCAL_PC_IP}:5000`;
  }
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();
