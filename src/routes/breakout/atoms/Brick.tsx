import { css, CFG } from '~/css';
import { Script } from '~/script';

export function Brick({
  row,
  col,
  type,
}: {
  row: number;
  col: number;
  type: keyof typeof CFG.COLORS;
}) {
  const cls = css.use({
    position: 'absolute',
    width: `${CFG.SIZE * 2}px`,
    height: `${CFG.SIZE}px`,
    background: CFG.COLORS[type],
    top: `${row * CFG.SIZE}px`,
    left: `${col * CFG.SIZE}px`,
    border: `1px solid ${css.$t.board_bg}`,
    [css.attr('data-destroying')]: css.animation('flash', {
      duration: '200ms',
    }),
  });

  return (
    <div className={cls}>
      <Script data={{ row, col }}>
        {({ el, data, $ }) => {
          const DIM = Number($.cssVar('boardSize'));
          const ROWS = Number($.cssVar('breakoutBoardRows'));
          let transient = false;
          let gameOver = false;

          el.$subscribe('breakout:evt:brick:check', ({ col, row, respond }) => {
            const hit =
              !transient &&
              row === data.row &&
              (col === data.col || col === data.col + 1);

            if (hit) {
              respond(true);
              transient = true;
              el.$publish('breakout:evt:brick:cleared');
              el.$publish('audio:fx', 'pong' + Math.ceil(Math.random() * 4));
              $.timedAttr(el, 'data-destroying', {
                duration: 200,
                after: () => el?.remove(),
              });
            }
          });

          el.$subscribe('breakout:evt:brick:shift', () => {
            if (gameOver) return;

            data.row += 1;
            el.style.top = `${data.row * DIM}px`;
            if (data.row >= ROWS - 1) el.$publish('breakout:gameover');
          });

          el.$subscribe('breakout:gameover', () => {
            gameOver = true;
          });
        }}
      </Script>
    </div>
  );
}
