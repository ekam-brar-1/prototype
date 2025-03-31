import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface AddReviewModalProps {
  visible: boolean;
  onClose: () => void;
  placeId: string; // Valid 24-character ObjectId string for the place
  userId: string;  // Should be a valid ID string (e.g., a UUID)
  onSubmitSuccess: () => void; // Callback to refresh reviews in the parent screen
}

export default function AddReviewModal({
  visible,
  onClose,
  placeId,
  userId,
  onSubmitSuccess,
}: AddReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleStarPress = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    // Validate rating and comment before submitting
    if (!rating || comment.trim() === '') {
      console.warn('Please provide both a rating and a comment.');
      return;
    }

    try {
      // Create payload with valid IDs (ensure these are complete valid strings)
      const payload = {
        userId: userId,   // e.g., "184f2e00-6770-4309-9518-41911e131389"
        placeId: placeId, // e.g., "67e72e529e844f05bf8c4545"
        rating,
        comment,
      };
      // Updated endpoint without ":placeId"
      await axios.post('http://192.168.1.175:5000/api/reviews', payload);
      // Clear fields and call success callback
      setRating(0);
      setComment('');
      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to add review:', err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>BACK</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Add Review</Text>

          {/* Star Rating */}
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map(num => (
              <TouchableOpacity key={num} onPress={() => handleStarPress(num)}>
                <Ionicons
                  name={num <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color="tomato"
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Comment Input */}
          <Text style={styles.label}>Add Comment:</Text>
          <TextInput
            style={styles.commentInput}
            multiline
            numberOfLines={4}
            placeholder="Type your review here..."
            placeholderTextColor="#aaa"
            value={comment}
            onChangeText={setComment}
          />

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent backdrop
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  closeButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#cfc3eb',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#704ecb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
