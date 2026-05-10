export type MatchFormat = 'BO1' | 'BO3' | 'BO5';
export type HeroRole = 'Gold' | 'EXP' | 'Jungle' | 'Roam' | 'Mid';
export type HeroClass = 'Marksman' | 'Fighter' | 'Mage' | 'Tank' | 'Assassin' | 'Support';
export type BgStyle = 'gradient' | 'solid' | 'pattern';
export type TemplateId = 'scoreboard' | 'mvp' | 'summary';
export type AspectRatio = '1:1' | '9:16';

export interface Hero {
  id: string;
  name: string;
  role: HeroClass;
  color: string;
}

export interface PlayerDraft {
  playerName: string;
  hero: Hero | null;
  laneRole: HeroRole;
}

export interface GameResult {
  gameNumber: number;
  winner: 'teamA' | 'teamB';
  teamADraft: PlayerDraft[];
  teamBDraft: PlayerDraft[];
  duration?: string;
}

export interface TeamData {
  name: string;
  logo?: string;
  score: number;
}

export interface MVPData {
  playerName: string;
  teamId: 'teamA' | 'teamB';
  hero: Hero | null;
  kills: number;
  deaths: number;
  assists: number;
  damageDealt?: number;
  damageTaken?: number;
}

export interface PubmatTheme {
  id: string;
  name: string;
  accentColor: string;
  secondaryColor: string;
  bgStyle: BgStyle;
  fontFamily: string;
  bgColors: [string, string];
}

export interface VisibilityOptions {
  showHeroIcons: boolean;
  showPlayerNames: boolean;
  showStats: boolean;
  showMVPBadge: boolean;
}

export interface MatchData {
  id: string;
  tournamentName: string;
  tournamentLogo?: string;
  stage: string;
  date: string;
  time: string;
  format: MatchFormat;
  teamA: TeamData;
  teamB: TeamData;
  games: GameResult[];
  mvp?: MVPData;
  theme: PubmatTheme;
  template: TemplateId;
  aspectRatio: AspectRatio;
  visibility: VisibilityOptions;
  createdAt: string;
}
