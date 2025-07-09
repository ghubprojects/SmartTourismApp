import { Href } from 'expo-router';

type AuthRouteKeys = 'login' | 'register';

const authRoutes: Record<AuthRouteKeys, Href> = {
  login: '/(auth)/login',
  register: '/(auth)/register',
};

export default authRoutes;
