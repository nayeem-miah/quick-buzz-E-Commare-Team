import { memo } from 'react';
import { Image, Text, View } from 'react-native';
import { styles } from '../styles';
import type { OnboardingSlide } from '../types';

type SlideCardProps = {
  slide: OnboardingSlide;
  slideWidth: number;
  cardWidth: number;
};

export const SlideCard = memo(function SlideCard({
  slide,
  slideWidth,
  cardWidth,
}: SlideCardProps) {
  return (
    <View style={[styles.slide, { width: slideWidth }]}>
      <View style={[styles.imageCard, { width: cardWidth }]}>
        <Image source={slide.image} style={styles.image} resizeMode="cover" />
        <View style={styles.badgeOnImage}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeOnImageText}>{slide.badge}</Text>
        </View>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.stepPill}>{slide.stepLabel}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>
    </View>
  );
});
