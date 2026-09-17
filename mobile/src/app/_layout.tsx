import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AppHeader from '../components/AppHeader';

// Keep splash visible while app loads
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // No async work yet, mark ready on mount
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      SplashScreen.hide();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => <AppHeader />,
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
