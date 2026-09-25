import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Alert,
  Easing,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';
import { crearTablero } from '../api/tableros';
 
// ---- Paleta de la ruleta: SIN TOCAR ----
const COLORS = [
  '#EF3340', '#F97316', '#FACC15', '#84CC16', '#10B981',
  '#14B8A6', '#38BDF8', '#3B82F6', '#4F46E5', '#8B5CF6',
  '#C026D3', '#E11D48', '#FB7185', '#A855F7', '#22D3EE',
];
 
// ---- Tokens de la PANTALLA (esto sí cambió) ----
const THEME = {
  bg: '#0B1220',
  surface: '#141C30',
  border: '#233047',
  accent: '#66F1C2',
  accentTextOn: '#06251B',
  textPrimary: '#F8FAFC',
  textMuted: '#8896AC',
  disabled: '#3A4763',
};
 
const WHEEL_SIZE = 320;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = 150;
const SEGMENT_ANGLE = 360 / COLORS.length;
 
function polarToCartesian(angle) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * Math.cos(radians),
    y: CENTER + RADIUS * Math.sin(radians),
  };
}
 
function segmentPath(index) {
  const start = polarToCartesian(index * SEGMENT_ANGLE);
  const end = polarToCartesian((index + 1) * SEGMENT_ANGLE);
  const largeArcFlag = SEGMENT_ANGLE > 180 ? 1 : 0;
 
  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}
 
export default function SpinScreen({ navigation }) {
  const { usuario } = useAuth();
  const rotation = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreTablero, setNombreTablero] = useState('');
  const [guardando, setGuardando] = useState(false);
 
  const spin = () => {
    if (isSpinning) return;
 
    const selectedIndex = Math.floor(Math.random() * COLORS.length);
    const extraTurns = 5 + Math.floor(Math.random() * 3);
 
    const landingAngle = 360 - (selectedIndex + 0.5) * SEGMENT_ANGLE;
    const baseRotation = currentRotation.current - (currentRotation.current % 360);
    const targetRotation = baseRotation + extraTurns * 360 + landingAngle;
 
    currentRotation.current = targetRotation;
    setSelectedColor(null);
    setIsSpinning(true);
 
    Animated.timing(rotation, {
      toValue: targetRotation,
      duration: 3600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      setIsSpinning(false);
      setSelectedColor(COLORS[selectedIndex]);
    });
  };
 
  const handleSave = () => {
    if (!selectedColor) return;
    setNombreTablero('');
    setModalVisible(true);
  };

  const guardarTablero = async () => {
    const nombre = nombreTablero.trim();
    if (!nombre) {
      Alert.alert('Falta el nombre', 'Escribe un nombre para el tablero.');
      return;
    }

    if (!usuario?.idUsuario) {
      Alert.alert('Sesión no válida', 'Cierra sesión e inicia sesión nuevamente.');
      return;
    }

    const hoy = new Date();
    const fecha = [
      hoy.getFullYear(),
      String(hoy.getMonth() + 1).padStart(2, '0'),
      String(hoy.getDate()).padStart(2, '0'),
    ].join('-');

    setGuardando(true);
    try {
      await crearTablero(usuario.idUsuario, nombre, fecha);
      setModalVisible(false);
      navigation.navigate('perfil');
    } catch (error) {
      Alert.alert(
        'No se pudo crear el tablero',
        error.response?.data?.mensaje ?? 'Revisa la conexión con el servidor e inténtalo de nuevo.'
      );
    } finally {
      setGuardando(false);
    }
  };
 
  const wheelRotation = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });
 
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
 
      <View style={styles.header}>
        <Text style={styles.title}>Ruleta</Text>
        <Text style={styles.subtitle}>Gira y crea tu tablero</Text>
      </View>
 
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Girar la ruleta"
        disabled={isSpinning}
        onPress={spin}
        style={({ pressed }) => [
          styles.gameArea,
          pressed && !isSpinning && styles.gameAreaPressed,
        ]}
      >
        <View style={styles.pointer} />
        <Animated.View style={[styles.wheel, { transform: [{ rotate: wheelRotation }] }]}>
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
            {COLORS.map((color, index) => (
              <Path
                key={color}
                d={segmentPath(index)}
                fill={color}
                stroke="#101827"
                strokeWidth="2"
              />
            ))}
            <Circle cx={CENTER} cy={CENTER} r="42" fill="#101827" />
            <Circle cx={CENTER} cy={CENTER} r="29" fill="#F8FAFC" />
            <Circle cx={CENTER} cy={CENTER} r="10" fill="#EF3340" />
          </Svg>
        </Animated.View>
      </Pressable>
 
      <Text style={styles.tapHint}>{isSpinning ? 'Girando…' : 'Toca la ruleta para girar'}</Text>
 
      <View style={styles.resultCard}>
        {selectedColor ? (
          <>
            <Text style={styles.resultLabel}>Tu color</Text>
            <View style={[styles.colorSwatch, { backgroundColor: selectedColor }]} />
          </>
        ) : (
          <Text style={styles.resultPlaceholder}>Gira para ver tu color</Text>
        )}
      </View>
 
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Crear tablero"
        disabled={!selectedColor || isSpinning}
        onPress={handleSave}
        style={[styles.saveButton, (!selectedColor || isSpinning) && styles.saveButtonDisabled]}
      >
        <Text style={styles.saveText}>Crear tablero</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !guardando && setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nuevo tablero</Text>
            <Text style={styles.modalDescription}>Ponle un nombre a tu tablero.</Text>
            <TextInput
              accessibilityLabel="Nombre del tablero"
              value={nombreTablero}
              onChangeText={setNombreTablero}
              placeholder="Ej. Mis colores favoritos"
              placeholderTextColor={THEME.textMuted}
              style={styles.nameInput}
              maxLength={80}
              autoFocus
              editable={!guardando}
              returnKeyType="done"
              onSubmitEditing={guardarTablero}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                disabled={guardando}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.createButton, guardando && styles.saveButtonDisabled]}
                onPress={guardarTablero}
                disabled={guardando}
              >
                {guardando ? (
                  <ActivityIndicator color={THEME.accentTextOn} />
                ) : (
                  <Text style={styles.createText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: { alignItems: 'center', marginTop: 28 },
  title: {
    color: THEME.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: { color: THEME.textMuted, fontSize: 15, marginTop: 6 },
  gameArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    width: WHEEL_SIZE,
    height: WHEEL_SIZE + 18,
  },
  gameAreaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  tapHint: {
    color: THEME.textMuted,
    fontSize: 13,
    marginTop: 10,
    fontWeight: '600',
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    overflow: 'hidden',
  },
  pointer: {
    backgroundColor: THEME.textPrimary,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    height: 28,
    position: 'absolute',
    top: 0,
    width: 22,
    zIndex: 2,
  },
  resultCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 84,
    width: '100%',
    backgroundColor: THEME.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 14,
  },
  resultLabel: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  resultPlaceholder: {
    color: THEME.textMuted,
    fontSize: 14,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 2,
    borderColor: THEME.textPrimary,
  },
  saveButton: {
    backgroundColor: THEME.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 14,
    width: '100%',
  },
  saveButtonDisabled: { opacity: 0.35 },
  saveText: {
    color: THEME.accentTextOn,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalCard: {
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 22,
  },
  modalTitle: {
    color: THEME.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  modalDescription: {
    color: THEME.textMuted,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  nameInput: {
    color: THEME.textPrimary,
    backgroundColor: THEME.bg,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
  },
  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cancelText: {
    color: THEME.textMuted,
    fontWeight: '700',
  },
  createButton: {
    minWidth: 96,
    alignItems: 'center',
    backgroundColor: THEME.accent,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  createText: {
    color: THEME.accentTextOn,
    fontWeight: '800',
  },
});
