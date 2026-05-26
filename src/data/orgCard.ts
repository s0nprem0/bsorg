export const ORG_CARD = {
  SIZES: {
    SMALL: {
      LOGO_WIDTH: 44,
      MIN_HEIGHT: 44,
      PADDING: 'p-4 md:p-5',
      TITLE_SIZE: 'text-lg md:text-xl',
      DESCRIPTION_SIZE: 'text-sm',
    },
    LARGE: {
      LOGO_WIDTH: 60,
      MIN_HEIGHT: 60,
      PADDING: 'p-6 md:p-8',
      TITLE_SIZE: 'text-2xl md:text-3xl',
      DESCRIPTION_SIZE: 'text-base leading-relaxed',
    },
  },
  ICONS: {
    SIZE_SMALL: 18,
    SIZE_LARGE: 24,
    CONTAINER_SIZE: 36,
  },
} as const;
