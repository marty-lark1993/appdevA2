import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('MainTabs'); // replace with TabNavigator stack
    }, 3000); // 👈 3 seconds

    return () => clearTimeout(timeout); // cleanup
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/splash.png')} style={styles.Image} resizeMode='contain'/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B66B58',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SplashScreen;
