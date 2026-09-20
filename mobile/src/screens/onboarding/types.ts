import type { ImageSourcePropType } from 'react-native';

export type OnboardingSlide = {
  id: string;
  stepLabel: string;
  badge: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
};

export type OnboardingScreenProps = {
  onFinish?: () => void;
};
