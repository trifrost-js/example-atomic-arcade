/**
 * Snake game powered by TriFrost Atomic fragment system.
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
  'snake:food:consume': { uid: string };
  'snake:food:spawn': {
    uid: string;
    growth: number;
    fn: (pos: { row: number; col: number }) => void;
  };
};

export function SnakeGame() {
  return (
    <GameModal columns={SNAKE_CFG.COLS}>
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
            const DIM = Number($.cssVar('boardSize'));
            const COL = Number($.cssVar('snakeBoardCols'));
            const ROW = Number($.cssVar('snakeBoardRows'));
            const RAD = 8;
            const DIFFICULTIES = {
              beginner: { speed_delta: 175 },
              intermediate: { speed_delta: 150 },
              expert: { speed_delta: 125 },
            };

            let difficulty = DIFFICULTIES.beginner;
            let board_delta = difficulty.speed_delta;
            let segments: [number, number][] = [];
            let dir: Dir = 'right';
            let dir_next: Dir = 'right';
            let food: {
              x: number;
              y: number;
              uid: string;
              growth: number;
            } | null = null;
            let food_consumed = 0;
            let timer: number | null = null;
            let isPaused = false;
            let newSegments = 0;
            let newSegmentTimer: number | null = null;

            function reset() {
              const midX = Math.floor(COL / 2);
              const midY = Math.floor(ROW / 2);
              segments = [];
              for (let i = 0; i <= 3; i++) {
                segments.push([midX - i, midY]);
              }
              dir = dir_next = 'right';
              food_consumed = 0;
              board_delta = difficulty.speed_delta;
              clearTimer();
              clearSegmentTimer();
              render();
            }

            function clearTimer() {
              if (timer) clearInterval(timer);
              timer = null;
            }

            function clearSegmentTimer() {
              if (newSegmentTimer) clearInterval(newSegmentTimer);
              newSegmentTimer = null;
            }

            function setTimer() {
              clearTimer();
              timer = setInterval(tick, board_delta);
            }

            function setSegmentTimer() {
              clearSegmentTimer();
              newSegmentTimer = setInterval(() => {
                newSegments--;
                if (newSegments <= 0 && newSegmentTimer) clearSegmentTimer();
                render();
              }, 200);
            }

            function render() {
              el.$publish('canvas:draw', {
                fn: (ctx) => {
                  ctx.fillStyle = $.cssTheme('board_fg');
                  ctx.strokeStyle = $.cssTheme('board_bg');

                  segments.forEach(([x, y], i) => {
                    const PX = x * DIM;
                    const PY = y * DIM;

                    ctx.save();
                    /* If new */
                    if (i >= segments.length - newSegments) {
                      ctx.globalAlpha = 0.5;
                      ctx.fillRect(PX + 4, PY + 4, DIM - 8, DIM - 8);
                    } else if (i !== 0) {
                      ctx.beginPath();
                      ctx.moveTo(PX + RAD, PY);
                      ctx.lineTo(PX + DIM - RAD, PY);
                      ctx.quadraticCurveTo(PX + DIM, PY, PX + DIM, PY + RAD);
                      ctx.lineTo(PX + DIM, PY + DIM - RAD);
                      ctx.quadraticCurveTo(
                        PX + DIM,
                        PY + DIM,
                        PX + DIM - RAD,
                        PY + DIM
                      );
                      ctx.lineTo(PX + RAD, PY + DIM);
                      ctx.quadraticCurveTo(PX, PY + DIM, PX, PY + DIM - RAD);
                      ctx.lineTo(PX, PY + RAD);
                      ctx.quadraticCurveTo(PX, PY, PX + RAD, PY);
                      ctx.closePath();
                      ctx.fill();
                      ctx.stroke();
                    } else {
                      ctx.globalAlpha = 1;
                      ctx.fillRect(PX + 1, PY + 1, DIM - 2, DIM - 2);
                      ctx.strokeRect(PX, PY, DIM, DIM);
                    }
                    ctx.restore();
                  });
                },
              });
            }

            function tick() {
              if (isPaused) return;

              dir = dir_next;

              const n_x =
                segments[0][0] +
                (dir === 'left' ? -1 : dir === 'right' ? 1 : 0);
              const n_y =
                segments[0][1] + (dir === 'up' ? -1 : dir === 'down' ? 1 : 0);

              if (
                n_x < 0 ||
                n_x >= COL ||
                n_y < 0 ||
                n_y >= ROW ||
                segments.some(([x, y]) => x === n_x && y === n_y)
              ) {
                el.$publish('snake:gameover');
                clearTimer();
                return;
              }

              segments.unshift([n_x, n_y]);

              if (food && n_x === food.x && n_y === food.y) {
                el.$publish('snake:food:consume', { uid: food.uid });
                for (let i = 1; i < food.growth; i++) {
                  segments.unshift([n_x, n_y]);
                }
                newSegments = food.growth;
                setSegmentTimer();
                food = null;
                food_consumed++;
                if (food_consumed > 60 && board_delta > 75) {
                  board_delta -= 5;
                  food_consumed = 0;
                  setTimer();
                }
                spawnFood();
              } else {
                segments.pop();
              }

              render();
            }

            async function spawnFood() {
              const res = await $.fetch<DocumentFragment>('/snake/food');
              if (!res.ok || !res.content) return;

              const pos = (() => {
                let tries = 0;
                while (tries++ < 1000) {
                  const col = Math.floor(Math.random() * COL);
                  const row = Math.floor(Math.random() * ROW);
                  if (!segments.some(([x, y]) => x === col && y === row))
                    return { col, row };
                }
                return { col: 0, row: 0 };
              })();

              el.$subscribeOnce('snake:food:spawn', ({ uid, growth, fn }) => {
                food = { x: pos.col, y: pos.row, uid, growth };
                fn(pos);
              });

              el.appendChild(res.content);
            }

            el.$subscribeOnce('game:evt:boot', () => {
              difficulty = DIFFICULTIES[$.storeGet('gameConfig').difficulty];
            });

            el.$subscribe('snake:start', () => {
              isPaused = false;
              reset();
              spawnFood();
              setTimer();
            });
            el.$subscribe('snake:pause', () => (isPaused = !isPaused));
            el.$subscribe('snake:gameover', () => {
              clearTimer();
              clearSegmentTimer();
            });

            const keyboardListener = $.on(document, 'keydown', (e) => {
              if (isPaused) return;
              switch (e.key) {
                case 'ArrowUp':
                  return (dir_next = dir !== 'down' ? 'up' : dir);
                case 'ArrowDown':
                  return (dir_next = dir !== 'up' ? 'down' : dir);
                case 'ArrowLeft':
                  return (dir_next = dir !== 'right' ? 'left' : dir);
                case 'ArrowRight':
                  return (dir_next = dir !== 'left' ? 'right' : dir);
              }
            });

            el.$unmount = () => {
              clearTimer();
              clearSegmentTimer();
              keyboardListener();
            };
          }}
        </Script>
      </Game>
    </GameModal>
  );
}
