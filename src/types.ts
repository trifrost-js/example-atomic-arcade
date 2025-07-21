import { type TriFrostContext, type TriFrostRouter } from '@trifrost/core';

export type Env = {
  /**
   * Add your environment variables here
   * @see https://www.trifrost.dev/docs/context-state-management#type-safe-context-definitions
   */
  ASSETS: Fetcher;
  TRIFROST_INGESTOR_KEY: string;
  TRIFROST_INGESTOR_CLIENT: string;
};

export type Context<State extends Record<string, unknown> = {}> =
  TriFrostContext<Env, State>;

export type Router<State extends Record<string, unknown> = {}> = TriFrostRouter<
  Env,
  State
>;
