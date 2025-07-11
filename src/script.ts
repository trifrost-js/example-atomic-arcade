import { createScript } from '@trifrost/core';
import { type Env } from './types';
import { css } from './css';

const config = {
  atomic: true,
  css,
} as const;

export const { Module, Script, script } = createScript<typeof config, Env>(config);
