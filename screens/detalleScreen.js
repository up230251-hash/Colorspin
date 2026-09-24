import { View, Text, Button, StyleSheet } from "react-native";

export default function detalleScreen ({ navigation }) {
    return (
        <View style={StyleSheet.container}>
            <Text style={StyleSheet.titulo}> Pantalla Detalle de tablero</Text>
            <Button
                title = 'Regresar a inicio'
                onPress = {() => navigation.goBack()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B1220'
    },

    titulo: {
        fontSize: 24,
        marginTop: 20,
        color: '#F8FAFC',
    },
    
});