import { Href } from 'expo-router';

type AppRouteKeys = 'index';

const appRoutes: Record<AppRouteKeys, Href> = {
  index: '/(app)',
};

export default appRoutes;
