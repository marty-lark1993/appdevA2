import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductList', { category: item })}
    >
      <Text style={styles.cardText}>{item.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Categories</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#f8f8f8',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  cardText: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
});
