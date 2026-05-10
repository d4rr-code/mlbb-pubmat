import type { PubmatTheme } from '../types/match';

export const DEFAULT_THEMES: PubmatTheme[] = [
  {
    id: 'neon',
    name: 'Neon Esports',
    accentColor: '#00f5ff',
    secondaryColor: '#7c3aed',
    bgStyle: 'gradient',
    fontFamily: 'Barlow Condensed',
    bgColors: ['#0a0a1f', '#0f0f2e'],
  },
  {
    id: 'collegiate',
    name: 'Collegiate',
    accentColor: '#ffd700',
    secondaryColor: '#1e40af',
    bgStyle: 'solid',
    fontFamily: 'Barlow Condensed',
    bgColors: ['#0f1b35', '#172554'],
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    accentColor: '#e5e7eb',
    secondaryColor: '#6b7280',
    bgStyle: 'solid',
    fontFamily: 'Rajdhani',
    bgColors: ['#111827', '#1f2937'],
  },
  {
    id: 'retro',
    name: 'Retro Arcade',
    accentColor: '#fb923c',
    secondaryColor: '#ec4899',
    bgStyle: 'pattern',
    fontFamily: 'Bebas Neue',
    bgColors: ['#1a0a00', '#2d1500'],
  },
  {
    id: 'dark-pro',
    name: 'Dark Pro',
    accentColor: '#22d3ee',
    secondaryColor: '#0ea5e9',
    bgStyle: 'gradient',
    fontFamily: 'Barlow Condensed',
    bgColors: ['#020617', '#0c1a2e'],
  },
];
