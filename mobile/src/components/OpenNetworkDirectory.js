import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Linking,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function OpenNetworkDirectory({
  onReturnToHub,
  onSelectForFinancing,
}) {
  const [activeCategory, setActiveCategory] = useState('specialists'); // 'specialists' | 'services'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  const mockSpecialists = [
    {
      id: 1,
      full_name: 'Dr. Roberto Mendoza',
      branch: 'Medicina Interna',
      subspecialty: 'Medicina Crítica e Intensiva',
      mpps: 'MPPS 45.892',
      city: 'Caracas',
      clinic: 'Clínica San Sofía',
      address: 'El Cafetal, Av. Principal',
      phone: '+58 412-5550192',
      experience: '16 años exp.',
      rating: '4.9 ★★★★★',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
    },
    {
      id: 2,
      full_name: 'Dra. María Elena Rivas',
      branch: 'Neurocirugía',
      subspecialty: 'Cirugía de Columna y Base de Cráneo',
      mpps: 'MPPS 52.104',
      city: 'Caracas',
      clinic: 'Centro Médico Docente La Trinidad',
      address: 'La Trinidad, Av. Intercomunal',
      phone: '+58 414-9988112',
      experience: '14 años exp.',
      rating: '5.0 ★★★★★',
      avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78341?w=150',
    },
    {
      id: 3,
      full_name: 'Dr. Carlos Eduardo Páez',
      branch: 'Traumatología',
      subspecialty: 'Ortopedia y Reemplazos Articulares',
      mpps: 'MPPS 39.420',
      city: 'Valencia',
      clinic: 'Policlínica Metropolitana Valencia',
      address: 'El Viñedo, Av. Bolivar Norte',
      phone: '+58 424-3344556',
      experience: '20 años exp.',
      rating: '4.8 ★★★★★',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
    },
    {
      id: 4,
      full_name: 'Dra. Patricia Salazar',
      branch: 'Psicología',
      subspecialty: 'Psicología Clínica y Evaluación Neurocognitiva',
      mpps: 'FPV 12.450',
      city: 'Maracaibo',
      clinic: 'Centro de Especialidades Médicas Zulia',
      address: 'Bella Vista, Av. 4',
      phone: '+58 416-7788990',
      experience: '11 años exp.',
      rating: '4.9 ★★★★★',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    },
  ];

  const mockDiagnosticServices = [
    {
      id: 201,
      name: 'Perfil 20 Completo',
      category: 'Laboratorio Clínico',
      center: 'Laboratorio Clínico BioSalud',
      city: 'Caracas',
      address: 'Chacao, Av. Francisco de Miranda',
      phone: '+58 212-9510011',
      coverage: 'Cobertura Nacional',
      price: '$45.00 USD',
      icon: 'vial',
    },
    {
      id: 202,
      name: 'Eco Abdominal Doppler HD',
      category: 'Imagenología Avanzada',
      center: 'Centro de Imagenología Diagnostic MediCash',
      city: 'Caracas',
      address: 'Las Mercedes, Calle París',
      phone: '+58 212-9934455',
      coverage: 'Equipos 4D Alta Definición',
      price: '$70.00 USD',
      icon: 'heartbeat',
    },
    {
      id: 203,
      name: 'Rayos X Digitales Torácicos y Columna',
      category: 'Radiología',
      center: 'Centro Radiológico Digital',
      city: 'Valencia',
      address: 'Naguanagua, Av. Universidad',
      phone: '+58 241-8866554',
      coverage: 'Entrega Digital Inmediata',
      price: '$50.00 USD',
      icon: 'x-ray',
    },
    {
      id: 204,
      name: 'Electromiografía de 4 Extremidades',
      category: 'Neurofisiología',
      center: 'Instituto Neurofisiológico de Venezuela',
      city: 'Caracas',
      address: 'San Bernardino, Av. Juan Germán Roscio',
      phone: '+58 212-5743322',
      coverage: 'Informe Médico Especializado',
      price: '$120.00 USD',
      icon: 'bolt',
    },
  ];

  const filteredSpecialists = mockSpecialists.filter((doc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doc.full_name.toLowerCase().includes(q) ||
      doc.branch.toLowerCase().includes(q) ||
      doc.subspecialty.toLowerCase().includes(q) ||
      doc.clinic.toLowerCase().includes(q);

    const matchesBranch = selectedBranch === 'all' || doc.branch === selectedBranch;
    const matchesCity = selectedCity === 'all' || doc.city === selectedCity;

    return matchesSearch && matchesBranch && matchesCity;
  });

  const filteredServices = mockDiagnosticServices.filter((srv) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      srv.name.toLowerCase().includes(q) ||
      srv.category.toLowerCase().includes(q) ||
      srv.center.toLowerCase().includes(q);

    const matchesCity = selectedCity === 'all' || srv.city === selectedCity;

    return matchesSearch && matchesCity;
  });

  const handleCall = (phoneNumber) => {
    const cleanNum = phoneNumber.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNum}`);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Top Bar with Return Button */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.returnBtn} onPress={onReturnToHub}>
          <Ionicons name="arrow-back" size={14} color={COLORS.primaryDark} />
          <Text style={styles.returnBtnText}>Volver al Hub</Text>
        </TouchableOpacity>

        <View style={styles.badgeTop}>
          <Text style={styles.badgeTopText}>Red Abierta MediCash</Text>
        </View>
      </View>

      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTitleRow}>
          <FontAwesome5 name="globe" size={18} color="#2DD4BF" />
          <Text style={styles.headerTitle}>Directorio Informativo Médico</Text>
        </View>
        <Text style={styles.headerDesc}>
          Consulta especialistas afiliados por rama médica, ubicación y centros diagnósticos disponibles.
        </Text>
      </View>

      {/* Category Tabs: Category 1 vs Category 2 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeCategory === 'specialists' && styles.tabBtnActive]}
          onPress={() => setActiveCategory('specialists')}
        >
          <FontAwesome5
            name="user-md"
            size={14}
            color={activeCategory === 'specialists' ? COLORS.primary : COLORS.textMuted}
          />
          <Text style={[styles.tabBtnText, activeCategory === 'specialists' && styles.tabBtnTextActive]}>
            1. Especialistas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeCategory === 'services' && styles.tabBtnActive]}
          onPress={() => setActiveCategory('services')}
        >
          <FontAwesome5
            name="hospital-symbol"
            size={14}
            color={activeCategory === 'services' ? COLORS.accent : COLORS.textMuted}
          />
          <Text style={[styles.tabBtnText, activeCategory === 'services' && styles.tabBtnTextActive]}>
            2. Servicios Diagnósticos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder={
            activeCategory === 'specialists'
              ? 'Buscar médico, especialidad o clínica...'
              : 'Buscar examen, laboratorio o ciudad...'
          }
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* City Chips Filter */}
      <View style={styles.cityChipsRow}>
        {['all', 'Caracas', 'Valencia', 'Maracaibo'].map((city) => (
          <TouchableOpacity
            key={city}
            onPress={() => setSelectedCity(city)}
            style={[styles.cityChip, selectedCity === city && styles.cityChipActive]}
          >
            <Text style={[styles.cityChipText, selectedCity === city && styles.cityChipTextActive]}>
              {city === 'all' ? 'Todas Ciudades' : city}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SPECIALISTS LIST */}
      {activeCategory === 'specialists' && (
        <View style={styles.list}>
          {filteredSpecialists.map((doc) => (
            <View key={doc.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Image source={{ uri: doc.avatar }} style={styles.avatar} />
                <View style={styles.cardMainInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.docName}>{doc.full_name}</Text>
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingText}>{doc.rating}</Text>
                    </View>
                  </View>

                  <Text style={styles.docBranch}>{doc.branch}</Text>
                  <Text style={styles.docSub}>{doc.subspecialty}</Text>

                  <View style={styles.badgeRow}>
                    <Text style={styles.mppsBadge}>{doc.mpps}</Text>
                    <Text style={styles.expBadge}>{doc.experience}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <FontAwesome5 name="hospital" size={12} color={COLORS.primary} />
                  <Text style={styles.detailText}>
                    <Text style={{ fontWeight: '800' }}>{doc.clinic}</Text> ({doc.city})
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="location" size={14} color={COLORS.textMuted} />
                  <Text style={styles.detailText}>{doc.address}</Text>
                </View>

                <TouchableOpacity style={styles.phoneRow} onPress={() => handleCall(doc.phone)}>
                  <Ionicons name="call" size={14} color={COLORS.primaryDark} />
                  <Text style={styles.phoneText}>{doc.phone}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* DIAGNOSTIC SERVICES LIST */}
      {activeCategory === 'services' && (
        <View style={styles.list}>
          {filteredServices.map((srv) => (
            <View key={srv.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.iconBoxService}>
                  <FontAwesome5 name={srv.icon} size={22} color={COLORS.accent} />
                </View>
                <View style={styles.cardMainInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.docName}>{srv.name}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{srv.category}</Text>
                    </View>
                  </View>

                  <Text style={styles.centerName}>{srv.center}</Text>

                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={13} color={COLORS.textMuted} />
                    <Text style={styles.detailText}>
                      {srv.city} - {srv.address}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.costFooter}>
                <View style={styles.covBadge}>
                  <Text style={styles.covBadgeText}>{srv.coverage}</Text>
                </View>
                <Text style={styles.priceVal}>{srv.price}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, gap: 14, paddingBottom: 40 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  returnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  returnBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  badgeTop: {
    backgroundColor: COLORS.textDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTopText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#2DD4BF',
  },
  headerBanner: {
    backgroundColor: COLORS.textDark,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
  },
  headerDesc: {
    fontSize: 11,
    color: COLORS.textLight,
    lineHeight: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardAlt,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 3,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabBtnTextActive: {
    fontWeight: '900',
    color: COLORS.textDark,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
  },
  cityChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  cityChip: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  cityChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cityChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  cityChipTextActive: {
    color: COLORS.white,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  iconBoxService: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMainInfo: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docName: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textDark,
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: COLORS.goldLight,
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.gold,
  },
  docBranch: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  docSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  centerName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  mppsBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  expBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.accent,
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardDetails: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 11,
    color: COLORS.textDark,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  phoneText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
    textDecorationLine: 'underline',
  },
  costFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  covBadge: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  covBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  priceVal: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.accent,
  },
  categoryBadge: {
    backgroundColor: COLORS.accentLight,
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.accent,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.white,
  },
});
