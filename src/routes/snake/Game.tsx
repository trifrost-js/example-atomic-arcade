/**
 * This is a runtime-fragment-powered Tetris game, designed as an Atomic demo for TriFrost.
 * Game logic is coordinated through pub/sub events, with dynamic fragment injection for blocks and effects.
 */

import { css, CFG } from '~/css';
import { ModalClose } from '~/components/modules/Modal';
import { DESCRIPTION, PREVIEW, CFG as SNAKE_CFG, TITLE } from './constants';
import { Game } from '~/components/atoms/Game';
import { GameConfig } from '~/components/atoms/GameConfig';
import { GameExplanation } from '~/components/atoms/GameExplanation';
import { GameSidebar } from '~/components/atoms/GameSidebar';
import { KeyArrowsAll } from '~/components/atoms/Keys';
import { Script } from '~/script';

/* Defines all event types the Snake game will use. */
export type SnakeGameEvents = {
  'snake:start': void;
  'snake:pause': void;
  'snake:gameover': void;
  'snake:evt:move': 'up' | 'down';
};

export function SnakeGame() {
  return (
    <div
      className={css.use('f', 'fh', 'fj_sb', 'panel', {
        width: `${SNAKE_CFG.COLS * CFG.SIZE + 400}px`,
        height: `${SNAKE_CFG.ROWS * CFG.SIZE + 40}px`,
        position: 'relative',
        padding: css.$v.spaceL,
      })}
    >
      <GameConfig preview={PREVIEW} />
      <GameSidebar evtStart="snake:start" evtEnd="snake:gameover" width={30}>
        <GameExplanation
          title={TITLE}
          description={DESCRIPTION}
          keybindings={[
            {
              lbl: 'Arrow keys',
              description: 'move your snake',
              key: <KeyArrowsAll />,
            },
          ]}
          sources={[
            {
              lbl: 'FXs source',
              url: 'https://pixabay.com/users/soundreality-31074404/',
            },
            {
              lbl: 'Track Source',
              url: 'https://pixabay.com/music/upbeat-level-iii-294428/',
            },
          ]}
        />
      </GameSidebar>
      <Game
        columns={SNAKE_CFG.COLS}
        rows={SNAKE_CFG.ROWS}
        evtStart={'snake:start'}
        evtPause={'snake:pause'}
        evtOver={'snake:gameover'}
        sound={{
          track: ['snaketrack.mp3', 'breakout2.mp3'],
          fx: {
            pong1: 'snake1.mp3',
            pong2: 'snake2.mp3',
            pong3: 'snake3.mp3',
          },
        }}
      >
        <Script>
          {({ el }) => {
            console.log('TODO');
          }}
        </Script>
      </Game>
      <ModalClose type="cross" />
    </div>
  );
}
