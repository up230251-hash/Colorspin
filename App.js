import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { Ionicons } from '@expo/vector-icons';

import inicioScreen from "./screens/inicioScreen";
import loginScreen from "./screens/loginScreen";
import perfilScreen from "./screens/perfilScreen";
import spinScreen from "./screens/SpinScreen";

const Tab = createBottomTabNavigator(); 

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions = {({ route }) => ({
          tabBarIcon: ({color, size}) => {
            let iconName;

            if (route.name === 'inicio'){
              iconName = 'home';
            } else if (route.name === "Spin"){
              iconName = 'color-palette-outline';              
            } else if (route.name === "perfil"){
              iconName = 'person';
            }

            return <Ionicons name={iconName} color = {color} size={size}></Ionicons>
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarActiveTintColor: 'gray'
        })}
      >
        <Tab.Screen name='inicio' component ={inicioScreen}></Tab.Screen>
        <Tab.Screen name='spin' component ={spinScreen}></Tab.Screen>
        <Tab.Screen name='perfil' component ={perfilScreen}></Tab.Screen>
        <Tab.Screen name='login' component ={loginScreen}></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}








/*import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native';
import { createbottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { Ionicons } from '@expo/vector-icons';

import InicioScreen from "./screens/InicioScreen";
import DetalleScreen from "./screens/DetalleScreen";
import formularioScreen from "./screens/formularioScreen";
import PerfilScreen from "./screens/PerfilScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottonTabNavigator(); 

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator initalRouteName='inicio'>
        <Tab.Screen name='inicio' component ={InicioScreen}></Tab.Screen>
        <Tab.Screen name='detalle' component ={DetalleScreen}></Tab.Screen>
        <Tab.Screen name='formulario' component ={formularioScreen}></Tab.Screen>
        <Tab.Screen name='Perfil' component ={PerfilScreen}></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

 */