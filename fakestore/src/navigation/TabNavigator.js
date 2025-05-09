// src/navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectTotalCartQuantity } from '../store/cartSlice.js';
import CategoryScreen from '../screens/CategoryScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ShoppingCartScreen from '../screens/ShoppingCartScreen.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Products stack (Categories → ProductList → ProductDetail)
const ProductsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Categories" component={CategoryScreen} />
    <Stack.Screen name="ProductList" component={ProductListScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => {

  const totalItems = useSelector(selectTotalCartQuantity);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Products') iconName = 'home-outline';
          if (route.name === 'Cart') iconName = 'cart-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Products" component={ProductsStack} />
      <Tab.Screen
        name="Cart"
        component={ShoppingCartScreen}
        options={{
       tabBarBadge: totalItems > 0 ? totalItems : null,
  }}
/>
    </Tab.Navigator>
  );
};

export default TabNavigator;
 