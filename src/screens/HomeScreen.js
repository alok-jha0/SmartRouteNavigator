import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [vehicle, setVehicle] = useState({
    type: '',
    height: '',
    weight: '',
    length: '',
    fuelType: '',
  });
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState(null);

  useEffect(() => {
    getCurrentLocation();
    loadVehicleData();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setRegion({
          ...region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const loadVehicleData = async () => {
    try {
      const savedVehicle = await AsyncStorage.getItem('vehicleData');
      if (savedVehicle) {
        setVehicle(JSON.parse(savedVehicle));
      }
    } catch (error) {
      console.error('Error loading vehicle data:', error);
    }
  };

  const saveVehicleData = async () => {
    try {
      await AsyncStorage.setItem('vehicleData', JSON.stringify(vehicle));
      alert('Vehicle data saved successfully!');
    } catch (error) {
      console.error('Error saving vehicle data:', error);
    }
  };

  const calculateRoute = () => {
    // Here we would integrate with a routing service that considers vehicle parameters
    // For now, we'll just show a mock route
    const mockRoute = [
      { latitude: region.latitude, longitude: region.longitude },
      { latitude: region.latitude + 0.01, longitude: region.longitude + 0.01 },
      { latitude: region.latitude + 0.02, longitude: region.longitude + 0.02 },
    ];
    setRoute(mockRoute);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        <Marker coordinate={region} title="You are here" />
        {route && (
          <Polyline
            coordinates={route}
            strokeColor="#000"
            strokeWidth={3}
          />
        )}
      </MapView>

      <ScrollView style={styles.form}>
        <Text style={styles.title}>Vehicle Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Vehicle Type"
          value={vehicle.type}
          onChangeText={text => setVehicle({...vehicle, type: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Height (meters)"
          value={vehicle.height}
          onChangeText={text => setVehicle({...vehicle, height: text})}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Weight (tons)"
          value={vehicle.weight}
          onChangeText={text => setVehicle({...vehicle, weight: text})}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Length (meters)"
          value={vehicle.length}
          onChangeText={text => setVehicle({...vehicle, length: text})}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Fuel Type"
          value={vehicle.fuelType}
          onChangeText={text => setVehicle({...vehicle, fuelType: text})}
        />

        <TouchableOpacity style={styles.button} onPress={saveVehicleData}>
          <Text style={styles.buttonText}>Save Vehicle Data</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Enter Destination"
          value={destination}
          onChangeText={setDestination}
        />

        <TouchableOpacity style={styles.button} onPress={calculateRoute}>
          <Text style={styles.buttonText}>Calculate Route</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  form: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
