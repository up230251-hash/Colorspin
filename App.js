import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { View, TouchableOpacity, StyleSheet, Image } from "react-native";

import InicioScreen from "./screens/inicioScreen";
import LoginScreen from "./screens/loginScreen";
import PerfilScreen from "./screens/perfilScreen";
import SpinScreen from "./screens/SpinScreen";
import DetalleScreen from "./screens/detalleScreen"
import SignUpScreen from "./screens/signUpScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";

const Tab = createBottomTabNavigator();
const AppStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function TabNavigator() {
  return(
    <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false, // oculta los nombres
          tabBarActiveTintColor: '#8896AC',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            if (route.name === 'inicio') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'perfil') {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }
            return <Ionicons name={iconName} color={color} size={size} />;
          },
        })}
      >
        <Tab.Screen name='inicio' component ={InicioScreen}></Tab.Screen>
        <Tab.Screen
          name="spin"
          component={SpinScreen}
          options={{
            tabBarButton: (props) => <SpinTabButton {...props} />,
          }}
        />
        <Tab.Screen name='perfil' component ={PerfilScreen}></Tab.Screen>

      </Tab.Navigator>
  );
}

// función para personalizar el botón y usar imagenes propias
function SpinTabButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.spinWrapper} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.spinCircle}>
        <Image
          source={{ uri: 'https://4.bp.blogspot.com/-FuGUtTnVSTw/WPxFpHjTJCI/AAAAAAAAgEs/ZUNvdWjlRvkNRFRIe0UnMRhkA_RxVaFUACLcB/s1600/paleta_rueda_del_color.png' }}
          style={styles.spinImage}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}

// Stack de autenticación: SOLO existe login y signUp.
// Mientras no haya usuario logueado, esto es lo único que el Stack conoce,
// así que no hay forma de "navegar de vuelta" a las tabs saltándose el login.
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="login" component={LoginScreen} />
      <AuthStack.Screen name="signUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// Stack de la app ya autenticada: SOLO existe una vez que hay usuario logueado.
function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="MainTabs" component={TabNavigator} />
      <AppStack.Screen name="detalle" component={DetalleScreen} />
    </AppStack.Navigator>
  );
}

// Decide cuál de los dos stacks mostrar, según el estado del AuthContext.
// Este switch es lo que reemplaza al "initialRouteName": ya no es una pantalla
// inicial dentro de un stack compartido, son dos árboles de navegación distintos.
function RootNavigator() {
  const { usuario } = useAuth();

  return (
    <NavigationContainer>
      {usuario ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 85,
    borderTopWidth: 0,
    elevation: 10,
    backgroundColor: '#141C30'
  },
  spinWrapper: {
    top: -25, // es lo que hace que sobresalga el boton de spin
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#66F1C2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  spinImage: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
});
