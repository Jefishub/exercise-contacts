import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const API_URL = "http://www.mapquestapi.com/geocoding/v1/address";
const API_KEY = "nk4AOXVkJGl4bHJ7ycsAQdTN2JRd4YW1";
const INITIAL_REGION = { latitude: 60.200692, longitude: 24.934302, latitudeDelta: 0.003, longitudeDelta: 0.002, };
const INITIAL_MARKER = { latitude: 60.200692, longitude: 24.934302 }

export default function App() {
  const [latLng, setLatLng] = useState(INITIAL_REGION);
  const [marker, setMarker] = useState(INITIAL_MARKER);
  const [locationAddress, setLocationAddress] = useState('Current Location');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permissionto get location');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLatLng(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.002,
        });
      setMarker({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    })();
  }, []);

  const fetchData = () => {
    fetch(API_URL + "?key=" + API_KEY + "&location=" + locationAddress, { method: 'GET' })
      .then(res => res.json())
      .then((resJson) => {
        setLatLng(
          {
            latitude: resJson.results[0].locations[0].latLng.lat,
            longitude: resJson.results[0].locations[0].latLng.lng,
            latitudeDelta: 0.003,
            longitudeDelta: 0.002,
          }
        );
        setMarker({
          latitude: resJson.results[0].locations[0].latLng.lat,
          longitude: resJson.results[0].locations[0].latLng.lng
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setLocationAddress}
        value={locationAddress}
      />
      <Button
        onPress={fetchData}
        title="Find Location"
      />
      <MapView
        style={styles.map}
        region={latLng}>
        <Marker coordinate={marker} title={locationAddress} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});