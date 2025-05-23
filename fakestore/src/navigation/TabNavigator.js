import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { selectTotalCartQuantity } from '../store/cartSlice.js';
import { selectCurrentUser } from '../store/userSlice.js';


// Screens
import CategoryScreen from '../screens/CategoryScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ShoppingCartScreen from '../screens/ShoppingCartScreen';
import OrdersScreen from '../screens/OrdersScreen.js';
import AuthScreen from '../screens/AuthScreen.js'; 
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProductsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Categories" component={CategoryScreen} />
    <Stack.Screen name="ProductList" component={ProductListScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
  </Stack.Navigator>
);

// Helper to block tabs if user not logged in
const Protected = ({ children, navigation }) => {
  const user = useSelector(selectCurrentUser);
  if (!user) {
    Alert.alert('Login Required', 'Please sign in to access this section.');
    return null;
  }
  return children;
}; 

const TabNavigator = () => {
  const user = useSelector(selectCurrentUser);
  const totalItems = useSelector(selectTotalCartQuantity);
  const newOrders = useSelector((state) => state.order.newOrders);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Products') iconName = 'home-outline';
          if (route.name === 'Cart') iconName = 'cart-outline';
          if (route.name === 'Orders') iconName = 'file-tray-full-outline';
          if (route.name === 'Profile' || route.name === 'Auth') iconName = 'person-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {user ? (
        // ✅ Tabs for Signed-In Users
        <>
          <Tab.Screen name="Products" component={ProductsStack} />
          <Tab.Screen
            name="Cart"
            component={ShoppingCartScreen}
            options={{ tabBarBadge: totalItems > 0 ? totalItems : null }}
          />
          <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarBadge: newOrders > 0 ? newOrders : null }} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        // 🔒 Tabs for Guests (only Auth screen)
        <>
          <Tab.Screen name="Auth" component={AuthScreen} />
        </>
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;
