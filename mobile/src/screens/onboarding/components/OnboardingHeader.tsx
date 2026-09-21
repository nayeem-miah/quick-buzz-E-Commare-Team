import { Text, TouchableOpacity, View } from 'react-native';
import { HEADER_TOP_PADDING, SLIDE_COUNT } from '../constants';
import { styles } from '../styles';
import { BrandLogo } from './BrandLogo';

type OnboardingHeaderProps = {
  activeIndex: number;
  topInset: number;
  isLastSlide: boolean;
  onSkip: () => void;
};

export function OnboardingHeader({
  activeIndex,
  topInset,
  isLastSlide,
  onSkip,
}: OnboardingHeaderProps) {
  return (
    <View style={[styles.header, { paddingTop: topInset + HEADER_TOP_PADDING }]}>
      <BrandLogo />

      <View style={styles.headerRight}>
        <Text style={styles.counter}>
          {activeIndex + 1}/{SLIDE_COUNT}
        </Text>

        {!isLastSlide && (
          <TouchableOpacity
            onPress={onSkip}
            activeOpacity={0.7}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
