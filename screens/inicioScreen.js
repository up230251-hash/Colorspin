import { View, Text, Button, StyleSheet } from "react-native";

export default function inicioScreen ({ navigation }) {
    return (
        <View style={StyleSheet.container}>
            <Text style={StyleSheet.titulo}> Pantalla inicio</Text>
            <Button
                title = 'Regresar a inicio'
                onPress = {() => navigation.goBack()}
            />
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