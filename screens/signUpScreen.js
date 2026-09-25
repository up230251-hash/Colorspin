import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { registrarUsuario } from "../api/auth";

export default function SignUpScreen({ navigation }) {
    const [usuario, setUsuario] = useState("");
    const [correo, setCorreo] = useState(""); 
    const [contrasena, setContrasena] = useState("");
    const [verPassword, setVerPassword] = useState(false);
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    const validarEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const manejarSignUp = async () => {
        setError("");

        if (!usuario.trim() || !correo.trim() || !contrasena.trim()) {
            setError("Completa tu nombre, correo y contraseña.");
            return;
        }

        if (!validarEmail(correo.trim())) {
            setError("Ingresa un email válido.");
            return;
        }

        if (contrasena.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setEnviando(true);
        try {
            await registrarUsuario(
                usuario.trim(),
                correo.trim().toLowerCase(),
                contrasena
            );

            Alert.alert(
                "Cuenta creada",
                "Tu cuenta se registró correctamente. Ahora inicia sesión con tu correo y contraseña.",
                [{ text: "Ir al login", onPress: () => navigation.navigate("login") }]
            );
        } catch (e) {
            setError(
                e.response?.data?.mensaje ??
                "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo."
            );
        } finally {
            setEnviando(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <View style={styles.logoBadge}>
                    <Text style={styles.logoLetra}>P</Text>
                </View>

                <Text style={styles.titulo}>
                    Sign Up for ColorsPin
                </Text>

                <Text style={styles.subtitulo}>
                    Take a picture
                </Text>
            </View>

            <View style={styles.form}>

                <Text style={styles.label}>Usuario</Text>

                <TextInput
                    style={styles.input}
                    placeholder="name"
                    placeholderTextColor="#9aa0a6"
                    autoCapitalize="none"
                    value={usuario}
                    onChangeText={setUsuario}
                />

                <Text style={styles.label}>Email</Text>

                <TextInput
                    style={styles.input}
                    placeholder="yourname@gmail.com"
                    placeholderTextColor="#9aa0a6"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={correo}
                    onChangeText={setCorreo}
                />

                <Text style={styles.label}>Password</Text>

                <View style={styles.passwordWrapper}>

                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Enter your password"
                        placeholderTextColor="#9aa0a6"
                        secureTextEntry={!verPassword}
                        value={contrasena}
                        onChangeText={setContrasena}
                    />

                    <TouchableOpacity
                        onPress={() => setVerPassword(!verPassword)}
                    >
                        <Ionicons
                            name={
                                verPassword
                                    ? "eye-off-outline"
                                    : "eye-outline"
                            }
                            size={20}
                            color="#6b7280"
                        />
                    </TouchableOpacity>

                </View>

                {error ? (
                    <Text style={styles.errorTexto}>
                        {error}
                    </Text>
                ) : null}

                <TouchableOpacity
                    style={[styles.botonLogin, enviando && styles.botonDeshabilitado]}
                    onPress={manejarSignUp}
                    disabled={enviando}
                >
                    {enviando ? (
                        <ActivityIndicator color="#0B1220" />
                    ) : (
                        <Text style={styles.botonLoginTexto}>Sign Up</Text>
                    )}
                </TouchableOpacity>

            </View>

        </SafeAreaView>
    );
}

const ACENTO = "#66F1C2";

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#0B1220",
        paddingHorizontal: 28,
    },

    header: {
        alignItems: "center",
        marginTop: 45,
        marginBottom: 30,
    },

    logoBadge: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: ACENTO,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },

    logoLetra: {
        color: "#0B1220",
        fontWeight: "700",
        fontSize: 20,
    },

    titulo: {
        fontSize: 21,
        fontWeight: "700",
        color: "#F8FAFC",
        textAlign: "center",
    },

    subtitulo: {
        fontSize: 13,
        color: "#8896AC",
        marginTop: 6,
    },

    form: {
        flex: 1,
        paddingHorizontal: 2,
    },

    label: {
        fontSize: 13,
        color: "#8896AC",
        marginBottom: 8,
        marginTop: 18,
    },

    input: {
        borderWidth: 1,
        borderColor: "#233047",
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 13,
        fontSize: 14,
        color: "#F8FAFC",
        backgroundColor: "#141C30",
    },

    passwordWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#233047",
        borderRadius: 25,
        paddingHorizontal: 16,
        backgroundColor: "#141C30",
        marginBottom: 2,
    },

    passwordInput: {
        flex: 1,
        paddingVertical: 13,
        fontSize: 14,
        color: "#F8FAFC",
    },

    forgotWrapper: {
        alignSelf: "flex-end",
        marginTop: 12,
    },

    forgotTexto: {
        color: ACENTO,
        fontSize: 12,
        fontWeight: "600",
    },

    errorTexto: {
        color: "#dc2626",
        fontSize: 12,
        marginTop: 12,
        textAlign: "center",
    },

    botonLogin: {
        backgroundColor: ACENTO,
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 26,
    },

    botonLoginTexto: {
        color: "#0B1220",
        fontWeight: "700",
        fontSize: 15,
    },

    botonDeshabilitado: {
        opacity: 0.65,
    },

    divisorWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },

    linea: {
        flex: 1,
        height: 1,
        backgroundColor: "#233047",
    },

    divisorTexto: {
        marginHorizontal: 14,
        fontSize: 11,
        color: "#8896AC",
    },

    botonGoogle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "#233047",
        borderRadius: 25,
        paddingVertical: 14,
        backgroundColor: "#141C30",
    },

    botonGoogleTexto: {
        fontSize: 14,
        fontWeight: "600",
        color: "#F8FAFC",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 20,
        paddingBottom: 30,
    },

    footerTexto: {
        fontSize: 13,
        color: "#8896AC",
    },

    footerLink: {
        fontSize: 13,
        color: ACENTO,
        fontWeight: "700",
        paddingBottom: 50
    },

});
