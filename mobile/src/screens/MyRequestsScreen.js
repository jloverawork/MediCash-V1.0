import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import RequestTracker from '../components/RequestTracker';
import { API_BASE_URL } from '../api/config';
import { COLORS } from '../theme/colors';

export default function MyRequestsScreen({ user }) {
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/my-requests/${user.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data);
      }
    } catch (e) {
      console.log('Error fetching my requests:', e);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchRequests}
          colors={[COLORS.primary]}
        />
      }
    >
      <RequestTracker requests={requests} onRefresh={fetchRequests} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, paddingBottom: 40 },
});
