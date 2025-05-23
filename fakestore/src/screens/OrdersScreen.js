import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../store/userSlice';
import { selectOrders, fetchOrders } from '../store/orderSlice';

const OrdersScreen = () => {
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders) || [];
    const user = useSelector(selectCurrentUser);
    const [expandedOrderIds, setExpandedOrderIds] = useState([]);
    const [sectionState, setSectionState] = useState({
      new: true,
      paid: true,
      delivered: true,
    });
    const API_URL = 'http://192.168.1.112:3000';
    const token = user?.token;
  
    useEffect(() => {
      dispatch(fetchOrders());
    }, [dispatch]);
  
    const toggleExpand = (orderId) => {
      setExpandedOrderIds((prev) =>
        prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
      );
    };
  
    const toggleSection = (section) => {
      setSectionState((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    };
  
    const updateOrder = async (orderId, isPaid, isDelivered) => {
      try {
        const res = await fetch(`${API_URL}/orders/updateorder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ orderID: orderId, isPaid, isDelivered }),
        });
        const data = await res.json();
        if (data.status === 'OK') {
          Alert.alert('Updated', 'Order status updated');
          dispatch(fetchOrders());
        } else {
          Alert.alert('Error', 'Failed to update order');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Could not update order');
      }
    };
  
    const renderOrderItem = (order) => {
      let items = [];
      try {
        items = JSON.parse(order.order_items || '[]');
      } catch (e) {
        console.warn('Failed to parse order_items:', order.order_items);
      }
  
      const isExpanded = expandedOrderIds.includes(order.id);
  
      return (
        <View key={order.id} style={styles.orderContainer}>
          <TouchableOpacity onPress={() => toggleExpand(order.id)} style={styles.orderHeader}>
            <Text style={styles.orderText}>Order #{order.id}</Text>
            <Text style={styles.orderText}>Items: {order.item_numbers}</Text>
            <Text style={styles.orderText}>Total: ${order.total_price}</Text>
          </TouchableOpacity>
  
          {isExpanded && (
            <View style={styles.details}>
              {items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={{ marginLeft: 10 }}>
                    <Text>{item.title}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                  </View>
                </View>
              ))}
  
              {!order.is_paid && (
                <Button title="Mark as Paid" onPress={() => updateOrder(order.id, 1, order.is_delivered)} />
              )}
              {order.is_paid && !order.is_delivered && (
                <Button title="Mark as Delivered" onPress={() => updateOrder(order.id, 1, 1)} />
              )}
            </View>
          )}
        </View>
      );
    };
  
    const categorizeOrders = () => {
      const newOrders = orders.filter((o) => !o.is_paid && !o.is_delivered);
      const paidOrders = orders.filter((o) => o.is_paid && !o.is_delivered);
      const deliveredOrders = orders.filter((o) => o.is_paid && o.is_delivered);
      return { newOrders, paidOrders, deliveredOrders };
    };
  
    const { newOrders, paidOrders, deliveredOrders } = categorizeOrders();
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* New Orders Section */}
        <TouchableOpacity onPress={() => toggleSection('new')}>
          <Text style={styles.sectionTitle}>
            {sectionState.new ? '▼' : '▶'} 🆕 New Orders
          </Text>
        </TouchableOpacity>
        {sectionState.new && newOrders.map(renderOrderItem)}
  
        {/* Paid Orders Section */}
        <TouchableOpacity onPress={() => toggleSection('paid')}>
          <Text style={styles.sectionTitle}>
            {sectionState.paid ? '▼' : '▶'} 💰 Paid Orders
          </Text>
        </TouchableOpacity>
        {sectionState.paid && paidOrders.map(renderOrderItem)}
  
        {/* Delivered Orders Section */}
        <TouchableOpacity onPress={() => toggleSection('delivered')}>
          <Text style={styles.sectionTitle}>
            {sectionState.delivered ? '▼' : '▶'} ✅ Delivered Orders
          </Text>
        </TouchableOpacity>
        {sectionState.delivered && deliveredOrders.map(renderOrderItem)}
      </ScrollView>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  orderContainer: {
    backgroundColor: '#f8f8f8',
    marginVertical: 5,
    borderRadius: 8,
    padding: 10,
  },
  orderHeader: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  orderText: {
    fontSize: 16,
  },
  details: {
    marginTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});

export default OrdersScreen;
