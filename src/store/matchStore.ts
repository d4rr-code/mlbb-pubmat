import { create } from 'zustand';
import type { MatchData, MatchFormat, PubmatTheme, MVPData, GameResult, TemplateId, AspectRatio } from '../types/match';
import { DEFAULT_THEMES } from '../data/defaultThemes';

const STORAGE_KEY = 'mlbb_pubmat_history';
const MAX_HISTORY = 10;

function makeEmptyGames(format: MatchFormat): GameResult[] {
  const count = format === 'BO1' ? 1 : format === 'BO3' ? 3 : 5;
  return Array.from({ length: count }, (_, i) => ({
    gameNumber: i + 1,
    winner: 'teamA' as const,
    teamADraft: Array.from({ length: 5 }, (__, j) => ({
      playerName: '',
      hero: null,
      laneRole: (['Gold', 'EXP', 'Jungle', 'Roam', 'Mid'] as const)[j],
    })),
    teamBDraft: Array.from({ length: 5 }, (__, j) => ({
      playerName: '',
      hero: null,
      laneRole: (['Gold', 'EXP', 'Jungle', 'Roam', 'Mid'] as const)[j],
    })),
    duration: '',
  }));
}

function newMatchData(): MatchData {
  return {
    id: crypto.randomUUID(),
    tournamentName: '',
    tournamentLogo: undefined,
    stage: 'Group Stage',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    format: 'BO3',
    teamA: { name: '', logo: undefined, score: 0 },
    teamB: { name: '', logo: undefined, score: 0 },
    games: makeEmptyGames('BO3'),
    mvp: undefined,
    theme: DEFAULT_THEMES[0],
    template: 'scoreboard',
    aspectRatio: '1:1',
    visibility: {
      showHeroIcons: true,
      showPlayerNames: true,
      showStats: true,
      showMVPBadge: true,
    },
    createdAt: new Date().toISOString(),
  };
}

function loadHistory(): MatchData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: MatchData[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch {}
}

interface MatchStore {
  match: MatchData;
  history: MatchData[];
  currentStep: number;
  setStep: (step: number) => void;
  updateTournament: (data: Partial<Pick<MatchData, 'tournamentName' | 'tournamentLogo' | 'stage' | 'date' | 'time'>>) => void;
  updateTeamA: (data: Partial<MatchData['teamA']>) => void;
  updateTeamB: (data: Partial<MatchData['teamB']>) => void;
  updateFormat: (format: MatchFormat) => void;
  updateGame: (gameIndex: number, data: Partial<GameResult>) => void;
  updateMVP: (mvp: MVPData | undefined) => void;
  updateTheme: (theme: PubmatTheme) => void;
  updateTemplate: (template: TemplateId) => void;
  updateAspectRatio: (ratio: AspectRatio) => void;
  updateVisibility: (vis: Partial<MatchData['visibility']>) => void;
  saveToHistory: () => void;
  loadFromHistory: (id: string) => void;
  clearHistory: () => void;
  resetMatch: () => void;
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  match: newMatchData(),
  history: loadHistory(),
  currentStep: 0,

  setStep: (step) => set({ currentStep: step }),

  updateTournament: (data) =>
    set((s) => ({ match: { ...s.match, ...data } })),

  updateTeamA: (data) =>
    set((s) => ({ match: { ...s.match, teamA: { ...s.match.teamA, ...data } } })),

  updateTeamB: (data) =>
    set((s) => ({ match: { ...s.match, teamB: { ...s.match.teamB, ...data } } })),

  updateFormat: (format) =>
    set((s) => ({ match: { ...s.match, format, games: makeEmptyGames(format) } })),

  updateGame: (gameIndex, data) =>
    set((s) => {
      const games = [...s.match.games];
      games[gameIndex] = { ...games[gameIndex], ...data };
      return { match: { ...s.match, games } };
    }),

  updateMVP: (mvp) =>
    set((s) => ({ match: { ...s.match, mvp } })),

  updateTheme: (theme) =>
    set((s) => ({ match: { ...s.match, theme } })),

  updateTemplate: (template) =>
    set((s) => ({ match: { ...s.match, template } })),

  updateAspectRatio: (aspectRatio) =>
    set((s) => ({ match: { ...s.match, aspectRatio } })),

  updateVisibility: (vis) =>
    set((s) => ({ match: { ...s.match, visibility: { ...s.match.visibility, ...vis } } })),

  saveToHistory: () => {
    const { match, history } = get();
    const saved: MatchData = { ...match, createdAt: new Date().toISOString() };
    const filtered = history.filter((h) => h.id !== saved.id);
    const next = [saved, ...filtered];
    saveHistory(next);
    set({ history: next });
  },

  loadFromHistory: (id) => {
    const { history } = get();
    const found = history.find((h) => h.id === id);
    if (found) set({ match: { ...found, id: crypto.randomUUID() }, currentStep: 0 });
  },

  clearHistory: () => {
    saveHistory([]);
    set({ history: [] });
  },

  resetMatch: () => set({ match: newMatchData(), currentStep: 0 }),
}));
