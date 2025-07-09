export interface PlaceDetailType {
  detailId: number;
  type: string;
  name: string;
  description: string;
  address: string;
  openingHours: string;
  openingStatus: number;
  latitude: number;
  longitude: number;
  rating: number;
  photos: PlacePhotoType[];
  reviews: PlaceReviewType[];
}

export interface PlacePhotoType {
  photoId: number;
  caption: string;
  fileName: string;
  filePath: string;
}

export interface PlaceReviewType {
  reviewId: number;
  rating: number;
  comment: string;
  userName: string;
  userAvatar: string;
  lastModifiedDate: Date;
}
