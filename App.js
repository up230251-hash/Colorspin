import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { Ionicons } from '@expo/vector-icons';

import { View, TouchableOpacity, StyleSheet, Image } from "react-native";

import inicioScreen from "./screens/inicioScreen";
import loginScreen from "./screens/loginScreen";
import perfilScreen from "./screens/perfilScreen";
import SpinScreen from "./screens/SpinScreen";

const Tab = createBottomTabNavigator(); 
//const Stack = createNativeStackNavigator();


// función para personalizar el botón y usar imagenes propias
function SpinTabButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.spinWrapper} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.spinCircle}>
        {/*se planea usar un blob en esta parte para el logo de dante */}
        <Image
          source={{ uri: 'https://4.bp.blogspot.com/-FuGUtTnVSTw/WPxFpHjTJCI/AAAAAAAAgEs/ZUNvdWjlRvkNRFRIe0UnMRhkA_RxVaFUACLcB/s1600/paleta_rueda_del_color.png' }}
          style={styles.spinImage}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false, // oculta los nombres 
          tabBarActiveTintColor: '#007AFF',
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
        <Tab.Screen name='inicio' component ={inicioScreen}></Tab.Screen>
        <Tab.Screen
          name="spin"
          component={SpinScreen}
          options={{
            tabBarButton: (props) => <SpinTabButton {...props} />,
          }}
        />
        <Tab.Screen name='perfil' component ={perfilScreen}></Tab.Screen>
        {/*<Tab.Screen name='login' component ={loginScreen}></Tab.Screen>*/}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 85,
    borderTopWidth: 0,
    elevation: 10,
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
    backgroundColor: '#007AFF',
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

