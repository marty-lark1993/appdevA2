import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import store from './src/store';
import TabNavigator from './src/navigation/TabNavigator.js';
import SplashScreen from '../fakestore/src/screens/splash.js';

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="MainTabs" component={TabNavigator} />
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}