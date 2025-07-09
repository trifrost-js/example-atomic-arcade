/**
 * This is a runtime-fragment-powered Tetris game, designed as an Atomic demo for TriFrost.
 * Game logic is coordinated through pub/sub events, with dynamic fragment injection for blocks and effects.
 */

import { DESCRIPTION, PREVIEW, CFG as SNAKE_CFG, TITLE } from './constants';
import { Game } from '~/components/atoms/Game';
import { GameConfig } from '~/components/atoms/GameConfig';
import { GameExplanation } from '~/components/atoms/GameExplanation';
import { GameSidebar } from '~/components/atoms/GameSidebar';
import { KeyArrowsAll } from '~/components/atoms/Keys';
import { Script } from '~/script';
import { GameModal } from '~/components/atoms/GameModal';

type Dir = 'up' | 'down' | 'left' | 'right';

/* Defines all event types the Snake game will use. */
export type SnakeGameEvents = {
  'snake:start': void;
  'snake:pause': void;
  'snake:gameover': void;
  'snake:food:consume': {uid:string};
  'snake:food:spawn': {uid:string; growth: number; fn: (pos:{row: number; col: number}) => void};
};

export function SnakeGame() {
  return (<GameModal columns={SNAKE_CFG.COLS}>
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
        {({ el, $ }) => {
          const SIZE = Number($.cssVar('boardSize'));
          const COLS = Number($.cssVar('snakeBoardCols'));
          const ROWS = Number($.cssVar('snakeBoardRows'));

          let segments:[number,number][] = [];
          let dir: Dir = 'right';
          let dir_next: Dir = 'right';
          let food:{x:number; y:number;uid:string;growth:number}|null = null;
          let timer: number | null = null;
          let isPaused = false;

          function reset() {
            const midX = Math.floor(COLS / 2);
            const midY = Math.floor(ROWS / 2);
            segments = [];
            for (let i = 0; i <= 3; i++) {
              segments.push([midX - i, midY]);
            }
            dir = dir_next = 'right';
            render();
          }

          function clearTimer () {
            if (timer) clearInterval(timer);
            timer = null;
          }

          function setTimer () {
            clearTimer();
            timer = setInterval(tick, 150);
          }

          function render() {
            el.$publish('canvas:draw', {
              fn: (ctx) => {
                ctx.fillStyle = $.cssTheme('board_fg');
                ctx.strokeStyle = $.cssTheme('board_bg');
                for (const [x, y] of segments) {
                  ctx.fillRect(x * SIZE + 1, y * SIZE + 1, SIZE - 2, SIZE - 2);
                  ctx.strokeRect(x * SIZE, y * SIZE, SIZE, SIZE);
                }
              },
            });
          }

          function tick() {
            if (isPaused) return;

            dir = dir_next;

            const n_x = segments[0][0] + (dir === 'left' ? -1 : dir === 'right' ? 1 : 0);
            const n_y = segments[0][1] + (dir === 'up' ? -1 : dir === 'down' ? 1 : 0);

            if (
              (n_x < 0 || n_x >= COLS || n_y < 0 || n_y >= ROWS) /* Out of bounds */
              || (segments.some(([x, y]) => x === n_x && y === n_y)) /* Hits self */
            ) {
              el.$publish('snake:gameover');
              clearTimer();
              return;
            }

            segments.unshift([n_x, n_y]);

            if (food && n_x === food.x && n_y === food.y) {
              el.$publish('snake:food:consume', {uid: food.uid});
              for (let i = 1; i < food.growth; i++) segments.unshift([n_x, n_y]);
              food = null;
              spawnFood();
            } else {
              segments.pop();
            }

            render();
          }

          async function spawnFood() {
            const res = await $.fetch<DocumentFragment>('/snake/food');
            if (!res.ok || !res.content) return;

            /* Pick random non-colliding position */
            const pos = (() => {
              let tries = 0;
              while (tries++ < 1000) {
                const col = Math.floor(Math.random() * COLS);
                const row = Math.floor(Math.random() * ROWS);
                if (!segments.some(([x, y]) => x === col && y === row)) return { col, row };
              }
              return { col: 0, row: 0 };
            })();

            /* Listen for spawn metadata */
            el.$subscribeOnce('snake:food:spawn', ({uid, growth, fn}) => {
              food = {x: pos.col, y: pos.row, uid, growth };
              fn(pos);
            });

            el.appendChild(res.content);
          }

/**
 * MARK: Pub/sub
 */

          el.$subscribe('snake:start', () => {
            isPaused = false;
            reset();
            spawnFood();
            setTimer();
          });
          el.$subscribe('snake:pause', () => isPaused = !isPaused);
          el.$subscribe('snake:gameover', () => clearTimer());

          /* Key handler */
          const keyboardListener = $.on(document, 'keydown', (e) => {
            if (isPaused) return;
            switch (e.key) {
              case 'ArrowUp': return dir_next = dir !== 'down' ? 'up' : dir;
              case 'ArrowDown': return dir_next = dir !== 'up' ? 'down' : dir;
              case 'ArrowLeft': return dir_next = dir !== 'right' ? 'left' : dir;
              case 'ArrowRight': return dir_next = dir !== 'left' ? 'right' : dir;
            }
          });

          el.$unmount = () => {
            clearTimer();
            keyboardListener();
          };
        }}
      </Script>
    </Game>
  </GameModal>);
}
