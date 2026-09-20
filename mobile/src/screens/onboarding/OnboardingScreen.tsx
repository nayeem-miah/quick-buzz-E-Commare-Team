import { StatusBar } from 'expo-status-bar';
import { memo, useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  type ListRenderItemInfo,
  NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SLIDES } from './slides';
import type { OnboardingScreenProps, OnboardingSlide } from './types';

const COLORS = {
  background: '#FFF9F3',
  card: '#FFFFFF',
  ink: '#131A26',
  muted: '#6B7280',
  primary: '#FF7A1A',
  primaryDark: '#EA580C',
  softOrange: '#FFF1E3',
  line: '#F3E7D8',
  dotIdle: '#EADDCB',
  badge: '#4ADE80',
  textSecondary: '#374151',
  blobTop: '#FFE7CF',
} as const;

const SPACING = {
  screen: 24,
  radiusCard: 32,
  radiusPill: 999,
  radiusButton: 18,
} as const;

function BrandLogo() {
  return (
    <Text style={styles.logo}>
      Quick<Text style={styles.logoAccent}>Buzz</Text>
    </Text>
  );
}

const PaginationDots = memo(function PaginationDots({
  total,
  activeIndex,
}: {
  total: number;
  activeIndex: number;
}) {
  return (
    <View
      style={styles.dotsRow}
      accessibilityLabel={`Step ${activeIndex + 1} of ${total}`}
    >
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={[styles.dot, index === activeIndex && styles.dotActive]}
        />
      ))}
    </View>
  );
});

const SlideCard = memo(function SlideCard({
  slide,
  slideWidth,
  cardWidth,
}: {
  slide: OnboardingSlide;
  slideWidth: number;
  cardWidth: number;
}) {
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

export default function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const CARD_WIDTH = SCREEN_WIDTH - SPACING.screen * 2;
  const isLastSlide = currentIndex === SLIDES.length - 1;

  const goToSlide = useCallback((index: number) => {
    const safeIndex = Math.max(0, Math.min(index, SLIDES.length - 1));
    listRef.current?.scrollToIndex({ index: safeIndex, animated: true });
    setCurrentIndex(safeIndex);
  }, []);

  const handleScrollToIndexFailed = useCallback(
    ({ index }: { index: number }) => {
      listRef.current?.scrollToOffset({
        offset: index * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(index);
    },
    [SCREEN_WIDTH],
  );

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(
        event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
      );
      if (nextIndex !== currentIndex) setCurrentIndex(nextIndex);
    },
    [currentIndex, SCREEN_WIDTH],
  );

  const handleNext = useCallback(() => {
    if (isLastSlide) onFinish?.();
    else goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide, isLastSlide, onFinish]);

  const handleSkip = useCallback(() => {
    onFinish?.();
  }, [onFinish]);

  const renderSlide = useCallback(
    ({ item }: ListRenderItemInfo<OnboardingSlide>) => (
      <SlideCard slide={item} slideWidth={SCREEN_WIDTH} cardWidth={CARD_WIDTH} />
    ),
    [CARD_WIDTH, SCREEN_WIDTH],
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View pointerEvents="none" style={styles.decoration}>
        <View style={styles.blobTop} />
        <View style={styles.blobBottom} />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <BrandLogo />
        <View style={styles.headerRight}>
          <Text style={styles.counter}>
            {currentIndex + 1}/{SLIDES.length}
          </Text>
          {!isLastSlide && (
            <TouchableOpacity
              onPress={handleSkip}
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

      <FlatList
        ref={listRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        initialNumToRender={1}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews
        initialScrollIndex={0}
        style={styles.list}
      />

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        <PaginationDots total={SLIDES.length} activeIndex={currentIndex} />

        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel={isLastSlide ? 'Start shopping' : 'Go next'}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            {isLastSlide ? 'Start Shopping' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  decoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blobTop: {
    position: 'absolute',
    top: -110,
    right: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.blobTop,
    opacity: 0.7,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -120,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.softOrange,
  },
  list: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screen,
    paddingBottom: 8,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.5,
  },
  logoAccent: {
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counter: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.muted,
    fontVariant: ['tabular-nums'],
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SPACING.radiusPill,
    backgroundColor: 'rgba(19, 26, 38, 0.06)',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  slide: {
    alignItems: 'center',
    paddingHorizontal: SPACING.screen,
  },
  imageCard: {
    height: 380,
    maxHeight: 420,
    borderRadius: SPACING.radiusCard,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    borderWidth: 4,
    borderColor: COLORS.card,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOnImage: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: SPACING.radiusPill,
    backgroundColor: 'rgba(19, 26, 38, 0.72)',
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.badge,
  },
  badgeOnImageText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.card,
    letterSpacing: 0.2,
  },
  textBlock: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 4,
  },
  stepPill: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.primaryDark,
    backgroundColor: COLORS.softOrange,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: SPACING.radiusPill,
    overflow: 'hidden',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 34,
    textAlign: 'center',
    color: COLORS.ink,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    color: COLORS.muted,
    maxWidth: 320,
  },

  footer: {
    paddingHorizontal: SPACING.screen,
    paddingTop: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 20,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.dotIdle,
  },
  dotActive: {
    width: 32,
    backgroundColor: COLORS.primary,
  },
  primaryButton: {
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SPACING.radiusButton,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: COLORS.card,
  },
});
