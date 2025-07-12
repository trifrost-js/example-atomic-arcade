import { createScript, createModule } from '@trifrost/core';
import { type Env } from './types';
import { css } from './css';
import { Modal } from './components/modules/Modal';
import { AudioPlayer } from './components/modules/AudioPlayer';

export const { Module } = createModule({css});

const config = {
  atomic: true,
  css,
  modules: {
    modal: Modal,
    audio: AudioPlayer,
  },
} as const;

export const { Script, script } = createScript<typeof config, Env>(config);
