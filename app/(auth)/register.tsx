import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, Image } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { appRoutes, authRoutes } from '@/routes';
import { ErrorMsg, ErrorTitle } from '@/resources/ErrorMsg';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    try {
      const isSuccess = await register(username, password, email);
      if (isSuccess) {
        Alert.alert('Thông báo', 'Đăng ký thành công', [
          {
            text: 'OK',
            onPress: async () => {
              router.replace(authRoutes.login);
            },
          },
        ]);
      } else {
        Alert.alert('Thông báo', 'Đăng ký thất bại');
      }
    } catch (error: any) {
      const response = error.response;
      if (response.status == 400) {
        var data = response.data;
        const errorMessages = `${data.detail}\n${data.errors?.map((err: any) => err.error).join('\n') || ''}`;
        Alert.alert(ErrorTitle.default, errorMessages);
      } else {
        Alert.alert(ErrorTitle.default, ErrorMsg.unhandledError);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo.png')} style={[styles.logo]} />
      <Text style={styles.title}>Đăng ký</Text>
      <TextInput style={styles.input} placeholder="Tên đăng nhập" value={username} onChangeText={setUsername} />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Đăng ký" onPress={handleRegister} />
      <Link href={authRoutes.login} asChild>
        <Text style={styles.link}>Bạn đã có tài khoản? Đăng nhập</Text>
      </Link>
      <Link href={appRoutes.index} asChild>
        <Text style={styles.link}>Quay về trang chủ</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    // backgroundColor: 'rgb(234,240,255)',
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 240,
    objectFit: 'contain',
    marginHorizontal: 'auto',
    marginTop: -20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  link: {
    color: 'blue',
    marginTop: 15,
    textAlign: 'center',
  },
});
