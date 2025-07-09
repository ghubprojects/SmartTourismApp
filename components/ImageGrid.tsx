import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import { WebRootPath } from '@/constants/WebRootPath';
import { PlacePhotoType } from '@/types/place';
import { ScrollView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

interface ImageGridProps {
  imageList: PlacePhotoType[];
}

export default function ImageGrid({ imageList }: ImageGridProps) {
  return (
    <ScrollView horizontal style={styles.container}>
      <View style={styles.leftColumn}>
        <Image src={`${WebRootPath.imagePath}/${imageList[0].fileName}.jpg`} style={styles.mainImage} />
      </View>
      <View style={styles.rightColumn}>
        {imageList
          .slice(1, 3)
          .map(
            (item, index) =>
              item && (
                <Image
                  key={index}
                  src={`${WebRootPath.imagePath}/${item.fileName}.jpg`}
                  style={styles.smallImage}
                  resizeMode="cover"
                />
              )
          )}
      </View>
      <View style={[styles.rightColumn, styles.lastColumn]}>
        {imageList
          .slice(3, 5)
          .map(
            (item, index) =>
              item && (
                <Image
                  key={index}
                  src={`${WebRootPath.imagePath}/${item.fileName}.jpg`}
                  style={styles.smallImage}
                  resizeMode="cover"
                />
              )
          )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: width,
    height: width,
  },
  leftColumn: {
    flex: 2,
    padding: 2,
    paddingLeft: 16,
  },
  rightColumn: {
    flex: 1,
    padding: 2,
  },
  lastColumn: {
    paddingRight: 16,
  },
  mainImage: {
    flex: 1,
    borderRadius: 8,
    aspectRatio: 0.7,
  },
  smallImage: {
    flex: 1,
    marginBottom: 4,
    borderRadius: 8,
    aspectRatio: 1,
  },
  horizontalContainer: {
    flexDirection: 'row',
    width: width,
    height: width / 2,
    padding: 2,
  },
  horizontalImage: {
    flex: 1,
    margin: 2,
    borderRadius: 8,
  },
});
