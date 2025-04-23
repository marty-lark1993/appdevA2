// src/screens/ProductDetailScreen.js

import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  console.log(product.image)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <Text style={styles.title}>{product.title}</Text>

      <View style={styles.rating}>
        <Text style={styles.ratingTXT}>Count: {product.rating.count}</Text>
        <Text style={styles.ratingTXT}>Rating: {product.rating.rate}</Text>
      </View>

      <Text style={styles.price}>${product.price.toFixed(2)}</Text>

      <Text style={styles.description}>{product.description}</Text>


      <TouchableOpacity
        style={styles.button}
        onPress={() => alert('Add to Cart functionality coming soon!')}
      >
        <Ionicons name='cart-outline' size={24} color="white" />
        <Text style={styles.buttonText}>    Add to Shopping Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
        <Ionicons name='arrow-back' size={24} color='#555' />
        <Text style={styles.backText}>    Back to Products</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
 
export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { 
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    height: 250,
    width: 250,
    marginBottom: 20,
    alignSelf: 'center',
    resizeMode: 'contain', // helps with weird dimensions
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: 'green',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backLink: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  backText: {
    color: '#555',
    fontSize: 16,
  },
  rating: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    marginBottom: 7,
    padding:15,
    borderRadius: 10,
  },
  ratingTXT: {
    color: 'white'
  }
});
