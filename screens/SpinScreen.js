import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const COLORS = [
  '#EF3340', '#F97316', '#FACC15', '#84CC16', '#10B981',
  '#14B8A6', '#38BDF8', '#3B82F6', '#4F46E5', '#8B5CF6',
  '#C026D3', '#E11D48', '#FB7185', '#A855F7', '#22D3EE',
];

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
  const rotation = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const spin = () => {
    if (isSpinning) return;

    const selectedIndex = Math.floor(Math.random() * COLORS.length);
    const extraTurns = 5 + Math.floor(Math.random() * 3);

    // Ángulo para que el centro del segmento elegido quede bajo el puntero (arriba)
    const landingAngle = 360 - (selectedIndex + 0.5) * SEGMENT_ANGLE;
    const baseRotation = currentRotation.current - (currentRotation.current % 360);
    const targetRotation = baseRotation + extraTurns * 360 + landingAngle;

    currentRotation.current = targetRotation;
    setSelectedColor(null); // limpiar resultado anterior
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
  // TODO: aquí después se creará el tablero con el color elegido
  navigation.navigate('perfil', { colorTablero: selectedColor });
};

  const wheelRotation = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Rueda de color</Text>
        <Text style={styles.subtitle}>Gira y toma tu foto de ese color</Text>
      </View>

      <View style={styles.gameArea}>
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
      </View>

      <View style={styles.resultBox}>
        {selectedColor && (
          <>
            <Text style={styles.resultLabel}>TU COLOR</Text>
            <View style={[styles.colorSwatch, { backgroundColor: selectedColor }]} />
          </>
        )}
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Girar la ruleta"
        disabled={isSpinning}
        onPress={spin}
        style={[styles.button, isSpinning && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>{isSpinning ? 'GIRANDO' : 'GIRAR RULETA'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Guardar color"
        disabled={!selectedColor || isSpinning}
        onPress={handleSave}
        style={[styles.saveButton, (!selectedColor || isSpinning) && styles.saveButtonDisabled]}
      >
        <Text style={styles.saveText}>GUARDAR</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>Regresar a inicio</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: { alignItems: 'center', marginTop: 28 },
  title: { color: '#F8FAFC', fontSize: 28, fontWeight: '900' },
  subtitle: { color: '#94A3B8', fontSize: 15, marginTop: 8 },
  gameArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    width: WHEEL_SIZE,
    height: WHEEL_SIZE + 18,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    overflow: 'hidden',
  },
  pointer: {
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    height: 28,
    position: 'absolute',
    top: 0,
    width: 22,
    zIndex: 2,
  },
  resultBox: { alignItems: 'center', marginTop: 12, minHeight: 70 },
  resultLabel: { color: '#64748B', fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#FACC15',
    borderRadius: 14,
    elevation: 4,
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 56,
    paddingHorizontal: 34,
    shadowColor: '#FACC15',
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  buttonDisabled: { backgroundColor: '#64748B', shadowOpacity: 0 },
  buttonText: { color: '#101827', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#e60023',
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 52,
    paddingHorizontal: 34,
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  backButton: { marginTop: 16, padding: 8 },
  backText: { color: '#94A3B8', fontSize: 14 },
});