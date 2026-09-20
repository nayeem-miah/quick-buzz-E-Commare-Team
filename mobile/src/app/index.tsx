import { useState } from 'react';
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/onboarding';

export default function Index() {
  const [completedOnboarding, setCompletedOnboarding] = useState(false);

  if (!completedOnboarding) {
    return <OnboardingScreen onFinish={() => setCompletedOnboarding(true)} />;
  }

  return <HomeScreen />;
}
