import { css, CFG } from '~/css';
import { Script } from '~/script';

export function Paddle() {
  const cls = css.use({
    position: 'absolute',
    bottom: CFG.SIZE / 2 + 'px',
    height: `${CFG.SIZE / 2}px`,
    background: css.$t.board_fg,
    borderRadius: css.$v.radius,
    transition: 'left 100ms linear',
  });

  return (
    <div className={cls}>
      <Script>
        {({ el, $ }) => {
          const DIM = Number($.cssVar('boardSize'));
          const COLS = Number($.cssVar('breakoutBoardCols'));
          const ROWS = Number($.cssVar('breakoutBoardRows'));

          let pos_span = 6;
          let snapCols: number[] = [];
          let pos_index = 0;

          function updateSnapPoints() {
            const step = 3;
            const maxCol = COLS - pos_span;
            snapCols = [];

            for (let i = 0; i <= maxCol; i += step) {
              snapCols.push(i);
            }

            if (snapCols[snapCols.length - 1] !== maxCol) {
              snapCols.push(maxCol);
            }

            pos_index = Math.floor(snapCols.length / 2);
          }

          function render() {
            const col = snapCols[pos_index];
            el.style.left = `${col * DIM}px`;
            el.style.width = `${pos_span * DIM}px`;
          }

          function move(dir: -1 | 1) {
            pos_index = Math.max(
              0,
              Math.min(snapCols.length - 1, pos_index + dir)
            );
            render();
          }

          $.on(document, 'keydown', (e) => {
            if (e.key === 'ArrowLeft') move(-1);
            else if (e.key === 'ArrowRight') move(1);
          });

          el.$subscribe('breakout:evt:paddle:pos', ({ respond }) => {
            const col = snapCols[pos_index];
            respond({
              x: col * DIM,
              y: (ROWS - 1) * DIM,
              w: DIM * pos_span,
              h: DIM,
              xc: col * DIM + DIM / 2,
            });
          });

          el.$subscribe('game:evt:boot', () => {
            pos_span = { beginner: 8, intermediate: 6, expert: 6 }[
              $.storeGet('gameConfig').difficulty
            ];
            updateSnapPoints();
            render();
          });

          el.$subscribe('breakout:start', () => {
            updateSnapPoints();
            render();
          });
        }}
      </Script>
    </div>
  );
}
