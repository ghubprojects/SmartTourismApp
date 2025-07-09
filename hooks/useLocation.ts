import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import { LocationType } from '@/types/location';
import { ErrorMsg } from '@/resources/ErrorMsg';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg(ErrorMsg.locationAccessDenied);
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
        setErrorMsg(ErrorMsg.fetchLocation);
        console.log('Location fetch error:', error);
      }
    };

    fetchLocation();
  }, []);

  return { location, errorMsg };
};
