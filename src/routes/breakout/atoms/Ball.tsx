import { css, CFG } from '~/css';
import { Script } from '~/script';

export function Ball() {
  const cls = css.use({
    position: 'absolute',
    width: `${CFG.SIZE}px`,
    height: `${CFG.SIZE}px`,
    borderRadius: '50%',
    background: css.$t.board_fg,
    willChange: 'transform',
    [css.attr('data-squish-v')]: css.animation('squishV'),
    [css.attr('data-squish-h')]: css.animation('squishH'),
  });

  return (
    <div className={cls}>
      <Script>
        {({ el, $ }) => {
          const SIZE = Number($.cssVar('boardSize'));
          const COLS = Number($.cssVar('breakoutBoardCols'));
          const ROWS = Number($.cssVar('breakoutBoardRows'));
          const WIDTH = COLS * SIZE;
          const HEIGHT = ROWS * SIZE;
          const DIFFICULTIES = {
            beginner: { baseSpeed: SIZE / 6, maxJitterDeg: 5, rampEvery: 12 },
            intermediate: {
              baseSpeed: SIZE / 5,
              maxJitterDeg: 10,
              rampEvery: 10,
            },
            expert: { baseSpeed: SIZE / 5, maxJitterDeg: 15, rampEvery: 8 },
          };

          let pos_x = 0;
          let pos_y = 0;
          let delta_x = SIZE / 5;
          let delta_y = -SIZE / 5;
          let interval: number | null = null;
          let hitCount = 0;
          let isPaused = false;
          let speedMultiplier = 1;
          const maxMultiplier = 2.5;
          let difficulty = DIFFICULTIES.beginner;

          function render() {
            el.style.left = `${pos_x}px`;
            el.style.top = `${pos_y}px`;
          }

          function jitterDirection(x: number, y: number) {
            const angle = Math.atan2(y, x);
            const mag = Math.hypot(x, y);
            const jitterRad =
              (Math.random() * 2 - 1) *
              ((difficulty.maxJitterDeg * Math.PI) / 180);
            const newAngle = angle + jitterRad;

            return {
              x: Math.cos(newAngle) * mag,
              y: Math.sin(newAngle) * mag,
            };
          }

          function reset() {
            pos_x = (COLS / 2) * SIZE - SIZE / 2;
            pos_y = (ROWS - 4) * SIZE;
            delta_x = difficulty.baseSpeed;
            delta_y = -difficulty.baseSpeed;
            hitCount = 0;
            speedMultiplier = 1;
            render();
          }

          function boxIntersect(
            ax: number,
            ay: number,
            aw: number,
            ah: number,
            bx: number,
            by: number,
            bw: number,
            bh: number
          ) {
            return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
          }

          function move() {
            pos_x += delta_x * speedMultiplier;
            pos_y += delta_y * speedMultiplier;

            /* Wall collisions */
            if (pos_x <= 0 || pos_x + SIZE >= WIDTH) {
              const jittered = jitterDirection(delta_x, delta_y);
              delta_x = -jittered.x;
              delta_y = jittered.y;
              pos_x = Math.max(0, Math.min(pos_x, WIDTH - SIZE));
              $.timedAttr(el, 'data-squish-h', { duration: 220 });
            }

            if (pos_y <= 0) {
              const jittered = jitterDirection(delta_x, delta_y);
              delta_y = -jittered.y;
              delta_x = jittered.x;
              pos_y = 0;
              $.timedAttr(el, 'data-squish-v', { duration: 220 });
            }

            /* Game over */
            if (pos_y + SIZE >= HEIGHT) {
              stop();
              el.$publish('breakout:gameover');
              return;
            }

            /* Paddle */
            el.$publish('breakout:evt:paddle:pos', {
              respond: (p) => {
                if (
                  boxIntersect(pos_x, pos_y, SIZE, SIZE, p.x, p.y, p.w, p.h)
                ) {
                  delta_y = -Math.abs(delta_y);
                  pos_y = p.y - SIZE;
                  $.timedAttr(el, 'data-squish-v', { duration: 220 });
                }
              },
            });

            /* Brick */
            const col = Math.floor((pos_x + SIZE / 2) / SIZE);
            const row = Math.floor((pos_y + SIZE / 2) / SIZE);

            let didHit = false;
            el.$publish('breakout:evt:brick:check', {
              col,
              row,
              respond: (yes) => (didHit = yes),
            });

            if (didHit) {
              const jittered = jitterDirection(delta_x, delta_y);
              delta_x = -jittered.x;
              delta_y = -jittered.y;
              pos_y += delta_y;
              $.timedAttr(el, 'data-squish-v', { duration: 220 });

              hitCount++;
              if (
                hitCount % difficulty.rampEvery === 0 &&
                speedMultiplier < maxMultiplier
              )
                speedMultiplier += 0.1;
            }

            render();
          }

          function start() {
            stop();
            interval = setInterval(() => {
              if (!isPaused) move();
            }, 16);
          }

          function stop() {
            if (interval) clearInterval(interval);
            interval = null;
          }

          /**
           * MARK: Listeners
           */

          el.$subscribe('game:evt:boot', () => {
            difficulty = DIFFICULTIES[$.storeGet('gameConfig').difficulty];
          });

          el.$subscribe('breakout:start', () => {
            reset();
            isPaused = false;
            start();
          });

          el.$subscribe('breakout:pause', () => {
            isPaused = !isPaused;
          });

          el.$subscribe('breakout:gameover', stop);
          el.$unmount = stop;
          reset();
        }}
      </Script>
    </div>
  );
}
