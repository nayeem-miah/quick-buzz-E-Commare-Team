import { StatusBar } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingFooter } from './components/OnboardingFooter';
import { OnboardingHeader } from './components/OnboardingHeader';
import { SlideCard } from './components/SlideCard';
import { LAST_SLIDE_INDEX, SPACING, clampSlideIndex } from './constants';
import { SLIDES } from './slides';
import { styles } from './styles';
import type { OnboardingScreenProps, OnboardingSlide } from './types';

export default function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardWidth = screenWidth - SPACING.screen * 2;
  const isLastSlide = currentIndex === LAST_SLIDE_INDEX;

  const goToSlide = useCallback((index: number) => {
    const nextIndex = clampSlideIndex(index);
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setCurrentIndex(nextIndex);
  }, []);

  const handleScrollToIndexFailed = useCallback(
    ({ index }: { index: number }) => {
      const nextIndex = clampSlideIndex(index);

      listRef.current?.scrollToOffset({
        offset: nextIndex * screenWidth,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    },
    [screenWidth],
  );

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(
        event.nativeEvent.contentOffset.x / screenWidth,
      );

      if (nextIndex !== currentIndex) setCurrentIndex(nextIndex);
    },
    [currentIndex, screenWidth],
  );

  const handleNext = useCallback(() => {
    if (isLastSlide) {
      onFinish?.();
      return;
    }

    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide, isLastSlide, onFinish]);

  const handleSkip = useCallback(() => {
    onFinish?.();
  }, [onFinish]);

  const renderSlide = useCallback(
    ({ item }: ListRenderItemInfo<OnboardingSlide>) => (
      <SlideCard slide={item} slideWidth={screenWidth} cardWidth={cardWidth} />
    ),
    [cardWidth, screenWidth],
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View pointerEvents="none" style={styles.decoration}>
        <View style={styles.blobTop} />
        <View style={styles.blobBottom} />
      </View>

      <OnboardingHeader
        activeIndex={currentIndex}
        topInset={insets.top}
        isLastSlide={isLastSlide}
        onSkip={handleSkip}
      />

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
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        initialNumToRender={1}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews
        initialScrollIndex={0}
        style={styles.list}
      />

      <OnboardingFooter
        activeIndex={currentIndex}
        bottomInset={insets.bottom}
        isLastSlide={isLastSlide}
        onNext={handleNext}
      />
    </View>
  );
}
