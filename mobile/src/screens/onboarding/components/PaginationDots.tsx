import { memo } from 'react';
import { View } from 'react-native';
import { styles } from '../styles';

type PaginationDotsProps = {
  total: number;
  activeIndex: number;
};

export const PaginationDots = memo(function PaginationDots({
  total,
  activeIndex,
}: PaginationDotsProps) {
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
