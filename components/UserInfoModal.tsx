import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { WebRootPath } from '@/constants/WebRootPath';
import { authRoutes } from '@/routes';
import { UserType } from '@/types/auth';

interface UserInfoModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  userInfo: UserType | null;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ visible, onClose, onLogout, userInfo }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#000" />
            </TouchableOpacity>
            <Image source={require('@/assets/images/logo.png')} style={[styles.logo]} />
          </View>
          {userInfo ? (
            <View style={{ alignItems: 'center' }}>
              <View style={styles.infoWrapper}>
                <View style={styles.colFirst}>
                  <Image src={`${WebRootPath.imagePath}/${userInfo?.avatar}`} style={[styles.avatar]} />
                </View>
                <View style={styles.colSecond}>
                  <Text style={styles.username}>{userInfo?.username}</Text>
                  <Text style={styles.email}>{userInfo?.email}</Text>
                </View>
              </View>
              <Pressable style={styles.logoutButton} onPress={onLogout}>
                <Text style={styles.logoutText}>Đăng xuất</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.logoutButton} onPress={() => router.replace(authRoutes.login)}>
              <Text style={styles.logoutText}>Đăng nhập</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default UserInfoModal;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    maxWidth: 300,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 24,
  },
  header: {
    position: 'relative',
    height: 24,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
    width: 124,
    objectFit: 'contain',
  },
  infoWrapper: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  colFirst: {},
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
  },
  colSecond: {
    width: 200,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  email: {
    fontSize: 13,
    color: '#333',
  },
  logoutButton: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    width: 144,
  },
  logoutText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  distanceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  distanceLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  distancePicker: {
    flex: 1,
    paddingVertical: 0,
  },
});
