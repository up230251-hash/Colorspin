import { View, Text, Button, StyleSheet } from "react-native";

export default function loginScreen ({ navigation }) {
    return (
        <View style={StyleSheet.container}>
            <Text style={StyleSheet.titulo}> Login </Text>
            <Button
                title = 'Regresar a inicio'
                onPress = {() => navigation.goBack()}
            />

            <View style={styles.contentCard}>
                <TextInput style={styles.input}
                    placeholder = "Correo"
                ></TextInput>
                <TextInput style={styles.input}
                    placeholder = "Telefono"
                ></TextInput>
            </View>
        <Button style={styles.boton} title = "Guardar"/>
        </View>
    );
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },

    titulo: {
        fontSize: 24,
        marginTop: 20,
    },
    
});