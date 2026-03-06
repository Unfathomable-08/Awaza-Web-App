/**
 * Awaza App Design System - Common Styles & Metrics (Web Version)
 */
import { colors } from './Colors';

const deviceWidth = typeof window !== 'undefined' ? window.innerWidth : 375;
const deviceHeight = typeof window !== 'undefined' ? window.innerHeight : 812;

// Responsive Helpers
export const hp = (percentage: number) => (percentage * deviceHeight) / 100;
export const wp = (percentage: number) => (percentage * deviceWidth) / 100;

export const spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
};

export const radius = {
    s: 6,
    m: 12,
    l: 18,
    xl: 24,
    full: 9999,
};

// Simplified commonStyles for Web (using Tailwind mostly, but keeping these for compatibility)
export const commonStyles = {
    flex1: { display: 'flex', flex: 1 },
    row: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
    rowBetween: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    center: { display: 'flex', alignItems: 'center', justifyContent: 'center' },

    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: colors.background,
    },

    shadowSmall: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    shadowMedium: {
        boxShadow: '0 3px 5px rgba(0, 0, 0, 0.15)',
    },

    textBase: {
        fontSize: '16px',
        color: colors.text,
        fontFamily: 'Inter, system-ui, sans-serif',
    },
};
