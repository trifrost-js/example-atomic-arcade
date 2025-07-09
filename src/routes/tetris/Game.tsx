/**
 * This is a runtime-fragment-powered Tetris game, designed as an Atomic demo for TriFrost.
 * Game logic is coordinated through pub/sub events, with dynamic fragment injection for blocks and effects.
 */

import { Script } from '~/script';
import { DESCRIPTION, PREVIEW, CFG as TETRIS_CFG, TITLE } from './constants';
import { GameModal } from '~/components/atoms/GameModal';
import { Game } from '~/components/atoms/Game';
import { GameConfig } from '~/components/atoms/GameConfig';
import { GameExplanation } from '~/components/atoms/GameExplanation';
import { GameSidebar } from '~/components/atoms/GameSidebar';
import { KeyArrowsAll, KeySpacebar } from '~/components/atoms/Keys';

/* Defines all event types the Tetris game will use. */
export type TetrisGameEvents = {
  'tetris:start': void;
  'tetris:pause': void;
  'tetris:rowclearend': void;
  'tetris:gameover': void;
  'tetris:evt:move': 'left' | 'right' | 'down' | 'rotate' | 'drop';
  'tetris:evt:move_check': {
    offset: [number, number];
    shape: number[][];
    respond: (r: {
      cancel?: boolean;
      land?: boolean;
      left?: number;
      top?: number;
    }) => void;
  };
  'tetris:evt:land': { position: number[][] };
};

export function TetrisGame() {
  return (
    <GameModal columns={TETRIS_CFG.COLS} copyWidth={45}>
      <GameConfig preview={PREVIEW} />
      <GameSidebar evtStart="tetris:start" evtEnd="tetris:gameover" width={35}>
        <GameExplanation
          title={TITLE}
          description={DESCRIPTION}
          keybindings={[
            { lbl: 'Spacebar', description: 'drop', key: <KeySpacebar /> },
            {
              lbl: 'Arrow keys',
              description: 'move/rotate',
              key: <KeyArrowsAll />,
            },
          ]}
          sources={[
            {
              lbl: 'Track Source',
              url: 'https://www.zophar.net/music/gameboy-gbs/tetris',
            },
          ]}
        />
      </GameSidebar>
      <Game
        columns={TETRIS_CFG.COLS}
        rows={TETRIS_CFG.ROWS}
        evtStart={'tetris:start'}
        evtPause={'tetris:pause'}
        evtOver={'tetris:gameover'}
        sound={{
          track: ['/tetris_1.mp3', '/tetris_2.mp3', './tetris_3.mp3'],
          fx: {
            over: '/tetris_over.mp3',
            pong1: '/pong1.mp3',
            pong2: '/pong2.mp3',
            pong3: '/pong3.mp3',
            pong4: '/pong4.mp3',
          },
        }}
      >
        <Script>
          {({ el, $ }) => {
            const BOARD_COLS = Number($.cssVar('tetrisBoardCols'));
            const BOARD_ROWS = Number($.cssVar('tetrisBoardRows'));
            const BOARD_SIZE = Number($.cssVar('boardSize'));
            const BOARD_BG = $.cssTheme('board_bg');
            const BOARD_FG = $.cssTheme('board_fg');
            const DIFFICULTIES = {
              beginner: { speed_delta: 1000 },
              intermediate: { speed_delta: 750 },
              expert: { speed_delta: 500 },
            };

            let matrix = Array.from({ length: BOARD_ROWS }, () =>
              Array(BOARD_COLS).fill(0)
            );
            let difficulty = DIFFICULTIES.beginner;
            let BOARD_DELTA = difficulty.speed_delta;
            let tick: number | null = null;
            let ticks = 0;
            let isPaused = false;

            function clearFullRows() {
              const cleared = [];
              for (let y = BOARD_ROWS - 1; y >= 0; y--) {
                if (matrix[y].every((v) => v)) cleared.unshift(y);
              }
              if (!cleared.length) return;

              const top = cleared[0] * BOARD_SIZE;
              $.fetch<DocumentFragment>(
                `/tetris/rowclear?top=${top}&rows=${cleared.length}`
              ).then((res) => {
                if (res.ok && res.content) el.appendChild(res.content);
                el.$publish('audio:fx', 'pong' + cleared.length);
              });

              for (let i = cleared.length - 1; i >= 0; i--)
                matrix.splice(cleared[i], 1);
              for (let i = 0; i < cleared.length; i++)
                matrix.unshift(Array(BOARD_COLS).fill(0));

              render();
            }

            function clearTimer() {
              if (tick) clearInterval(tick);
              tick = null;
            }

            function setTimer() {
              clearTimer();
              tick = setInterval(() => {
                if (!isPaused) {
                  el.$publish('tetris:evt:move', 'down');
                  ticks++;
                  if (ticks > 60 && BOARD_DELTA > 200) {
                    BOARD_DELTA -= 50;
                    ticks = 0;
                    setTimer();
                  }
                }
              }, BOARD_DELTA);
            }

            function render() {
              el.$publish('canvas:draw', {
                fn: (ctx) => {
                  for (let y = 0; y < BOARD_ROWS; y++) {
                    for (let x = 0; x < BOARD_COLS; x++) {
                      if (matrix[y][x] === 1) {
                        ctx.fillStyle = BOARD_FG;
                        ctx.strokeStyle = BOARD_BG;
                        ctx.fillRect(
                          x * BOARD_SIZE + 1,
                          y * BOARD_SIZE + 1,
                          BOARD_SIZE - 2,
                          BOARD_SIZE - 2
                        );
                        ctx.strokeRect(
                          x * BOARD_SIZE,
                          y * BOARD_SIZE,
                          BOARD_SIZE,
                          BOARD_SIZE
                        );
                      }
                    }
                  }
                },
              });
            }

            function loadPiece() {
              $.fetch<DocumentFragment>('/tetris/piece').then((res) => {
                if (res.ok && res.content) el.appendChild(res.content);
              });
            }

            el.$subscribe('tetris:evt:land', ({ position }) => {
              for (const [col, row] of position) {
                if (
                  row >= 0 &&
                  row < BOARD_ROWS &&
                  col >= 0 &&
                  col < BOARD_COLS
                ) {
                  matrix[row][col] = 1;
                }
              }
              clearFullRows();
              render();
              loadPiece();
            });

            el.$subscribe(
              'tetris:evt:move_check',
              ({ offset, shape, respond }) => {
                const [ox, oy] = offset;
                for (let j = 0; j < shape.length; j++) {
                  for (let i = 0; i < shape[j].length; i++) {
                    if (shape[j][i] !== 1) continue;

                    const col = ox + i;
                    const row = oy + j;

                    const is_oob =
                      col < 0 || col >= BOARD_COLS || row >= BOARD_ROWS;
                    const is_col = row >= 0 && matrix[row]?.[col] === 1;

                    if (is_oob || is_col) {
                      const isLanding =
                        shape[j][i] === 1 && (row >= BOARD_ROWS || is_col);
                      respond({ cancel: !isLanding, land: isLanding });
                      return;
                    }
                  }
                }
                respond({ left: ox * BOARD_SIZE, top: oy * BOARD_SIZE });
              }
            );

            el.$subscribeOnce('game:evt:boot', () => {
              difficulty = DIFFICULTIES[$.storeGet('gameConfig').difficulty];
            });

            el.$subscribe('tetris:start', () => {
              matrix = Array.from({ length: BOARD_ROWS }, () =>
                Array(BOARD_COLS).fill(0)
              );
              BOARD_DELTA = difficulty.speed_delta;
              isPaused = false;
              render();
              loadPiece();
              setTimer();
            });

            el.$subscribe('tetris:pause', () => (isPaused = !isPaused));

            el.$subscribe('tetris:gameover', () => clearTimer());

            const keydownhandler = $.on(document, 'keydown', (e) => {
              if (isPaused || !tick) return;
              let dir: TetrisGameEvents['tetris:evt:move'] | null = null;
              switch (e.key) {
                case 'ArrowLeft':
                  dir = 'left';
                  break;
                case 'ArrowRight':
                  dir = 'right';
                  break;
                case 'ArrowDown':
                  dir = 'down';
                  break;
                case 'ArrowUp':
                  dir = 'rotate';
                  break;
                case ' ':
                  dir = 'drop';
                  break;
              }
              if (dir) el.$publish('tetris:evt:move', dir);
            });

            el.$unmount = () => {
              keydownhandler();
              clearTimer();
            };
          }}
        </Script>
      </Game>
    </GameModal>
  );
}
