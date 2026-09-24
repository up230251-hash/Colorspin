import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TABLEROS_CREADOS = [
  {
    id: "c1",
    nombre: "Warm Interior Mood",
    pines: "142 Pins",
    imagen: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
  },
  {
    id: "c2",
    nombre: "Editorial Fashion",
    pines: "56 Pins",
    imagen: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  },
  {
    id: "c3",
    nombre: "Art & Ceramics",
    pines: "98 Pins",
    imagen: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61",
  },
  {
    id: "c4",
    nombre: "Matcha & Mornings",
    pines: "45 Pins",
    imagen: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7",
  },
];

const TABLEROS_GUARDADOS = [
  {
    id: "s1",
    nombre: "Minimalist Living",
    pines: "87 Pins",
    imagen: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
  },
  {
    id: "s2",
    nombre: "Coffee Aesthetic",
    pines: "64 Pins",
    imagen: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
  },
  {
    id: "s3",
    nombre: "Fashion Ideas",
    pines: "120 Pins",
    imagen: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
  },
  {
    id: "s4",
    nombre: "Dream Bedroom",
    pines: "72 Pins",
    imagen: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
  },
];

export default function perfilScreen({ navigation }) {
  const [tab, setTab] = useState("Saved");

  const tableros = tab === "Created" ? TABLEROS_CREADOS : TABLEROS_GUARDADOS;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => Alert.alert("Compartir perfil")}>
            <Ionicons name="share-outline" size={20} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("Configuración")}>
            <Ionicons name="settings-outline" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.perfilInfo}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
            }}
            style={styles.avatar}
          />
          <Text style={styles.nombre}>Elena Rostova</Text>
          <Text style={styles.usuario}>@elenarostova</Text>

          <View style={styles.stats}>
            <Text style={styles.statsTexto}>
              <Text style={styles.statsNumero}>12.4k</Text> followers
            </Text>
            <Text style={styles.statsSeparador}>·</Text>
            <Text style={styles.statsTexto}>
              <Text style={styles.statsNumero}>432</Text> following
            </Text>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tab} onPress={() => setTab("Created")}>
            <Text style={[styles.tabTexto, tab === "Created" && styles.tabTextoActivo]}>
              Created
            </Text>
            {tab === "Created" && <View style={styles.lineaActiva} />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab} onPress={() => setTab("Saved")}>
            <Text style={[styles.tabTexto, tab === "Saved" && styles.tabTextoActivo]}>
              Saved
            </Text>
            {tab === "Saved" && <View style={styles.lineaActiva} />}
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {tableros.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.tablero}
              onPress={() => navigation.navigate("detalle", { board: item })}
            >
              <Image source={{ uri: item.imagen }} style={styles.tableroImagen} />
              <Text style={styles.tableroNombre}>{item.nombre}</Text>
              <Text style={styles.tableroPines}>{item.pines}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  perfilInfo: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 12,
    backgroundColor: "#eee",
  },
  nombre: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  usuario: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  statsTexto: {
    fontSize: 13,
    color: "#6b7280",
  },
  statsNumero: {
    fontWeight: "700",
    color: "#111827",
  },
  statsSeparador: {
    marginHorizontal: 8,
    color: "#9ca3af",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tabTexto: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: "600",
  },
  tabTextoActivo: {
    color: "#111827",
  },
  lineaActiva: {
    width: 32,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#111827",
    marginTop: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  tablero: {
    width: "48%",
    marginBottom: 20,
  },
  tableroImagen: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  tableroNombre: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginTop: 8,
  },
  tableroPines: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
});