import { createScript } from '@trifrost/core';
import { type Env } from './types';
import { css } from './css';
import { type CanvasEvents } from './components/atoms/GameCanvas';
import { type ModalEvents } from './components/modules/Modal';
import { type TetrisGameEvents } from './routes/tetris/Game';
import { type SystemEvents } from './routes';
import { type BreakoutGameEvents } from './routes/breakout/Game';
import { type SnakeGameEvents } from './routes/snake/Game';
import { type AudioPlayerEvents } from './components/modules/AudioPlayer';
import { type GameEvents, type GameStore } from './components/atoms/Game';

export type RelayEvents = CanvasEvents &
  ModalEvents &
  GameEvents &
  TetrisGameEvents &
  BreakoutGameEvents &
  SnakeGameEvents &
  AudioPlayerEvents &
  SystemEvents;

export type StoreData = GameStore;

const config = {
  atomic: true,
  css,
} as const;

export const { Module, Script, script } = createScript<
  typeof config,
  Env,
  RelayEvents,
  StoreData
>(config);
