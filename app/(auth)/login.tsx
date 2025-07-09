import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, Image } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { appRoutes, authRoutes } from '@/routes';
import { ErrorMsg, ErrorTitle } from '@/resources/ErrorMsg';

export default function LoginScreen() {
  const router = useRouter();
  const { login, checkAuth } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const isSuccess = await login(username, password);
      if (isSuccess) {
        router.replace(appRoutes.index);
      } else {
        Alert.alert('Thông báo', 'Đăng nhập thất bại');
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
      <View style={styles.form}>
        <Text style={styles.title}>Đăng nhập</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Đăng nhập" onPress={handleLogin} />
        <Link href={authRoutes.register} asChild>
          <Text style={styles.link}>Bạn chưa có tài khoản? Đăng ký</Text>
        </Link>
        <Link href={appRoutes.index} asChild>
          <Text style={styles.link}>Quay về trang chủ</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    // backgroundColor: 'rgb(234,240,255)',
    backgroundColor: '#fff',
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 240,
    objectFit: 'contain',
    marginHorizontal: 'auto',
    marginTop: -20,
  },
  form: {
    paddingTop: 40,
    paddingBottom: 40,
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
