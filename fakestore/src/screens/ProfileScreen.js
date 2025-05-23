import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout, updateUserName, signOut } from '../store/userSlice';

const ProfileScreen = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

const token = user.token
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://192.168.1.112:3000';

  const handleUpdate = async () => {
    if (!name || !password) {
      Alert.alert('Missing fields', 'Please enter both name and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `bearer ${token}`
         },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();
      console.log(data)
      if (data.status === 'OK') {
        dispatch(updateUserName(data.name)); // Update Redux name
        Alert.alert('Success', data.message);
        setModalVisible(false);
        setPassword('');
      } else {
        Alert.alert('Error', 'Update failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.text}>{user.name}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.text}>{user.email}</Text>

      <View style={styles.buttonGroup}>
        <Button title="Update" onPress={() => setModalVisible(true)} />
        <Button title="Sign Out" onPress={handleSignOut} color="red" />
      </View>

      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Update Profile</Text>

            <TextInput
              placeholder="New Name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="New Password"
              style={styles.input}
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />

            <View style={styles.buttonGroup}>
              <Button
                title={loading ? 'Updating...' : 'Confirm'}
                onPress={handleUpdate}
                disabled={loading}
              />
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="gray"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 5,
    fontSize: 16,
  },
});
