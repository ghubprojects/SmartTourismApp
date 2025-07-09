import { Menu, Navigation2, Star } from 'lucide-react-native';
import { Alert, Image, Linking, StyleSheet, Text, View } from 'react-native';
import { Pressable, ScrollView } from 'react-native-gesture-handler';

import { WebRootPath } from '@/constants/WebRootPath';
import { CommonUtils } from '@/helpers/commonUtils';
import { PlaceDetailType } from '@/types/place';

interface SearchResultPlaceCardProps {
  place: PlaceDetailType;
  isLast: boolean;
  onOpenDetail: (place: PlaceDetailType) => void;
}

export default function SearchResultPlaceCard({ place, isLast, onOpenDetail }: SearchResultPlaceCardProps) {
  const openingDescriptions = ['Đã đóng cửa', 'Đang mở cửa', 'Mở cả ngày', 'Chưa xác định'];

  const openGoogleMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Lỗi', 'Không thể mở Google Maps');
    });
  };

  const handleOpenDetail = () => {
    onOpenDetail(place);
  };

  return (
    <View style={[styles.card, isLast && styles.lastCard]}>
      <ScrollView horizontal style={styles.imageScroll}>
        {place.photos.map((item, i, arr) => {
          return (
            <Image
              key={item.photoId}
              src={`${WebRootPath.imagePath}/${item.fileName}.jpg`}
              style={[styles.image, i == arr.length - 1 && styles.lastImage]}
            />
          );
        })}
      </ScrollView>

      <Pressable style={styles.content} onPress={handleOpenDetail}>
        <Text numberOfLines={1} style={styles.title}>
          {place.name ?? 'Unknown'}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{place.rating}</Text>
          <Star size={16} color="#FFB800" fill="#FFB800" />
          <Text style={styles.reviews}>({place.reviews.length})</Text>
          <Text style={styles.dot}> · </Text>
          <Text style={styles.category}>{CommonUtils.capitalize(place.type)}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.status,
              place.openingStatus == 1 || place.openingStatus == 2 ? styles.openStatus : styles.closeStatus,
            ]}
          >
            {openingDescriptions[place.openingStatus]}
          </Text>
          <Text style={styles.dot}> · </Text>
          <Text style={styles.openTime}>{place.openingHours}</Text>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={handleOpenDetail}>
          <Menu size={16} color="#1A73E8" />
          <Text style={styles.actionText}>Chi tiết</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => openGoogleMaps(place.latitude, place.longitude)}>
          <Navigation2 size={16} color="#1A73E8" />
          <Text style={styles.actionText}>Chỉ đường</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 330,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 16,
    gap: 12,
    marginRight: 8,
  },
  lastCard: {
    marginRight: 0,
  },
  imageScroll: {
    maxWidth: 297,
  },
  imageScrollContent: {
    alignItems: 'center',
  },
  image: {
    width: 116,
    height: 112,
    marginRight: 12,
    borderRadius: 16,
  },
  lastImage: {
    marginRight: 0,
  },
  content: {},
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginRight: 4,
    fontSize: 14,
  },
  reviews: {
    marginLeft: 4,
    color: '#70757A',
    fontSize: 14,
  },
  dot: {
    color: '#70757A',
  },
  price: {
    color: '#70757A',
    fontSize: 14,
  },
  category: {
    color: '#70757A',
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
  },
  openStatus: {
    color: 'rgb(25, 134, 57)',
  },
  closeStatus: {
    color: '#D93025',
  },
  openTime: {
    color: '#70757A',
    fontSize: 14,
  },
  distance: {
    color: '#70757A',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ecf2fe',
    borderRadius: 999,
  },
  actionText: {
    color: '#1A73E8',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 2,
  },
});
