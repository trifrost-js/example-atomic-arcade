/**
 * This is a runtime-fragment-powered Tetris game, designed as an Atomic demo for TriFrost.
 * Game logic is coordinated through pub/sub events, with dynamic fragment injection for blocks and effects.
 */

import { css } from '~/css';
import { Script } from '~/script';
import { CFG as BREAKOUT_CFG, DESCRIPTION, PREVIEW, TITLE } from './constants';
import { Paddle } from './atoms/Paddle';
import { Ball } from './atoms/Ball';
import { GameModal } from '~/components/atoms/GameModal';
import { Game } from '~/components/atoms/Game';
import { GameConfig } from '~/components/atoms/GameConfig';
import { GameExplanation } from '~/components/atoms/GameExplanation';
import { GameSidebar } from '~/components/atoms/GameSidebar';
import { KeyArrowsHorizontal } from '~/components/atoms/Keys';

/* Defines all event types the Breakout game will use. */
export type BreakoutGameEvents = {
  'breakout:start': void;
  'breakout:pause': void;
  'breakout:gameover': void;
  'breakout:evt:paddle:pos': {
    respond: (opts: {
      x: number;
      y: number;
      w: number;
      h: number;
      xc: number;
    }) => void;
  };
  'breakout:evt:brick:check': {
    col: number;
    row: number;
    respond: (hit: boolean) => void;
  };
  'breakout:evt:brick:cleared': void;
  'breakout:evt:brick:shift': void;
  'breakout:cleared': void;
};

export function BreakoutGame() {
  const gameBoardId = css.cid();

  return (
    <GameModal columns={BREAKOUT_CFG.COLS}>
      <GameConfig preview={PREVIEW} />
      <GameSidebar
        evtStart="breakout:start"
        evtEnd="breakout:gameover"
        width={30}
      >
        <GameExplanation
          title={TITLE}
          description={DESCRIPTION}
          keybindings={[
            {
              lbl: 'Arrow keys',
              description: 'move',
              key: <KeyArrowsHorizontal />,
            },
          ]}
          sources={[
            {
              lbl: 'Track Source',
              url: 'https://pixabay.com/music/video-games-arcade-party-173553/',
            },
          ]}
        />
      </GameSidebar>
      <Game
        columns={BREAKOUT_CFG.COLS}
        rows={BREAKOUT_CFG.ROWS}
        evtStart={'breakout:start'}
        evtPause={'breakout:pause'}
        evtOver={'breakout:gameover'}
        sound={{
          track: ['breakout.mp3', 'breakout2.mp3'],
          fx: {
            pong1: 'pong5.mp3',
            pong2: 'pong2.mp3',
            pong3: 'pong4.mp3',
            pong4: 'pong3.mp3',
            cleared: 'cleared.mp3',
          },
        }}
      >
        <div id={gameBoardId} />
        <Paddle />
        <Ball />
        <Script data={{ gameBoardId }}>
          {({ el, data, $ }) => {
            const board = $.query<HTMLDivElement>(el, `#${data.gameBoardId}`)!;

            async function loadBoard() {
              const res = await $.fetch<DocumentFragment>('/breakout/board');
              if (res.ok && res.content) board.replaceChildren(res.content);
            }

            el.$subscribe('breakout:start', () => loadBoard());

            el.$subscribe('breakout:cleared', () => {
              loadBoard();
              el.$publish('audio:fx', 'cleared');
            });
          }}
        </Script>
      </Game>
    </GameModal>
  );
}
