import { SLIDES } from './slides';

export const SLIDE_COUNT = SLIDES.length;
export const LAST_SLIDE_INDEX = SLIDE_COUNT - 1;
export const HEADER_TOP_PADDING = 12;
export const MIN_FOOTER_PADDING = 20;

export const SPACING = {
  screen: 24,
  radiusCard: 32,
  radiusPill: 999,
  radiusButton: 18,
} as const;

export const clampSlideIndex = (index: number) =>
  Math.max(0, Math.min(index, LAST_SLIDE_INDEX));
