import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { increaseQuantity, decreaseQuantity, removeFromCart, clearCart, uploadCart } from '../store/cartSlice';
import { fetchOrders, incrementNewOrders } from '../store/orderSlice';
import { selectCurrentUser } from '../store/userSlice';

const ShoppingCartScreen = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);


  const handleCheckout = async () => {
    const itemsToSend = cartItems.map(item => ({
      prodID: item.id,
      price: item.price,
      quantity: item.quantity,
      title: item.title,
      image: item.image
    }));
  
    try {
      const res = await fetch('http://192.168.1.112:3000/orders/neworder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ items: itemsToSend }),
      });
  
      const data = await res.json();
      console.log(data)
      if (data.status === 'OK') {
        dispatch(clearCart());
        dispatch(incrementNewOrders());
        dispatch(fetchOrders())
        alert('Order placed successfully!');
      } else {
        alert('Order failed. Try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Server error. Try again later.');
    }
  };

  const renderCartItem = ({ item }) => {
    const handleRemove = () => {
      dispatch(removeFromCart(item));
      dispatch(uploadCart());
    };
  
    return (
      <View style={styles.cartItem}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
  
        <View style={styles.quantityControl}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => {
              if (item.quantity === 1) {
                handleRemove();
              } else {
                dispatch(decreaseQuantity(item));
                dispatch(uploadCart());
              }
            }}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
  
          <Text style={styles.quantityText}>{item.quantity}</Text>
  
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => {
              dispatch(increaseQuantity(item));
              dispatch(uploadCart());
            }}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
  
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemove} // ✅ Now it's a function reference
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCart}>Your shopping cart is empty</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
        />
      )}

      <View style={styles.summary}>
        <Text style={styles.totalText}>Total: ${totalCost.toFixed(2)}</Text>
        <Text style={styles.totalItems}>
          Total Items: {cartItems.reduce((total, item) => total + item.quantity, 0)}
        </Text>
      </View>
      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
           <Text style={styles.checkoutButtonText}>Check Out</Text>
        </TouchableOpacity>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  emptyCart: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  cartItem: {
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF4D4D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 16,
    marginTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalItems: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },  
});

export default ShoppingCartScreen;