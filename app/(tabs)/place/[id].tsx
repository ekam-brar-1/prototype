import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PlaceDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [place, setPlace] = useState(null);

  useEffect(() => {
    axios.get(`http://192.168.1.175:5000/api/locations/${id}`)
      .then(res => setPlace(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!place) return null;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>BACK</Text>
      </TouchableOpacity>

      <Image source={{ uri: place.media[0] }} style={styles.mainImage} />

      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{place.name}</Text>
          <View style={styles.row}>
            <Ionicons name="location" size={14} color="#888" />
            <Text style={styles.location}>{place.location}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Ionicons name="star" size={16} color="tomato" />
          <Text style={styles.rating}>{place.rating}</Text>
          <Ionicons name="heart-outline" size={20} color="#555" style={{ marginLeft: 10 }} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>About The Place</Text>
      <View style={styles.sectionCard}>
        <Text style={styles.description}>{place.description}</Text>
      </View>

      <Text style={styles.sectionTitle}>Media</Text>
      <FlatList
        data={place.media}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingLeft: 16 }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.thumb} />
        )}
      />

      <View style={styles.ratingBox}>
        <Text style={styles.score}>4.5</Text>
        <Ionicons name="star" size={20} color="#444" />
        <Text style={{ marginLeft: 4 }}>453 reviews</Text>
        {/* You can add a ratings bar chart here too if you want */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: {
    marginTop: 40,
    marginLeft: 16,
    alignSelf: 'flex-start',
    backgroundColor: '#cfc3eb',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  backText: { fontSize: 14, fontWeight: '600', color: '#333' },
  mainImage: {
    width: '90%',
    height: 180,
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4b60e6',
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: '700' },
  location: { marginLeft: 6, fontSize: 13, color: '#666' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  rating: { marginLeft: 4, fontSize: 14, fontWeight: '600' },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#704ecb',
    borderRadius: 8,
    color: '#fff',
    alignSelf: 'flex-start',
  },
  sectionCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
  thumb: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
    marginTop: 10,
  },
  ratingBox: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  score: {
    fontSize: 28,
    fontWeight: '800',
    marginRight: 8,
    color: '#4b60e6',
  },
});
