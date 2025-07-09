import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '@/components';
import { ErrorMsg } from '@/resources/ErrorMsg';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">{ErrorMsg.notFoundRoute}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">{ErrorMsg.backToHome}</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
