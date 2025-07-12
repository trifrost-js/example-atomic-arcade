import { css } from '~/css';
import { Script } from '~/script';

type CanvasEvents = {
  'canvas:draw': { fn?: (ctx: CanvasRenderingContext2D) => void };
};

declare global {
  interface AtomicRelay extends CanvasEvents {}
}

type CanvasOptions = {
  columns: number;
  rows: number;
  size: number;
};

export function GameCanvas({ columns, rows, size }: CanvasOptions) {
  const cls = css({
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    backgroundColor: 'transparent',
  });

  return (
    <canvas width={columns * size} height={rows * size} className={cls}>
      <Script data={{ columns, rows, size }}>
        {({ el, data, $ }) => {
          const self = el as unknown as HTMLCanvasElement;
          const CTX = (self as unknown as HTMLCanvasElement).getContext('2d')!;
          const BOARD_SIZE = Number($.cssVar('boardSize'));
          const BOARD_GRID = $.cssTheme('board_grid');

          /* Prepare the canvas */
          const DPR = window.devicePixelRatio || 1;

          self.width = data.columns * data.size * DPR;
          self.height = data.rows * data.size * DPR;
          self.style.width = `${data.columns * data.size}px`;
          self.style.height = `${data.rows * data.size}px`;

          CTX.scale(DPR, DPR);
          CTX.imageSmoothingEnabled = false;

          /* Subscribe to drawing */
          el.$subscribe('canvas:draw', (opts = {}) => {
            /* Clear */
            CTX.clearRect(0, 0, self.width, self.height);

            /* Draw Grid */
            for (let y = 0; y < data.rows; y++) {
              CTX.fillStyle = BOARD_GRID;
              CTX.fillRect(0, y * BOARD_SIZE, self.width, 1);
              for (let x = 0; x < data.columns; x++) {
                CTX.fillStyle = BOARD_GRID;
                CTX.fillRect(x * BOARD_SIZE, y, 1, self.height);
              }
            }

            CTX.fillStyle = BOARD_GRID;
            CTX.fillRect(0, self.height - 1, self.width - 1, 1);
            CTX.fillRect(self.width - 1, 0, 1, self.height - 1);

            /* Custom draw */
            if ($.isFn(opts.fn)) opts.fn(CTX);
          });
        }}
      </Script>
    </canvas>
  );
}
