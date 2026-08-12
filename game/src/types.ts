export enum GameScene {
  AREQUIPA = 'AREQUIPA',
  BARRANCA = 'BARRANCA',
  UTAH_TRAVEL = 'UTAH_TRAVEL',
  PROVO_TEMPLE = 'PROVO_TEMPLE',
}

export interface DialogueLine {
  speaker: 'Jackson' | 'Eliza' | 'Carlos' | 'Narrador';
  text: string;
  avatar: 'jackson' | 'eliza' | 'carlos' | 'heart' | 'plane';
  emotion?: 'happy' | 'determined' | 'smug' | 'romantic' | 'surprised';
}

export interface CharacterInfo {
  name: string;
  role: string;
  details: string[];
  avatarBg: string;
  avatarType: 'jackson' | 'eliza' | 'carlos';
}

export interface PlayerState {
  hearts: number; // Max 3
  maxHearts: number;
  score: number;
  isInvulnerable: boolean;
}

export interface BossState {
  hp: number; // Max 100
  maxHp: number;
  name: string;
  status: 'idle' | 'summoning' | 'vulnerable' | 'defeated';
}
