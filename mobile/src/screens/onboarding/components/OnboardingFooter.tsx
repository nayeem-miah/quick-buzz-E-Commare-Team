import { Text, TouchableOpacity, View } from 'react-native';
import { MIN_FOOTER_PADDING, SLIDE_COUNT } from '../constants';
import { styles } from '../styles';
import { PaginationDots } from './PaginationDots';

type OnboardingFooterProps = {
  activeIndex: number;
  bottomInset: number;
  isLastSlide: boolean;
  onNext: () => void;
};

export function OnboardingFooter({
  activeIndex,
  bottomInset,
  isLastSlide,
  onNext,
}: OnboardingFooterProps) {
  const buttonLabel = isLastSlide ? 'Start Shopping' : 'Next';

  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: Math.max(bottomInset, MIN_FOOTER_PADDING) },
      ]}
    >
      <PaginationDots total={SLIDE_COUNT} activeIndex={activeIndex} />

      <TouchableOpacity
        onPress={onNext}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={isLastSlide ? 'Start shopping' : 'Go next'}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
