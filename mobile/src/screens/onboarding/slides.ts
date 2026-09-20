import type { OnboardingSlide } from './types';

export const SLIDES: OnboardingSlide[] = [
  {
    id: 'discover',
    stepLabel: 'Step 1 of 3',
    badge: '10k+ products',
    title: 'Discover What You Need',
    description:
      'Explore everyday essentials to the latest gadgets — all in one place.',
    image: require('../../assets/onboarding1.jpg'),
  },
  {
    id: 'savings',
    stepLabel: 'Step 2 of 3',
    badge: 'Up to 50% off',
    title: 'Shop More, Save More',
    description: 'Grab great deals and exciting offers on products you love.',
    image: require('../../assets/onboarding2.jpg'),
  },
  {
    id: 'easy',
    stepLabel: 'Step 3 of 3',
    badge: 'Fast checkout',
    title: 'Shopping, Made Easy',
    description: 'Browse, choose, and check out in just a few taps.',
    image: require('../../assets/onboarding3.jpg'),
  },
];
