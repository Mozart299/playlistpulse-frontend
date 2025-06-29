export const designSystem = {
  colors: {
    brand: {
      primary: '#F89508',
      secondary: '#FF8A00',
      tertiary: '#FFB84D',
      light: '#FFF3E0',
      dark: '#CC7A00',
      gradient: 'from-orange-500 to-orange-600',
      gradientHover: 'from-orange-600 to-orange-700'
    },
    semantic: {
      success: {
        50: '#f0fdf4',
        100: '#dcfce7', 
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d'
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309'
      },
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c'
      },
      info: {
        50: '#eff6ff',
        100: '#dbeafe',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8'
      }
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717'
    }
  },
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
    '3xl': '6rem'    // 96px
  },
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgb(248 149 8 / 0.3)',
    glowHover: '0 0 30px rgb(248 149 8 / 0.4)'
  },
  typography: {
    headingPrimary: 'text-2xl font-bold text-gray-900 dark:text-white',
    headingSecondary: 'text-lg font-semibold text-gray-800 dark:text-gray-200',
    headingTertiary: 'text-base font-semibold text-gray-700 dark:text-gray-300',
    bodyLarge: 'text-base text-gray-700 dark:text-gray-300',
    bodyMedium: 'text-sm text-gray-600 dark:text-gray-400',
    bodySmall: 'text-xs text-gray-500 dark:text-gray-500',
    caption: 'text-xs text-gray-400 dark:text-gray-600'
  },
  animations: {
    fadeIn: 'fadeIn 0.3s ease-out',
    slideUp: 'slideUp 0.3s ease-out',
    scaleIn: 'scaleIn 0.2s ease-out',
    bounce: 'bounce 0.5s ease-in-out',
    pulse: 'pulse 2s infinite'
  },
  transitions: {
    fast: 'transition-all duration-150 ease-out',
    medium: 'transition-all duration-300 ease-out',
    slow: 'transition-all duration-500 ease-out'
  }
} as const;

// Component-specific design tokens
export const componentTokens = {
  card: {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm',
    hover: 'hover:shadow-md hover:-translate-y-0.5',
    interactive: 'cursor-pointer transition-all duration-200 ease-out'
  },
  button: {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200',
    secondary: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded-lg transition-all duration-200',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-2 rounded-lg transition-all duration-200'
  },
  input: {
    default: 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200',
    error: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500'
  },
  badge: {
    primary: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full text-xs font-medium',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-medium',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-xs font-medium'
  }
};

// Utility functions for consistent styling
export const getSemanticColor = (type: 'success' | 'warning' | 'error' | 'info', shade: number = 500) => {
  return designSystem.colors.semantic[type][shade as keyof typeof designSystem.colors.semantic.success];
};

export const getBrandGradient = (hover: boolean = false) => {
  return hover ? designSystem.colors.brand.gradientHover : designSystem.colors.brand.gradient;
};