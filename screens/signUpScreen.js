import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen({ navigation }) {
    const [usuario, setUsuario] = useState("");
    const [correo, setCorreo] = useState(""); 
    const [contrasena, setContrasena] = useState("");
    const [verPassword, setVerPassword] = useState(false);
    const [error, setError] = useState("");

    const validarEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const manejarSignUp = () => {
        setError("");

        if (!usuario.trim() || !contrasena.trim()) {
            setError("Completa tu email y contraseña.");
            return;
        }

        if (!validarEmail(usuario)) {
            setError("Ingresa un email válido.");
            return;
        }

        if (contrasena.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        // Por ahora solo navegamos al perfil.
        // Después aquí se conectará el backend de tu compañero.
        navigation.navigate("Perfil", {
            usuario: usuario,
        });
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

                <Text style={styles.label}>Nombre de usuario</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
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
                    style={styles.botonLogin}
                    onPress={manejarSignUp}
                >
                    <Text style={styles.botonLoginTexto}>
                        Sign Up
                    </Text>
                </TouchableOpacity>

            </View>

        </SafeAreaView>
    );
}

const ROJO = "#E1174A";

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff",
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
        backgroundColor: ROJO,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },

    logoLetra: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 20,
    },

    titulo: {
        fontSize: 21,
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
    },

    subtitulo: {
        fontSize: 13,
        color: "#6b7280",
        marginTop: 6,
    },

    form: {
        flex: 1,
        paddingHorizontal: 2,
    },

    label: {
        fontSize: 13,
        color: "#374151",
        marginBottom: 8,
        marginTop: 18,
    },

    input: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 13,
        fontSize: 14,
        color: "#111827",
        backgroundColor: "#fff",
    },

    passwordWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 25,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        marginBottom: 2,
    },

    passwordInput: {
        flex: 1,
        paddingVertical: 13,
        fontSize: 14,
        color: "#111827",
    },

    forgotWrapper: {
        alignSelf: "flex-end",
        marginTop: 12,
    },

    forgotTexto: {
        color: ROJO,
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
        backgroundColor: ROJO,
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 26,
    },

    botonLoginTexto: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },

    divisorWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },

    linea: {
        flex: 1,
        height: 1,
        backgroundColor: "#e5e7eb",
    },

    divisorTexto: {
        marginHorizontal: 14,
        fontSize: 11,
        color: "#9ca3af",
    },

    botonGoogle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 25,
        paddingVertical: 14,
        backgroundColor: "#fff",
    },

    botonGoogleTexto: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 20,
        paddingBottom: 30,
    },

    footerTexto: {
        fontSize: 13,
        color: "#6b7280",
    },

    footerLink: {
        fontSize: 13,
        color: ROJO,
        fontWeight: "700",
    },

});