import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Map, Navigation2, Satellite, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FullBottomSheet, HalfBottomSheet, SearchResultPlaceCard, UserInfoModal } from '@/components';
import PlaceDetailCard from '@/components/DetailPlaceCard';
import { WebRootPath } from '@/constants/WebRootPath';
import { useAuth } from '@/contexts/AuthContext';
import { CommonUtils } from '@/helpers/commonUtils';
import { useLocation } from '@/hooks/useLocation';
import { authRoutes } from '@/routes';
import { placeService } from '@/services';
import { LocationType } from '@/types/location';
import { PlaceDetailType } from '@/types/place';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);

  const mapRef = useRef<MapView | null>(null);
  const { location } = useLocation();
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);

  const [places, setPlaces] = useState<PlaceDetailType[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetailType | null>(null);

  const [typeKeyword, setTypeKeyword] = useState('');
  const [placeTypes, setPlaceTypes] = useState<string[]>([]);

  const [distance, setDistance] = useState('');

  const openGoogleMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Lỗi', 'Không thể mở Google Maps');
    });
  };

  useEffect(() => {
    loadPlaceTypes();
  }, []);

  const loadPlaceTypes = async () => {
    try {
      const placeTypes = await placeService.getTypesAsync();
      setPlaceTypes(placeTypes);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy dữ liệu loại địa điểm');
    }
  };

  const handleSearch = async () => {
    if (!location) {
      Alert.alert('Lỗi', 'Không thể xác định vị trí hiện tại');
      return;
    }

    if (!distance.trim() && !typeKeyword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng tìm kiếm theo bán kính hoặc loại địa điểm');
      return;
    }

    if (!Number.isInteger(parseInt(distance)) || parseInt(distance) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập bán kính tìm kiếm hợp lệ');
      return;
    } else if (parseInt(distance) > 10000) {
      Alert.alert('Lỗi', 'Bán kính tìm kiếm không được vượt quá 10 km');
      return;
    }

    if (!distance.trim() && !typeKeyword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng tìm kiếm theo bán kính hoặc loại địa điểm');
      return;
    }

    try {
      console.log(`Searching with ${typeKeyword}, ${location.latitude}, ${location.longitude}, ${distance}`);
      const foundPlaces = await placeService.getPlacesAsync({
        type: typeKeyword,
        centerLatitude: location.latitude,
        centerLongitude: location.longitude,
        radiusMeters: parseInt(distance),
      });

      if (foundPlaces.length == 0) {
        handleClearResults();
        Alert.alert('Thông báo', 'Không tìm thấy địa điểm. Thử tìm kiếm với bán kính hoặc loại địa điểm khác');
      } else {
        setPlaces(foundPlaces);
        setIsSearchResultVisible(true);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tìm kiếm địa điểm');
      throw error;
    }
  };

  const handlePressType = (placeType: string) => {
    setTypeKeyword((prevType) => {
      if (prevType == placeType) {
        setPlaces([]);
        setIsSearchResultVisible(false);
        return '';
      } else return placeType;
    });
  };

  useEffect(() => {
    if (typeKeyword) {
      handleSearch();
    }
  }, [typeKeyword]);

  const handleClearResults = () => {
    setPlaces([]);
    setIsSearchResultVisible(false);
    setDistance('');
    setTypeKeyword('');
  };

  const handleOpenDetail = (place: PlaceDetailType) => {
    setSelectedPlace(place);
    moveToLocation({ latitude: place.latitude, longitude: place.longitude });
    setIsSearchResultVisible(false);
  };

  const handleCloseDetail = () => {
    setSelectedPlace(null);
    setIsSearchResultVisible(true);
  };

  const handleLogout = async () => {
    const isSuccess = await logout();
    if (isSuccess) {
      setModalVisible(false);
      router.replace(authRoutes.login);
    } else {
      Alert.alert('Thông báo', 'Đăng xuất thất bại');
    }
  };

  const toggleMapType = () => {
    setMapType((prevType) => (prevType === 'standard' ? 'satellite' : 'standard'));
  };

  const moveToLocation = (location: LocationType | null) => {
    if (!location) return;

    const region: Region = {
      latitude: location?.latitude,
      longitude: location?.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(region, 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar backgroundColor="#fff" />

        {location && (
          <MapView
            ref={mapRef}
            style={styles.map}
            mapType={mapType}
            showsUserLocation
            showsCompass={false}
            showsMyLocationButton={false}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {places.map((place) => (
              <Marker
                key={place.detailId}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name ?? 'Unknown'}
                tracksViewChanges={false}
              />
            ))}
          </MapView>
        )}

        <View
          style={[
            styles.actionBtnWrapeer,
            (isSearchResultVisible || selectedPlace) && styles.actionBtnWrapperMb,
          ]}
        >
          {mapType === 'satellite' ? (
            <TouchableOpacity style={styles.actionBtn} onPress={toggleMapType}>
              <Satellite size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.actionBtn} onPress={toggleMapType}>
              <Map size={20} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionBtn} onPress={() => moveToLocation(location)}>
            <MaterialIcons name="my-location" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập bán kính tìm kiếm (mét)..."
            value={distance}
            onChangeText={setDistance}
            onSubmitEditing={handleSearch}
          />
          {distance && (
            <TouchableOpacity style={styles.clearAreaKeywordBtn} onPress={() => setDistance('')}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            {user ? (
              <Image src={`${WebRootPath.imagePath}/${user?.avatar}`} style={[styles.userAvatar]} />
            ) : (
              <Image src={WebRootPath.defaultAvatarImagePath} style={[styles.userAvatar]} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.placeTypes}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.placeTypeContainer}
          >
            {placeTypes.map((type) => {
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => handlePressType(type)}
                  style={[styles.typeButton, typeKeyword === type && styles.selectedTypeButton]}
                >
                  <Text style={[styles.typeText, typeKeyword === type && styles.selectedTypeText]}>
                    {CommonUtils.capitalize(type)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {isSearchResultVisible && !selectedPlace && (
          <HalfBottomSheet>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>{`Kết quả (${places.length})`}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClearResults}>
                <X size={16} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.placesList}
            >
              {places.map((place: PlaceDetailType) => {
                return (
                  <SearchResultPlaceCard
                    key={place.detailId}
                    place={place}
                    isLast={places[places.length - 1] === place}
                    onOpenDetail={handleOpenDetail}
                  />
                );
              })}
            </ScrollView>
          </HalfBottomSheet>
        )}
        {selectedPlace && (
          <FullBottomSheet>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>{selectedPlace.name ?? 'Unknown'}</Text>
              <View style={styles.headerBtnGroup}>
                <TouchableOpacity
                  style={styles.dirButton}
                  onPress={() => openGoogleMaps(selectedPlace.latitude, selectedPlace.longitude)}
                >
                  <Navigation2 size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={handleCloseDetail}>
                  <X size={16} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.placeDetail}>
              <ScrollView>
                <PlaceDetailCard place={selectedPlace} onReloadPlaceList={handleSearch} />
              </ScrollView>
            </ScrollView>
          </FullBottomSheet>
        )}
        <View>
          <UserInfoModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onLogout={handleLogout}
            userInfo={user}
          />
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  callout: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    elevation: 5,
  },
  calloutText: {
    fontWeight: 'bold',
  },
  placeDetail: {
    flex: 1,
    height: 512,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  searchBar: {
    position: 'absolute',
    top: 16,
    left: 12,
    right: 12,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 8,
  },
  clearAreaKeywordBtn: {
    marginRight: 8,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 999,
  },
  placeTypes: {
    position: 'absolute',
    top: 76,
    left: 12,
    right: 12,
  },
  placeTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  selectedTypeButton: {
    backgroundColor: '#007BFF',
  },
  typeText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTypeText: {
    color: '#fff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  resultsTitle: {
    fontSize: 22,
    width: 240,
  },
  headerBtnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  dirButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#007AFF',
  },
  closeButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#eee',
  },
  placesList: {
    padding: 16,
    gap: 8,
    backgroundColor: '#f2f3f5',
  },
  actionBtnWrapeer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionBtnWrapperMb: {
    bottom: 80,
  },
  actionBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  currentLocationMarkerWrapper: {
    backgroundColor: 'rgba(0, 122, 255, 0.4)',
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  currentLocationMarker: {
    width: 16,
    height: 16,
    backgroundColor: '#007AFF',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default HomeScreen;
