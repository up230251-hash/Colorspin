import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/loginScreen';

import PerfilScreen from './screens/perfilScreen';


const Stack = createNativeStackNavigator();


export default function App() {

  return (

    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >

        {/* PANTALLA LOGIN */}

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />


        {/* PANTALLA PERFIL */}

        <Stack.Screen
          name="Perfil"
          component={PerfilScreen}
        />

      </Stack.Navigator>

    </NavigationContainer>

  );

}