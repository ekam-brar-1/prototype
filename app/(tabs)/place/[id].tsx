import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PlaceDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);

  // Fetch place details
  useEffect(() => {
    axios.get(`http://192.168.1.175:5000/api/locations/${id}`)
      .then(res => setPlace(res.data))
      .catch(err => console.error('Failed to fetch place:', err));
  }, [id]);

  // Fetch reviews only when the user expands the review section
  useEffect(() => {
    if (!id || !showReviews) return;
    axios.get(`http://192.168.1.175:5000/api/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error('Failed to load reviews:', err));
  }, [id, showReviews]);

  if (!place) return <Text style={styles.loadingText}>Loading...</Text>;

  // Calculate overall rating from reviews if available; otherwise, use place.rating
  const overallRating = reviews.length > 0 
    ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length).toFixed(1)
    : place.rating;

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
          <Text style={styles.rating}>{overallRating}</Text>
          <Ionicons name="heart-outline" size={20} color="#555" style={{ marginLeft: 10 }} />
        </View>
      </View>

      
      <Text style={styles.sectionTitle}>About The Place</Text>
      <View style={styles.sectionCard}>
        <Text style={styles.description}>{place.description}</Text>
      </View>

      {/* Media Gallery */}
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

      {/* Overall Reviews Summary & Expand Button */}
      <TouchableOpacity onPress={() => setShowReviews(!showReviews)} style={styles.reviewSummary}>
        <View style={styles.row}>
          <Ionicons name="star" size={16} color="tomato" />
          <Text style={styles.overallRating}>{overallRating}</Text>
          <Text style={styles.reviewCount}>
            {reviews.length > 0 ? `(${reviews.length} reviews)` : '(No reviews yet)'}
          </Text>
        </View>
        <Text style={styles.viewReviewsText}>
          {showReviews ? 'Hide Reviews' : 'View Reviews'}
        </Text>
      </TouchableOpacity>

      {/* Show Detailed Reviews if Expanded */}
      {showReviews && (
        <>
          {reviews.length === 0 ? (
            <Text style={styles.noReviewsText}>No reviews yet.</Text>
          ) : (
            reviews.map((review, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/147/147144.png' }}
                    style={styles.avatar}
                  />
                  <View style={styles.reviewHeaderText}>
                    <Text style={styles.userName}>User</Text>
                    <Text style={styles.date}>{new Date(review.createdAt).toLocaleString()}</Text>
                  </View>
                  <View style={styles.reviewRating}>
                    <Ionicons name="star" size={16} color="tomato" />
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  </View>
                </View>
                <Text style={styles.comment}>{review.comment}</Text>
              </View>
            ))
          )}

          {/* Add Review Button */}
          <TouchableOpacity onPress={() => router.push(`/review/add/${id}`)} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Review</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingText: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  backButton: {
    marginTop: 40,
    marginLeft: 16,
    backgroundColor: '#cfc3eb',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
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
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 16, marginBottom: 10 },
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
  description: { fontSize: 14, color: '#333' },
  thumb: { width: 100, height: 100, borderRadius: 12, marginRight: 10, marginTop: 10 },
  reviewSummary: {
    backgroundColor: '#f2f2f2',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  overallRating: { marginLeft: 4, fontSize: 14, fontWeight: '600' },
  reviewCount: { marginLeft: 6, fontSize: 13, color: '#555' },
  viewReviewsText: { fontSize: 14, color: '#704ecb', fontWeight: '600' },
  noReviewsText: { textAlign: 'center', color: '#888', marginVertical: 10 },
  addButton: {
    backgroundColor: '#704ecb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 20,
  },
  addButtonText: { color: '#fff', fontWeight: '600' },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  reviewHeaderText: { marginLeft: 10 },
  userName: { fontWeight: '600', fontSize: 14 },
  date: { fontSize: 12, color: '#888' },
  reviewRating: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' },
  reviewRatingText: { marginLeft: 4, fontWeight: '600', fontSize: 14 },
  comment: { fontSize: 13, color: '#333' },
});
