import { Script } from '~/script';
import { css, CFG } from '~/css';

type BlockOptions = {
  shape: string;
  color: string;
  matrix: number[][][];
};

export function Block({ color, matrix }: BlockOptions) {
  const x = 4;
  const y = 0;

  const cls = css({
    position: 'absolute',
    left: `${x * CFG.SIZE}px`,
    width: `${CFG.SIZE * 4}px`,
    height: `${CFG.SIZE * 4}px`,
    pointerEvents: 'none',
    div: {
      position: 'absolute',
      width: `${CFG.SIZE}px`,
      height: `${CFG.SIZE}px`,
      background: color,
      border: '1px solid ' + css.$t.board_bg,
    },
  });

  return (
    <div className={cls}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div data-index={i} />
      ))}
      <Script data={{ x, y, matrix, color }}>
        {({ el, data, $ }) => {
          let { x, y } = data;
          const { matrix } = data;
          let matrix_idx = 0;
          let isFirstCheck = true;
          const CELLS = $.queryAll(el, '[data-index]');
          const WIDTH = Number($.cssVar('boardSize'));

          function positions(shape: number[][]): [number, number][] {
            const acc: [number, number][] = [];
            for (let y = 0; y < shape.length; y++) {
              for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 1) acc.push([x, y]);
              }
            }

            return acc;
          }

          function checkGameOver(land: boolean | undefined) {
            if (!isFirstCheck) return false;
            isFirstCheck = false;
            if (!land) return false;

            el.$publish('tetris:gameover');
            el.remove();
            return true;
          }

          function render(shape: number[][]) {
            const n_pos = positions(shape);

            for (let i = 0; i < CELLS.length; i++) {
              if (n_pos[i]) {
                const [dx, dy] = n_pos[i];
                CELLS[i].style.display = 'block';
                CELLS[i].style.left = `${dx * WIDTH}px`;
                CELLS[i].style.top = `${dy * WIDTH}px`;
              } else {
                CELLS[i].style.display = 'none';
              }
            }
          }

          function attemptMove({
            x: nx,
            y: ny,
            shape,
            fn,
          }: {
            x: number;
            y: number;
            shape: number[][];
            fn: (...args: any[]) => void;
          }) {
            el.$publish('tetris:evt:move_check', {
              offset: [nx, ny],
              shape: shape,
              respond: ({ cancel, land, left, top }) => {
                if (checkGameOver(land)) return;
                if (cancel) return;

                if (left !== undefined) el.style.left = `${left}px`;
                if (top !== undefined) el.style.top = `${top}px`;

                if (land) {
                  const cells: number[][] = positions(shape).map(([dx, dy]) => [
                    x + dx,
                    y + dy,
                  ]);
                  el.$publish('tetris:evt:land', { position: cells });
                  el.remove();
                } else {
                  fn?.({ x: nx, y: ny });
                }
              },
            });
          }

          function move(dir: 'left' | 'right' | 'down') {
            const dx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
            const dy = dir === 'down' ? 1 : 0;

            attemptMove({
              x: x + dx,
              y: y + dy,
              shape: matrix[matrix_idx % matrix.length],
              fn: ({ x: nx, y: ny }: { x: number; y: number }) => {
                x = nx;
                y = ny;
              },
            });
          }

          function rotate() {
            const n_idx = (matrix_idx + 1) % data.matrix.length;
            const n_matrix = data.matrix[n_idx];

            attemptMove({
              x,
              y,
              shape: n_matrix,
              fn: () => {
                matrix_idx = n_idx;
                render(n_matrix);
              },
            });
          }

          function drop() {
            const n_matrix = matrix[matrix_idx % matrix.length];
            let ny = y;
            el.$publish('tetris:evt:move_check', {
              offset: [x, ++ny],
              shape: n_matrix,
              respond: ({ land, cancel, left, top }) => {
                if (checkGameOver(land)) return;
                if (cancel) return;
                if (left !== undefined) el.style.left = `${left}px`;
                if (top !== undefined) el.style.top = `${top}px`;
                if (land) {
                  const cells = positions(n_matrix).map(([dx, dy]) => [
                    x + dx,
                    ny + dy - 1,
                  ]);
                  el.$publish('tetris:evt:land', { position: cells });
                  el.remove();
                } else {
                  y = ny;
                  drop();
                }
              },
            });
          }

          el.$subscribe('tetris:evt:move', (dir) => {
            if (dir === 'rotate') rotate();
            else if (dir === 'drop') drop();
            else move(dir);
          });

          el.$subscribe('tetris:start', () => el.remove());

          // Initial render
          render(matrix[0]);
        }}
      </Script>
    </div>
  );
}

export const PIECES = {
  I: () => (
    <Block
      shape="I"
      color={CFG.COLORS.cyan}
      matrix={[[[1], [1], [1], [1]], [[1, 1, 1, 1]]]}
    />
  ),
  O: () => (
    <Block
      shape="O"
      color={CFG.COLORS.yellow}
      matrix={[
        [
          [1, 1],
          [1, 1],
        ],
      ]}
    />
  ),
  T: () => (
    <Block
      shape="T"
      color={CFG.COLORS.pink}
      matrix={[
        [
          [0, 1, 0],
          [1, 1, 1],
        ],
        [
          [1, 0],
          [1, 1],
          [1, 0],
        ],
        [
          [1, 1, 1],
          [0, 1, 0],
        ],
        [
          [0, 1],
          [1, 1],
          [0, 1],
        ],
      ]}
    />
  ),
  L: () => (
    <Block
      shape="L"
      color={CFG.COLORS.orange}
      matrix={[
        [
          [1, 0],
          [1, 0],
          [1, 1],
        ],
        [
          [1, 1, 1],
          [1, 0, 0],
        ],
        [
          [1, 1],
          [0, 1],
          [0, 1],
        ],
        [
          [0, 0, 1],
          [1, 1, 1],
        ],
      ]}
    />
  ),
  J: () => (
    <Block
      shape="J"
      color={CFG.COLORS.purple}
      matrix={[
        [
          [0, 1],
          [0, 1],
          [1, 1],
        ],
        [
          [1, 0, 0],
          [1, 1, 1],
        ],
        [
          [1, 1],
          [1, 0],
          [1, 0],
        ],
        [
          [1, 1, 1],
          [0, 0, 1],
        ],
      ]}
    />
  ),
  S: () => (
    <Block
      shape="S"
      color={CFG.COLORS.green}
      matrix={[
        [
          [0, 1, 1],
          [1, 1, 0],
        ],
        [
          [1, 0],
          [1, 1],
          [0, 1],
        ],
      ]}
    />
  ),
  Z: () => (
    <Block
      shape="Z"
      color={CFG.COLORS.red}
      matrix={[
        [
          [1, 1, 0],
          [0, 1, 1],
        ],
        [
          [0, 1],
          [1, 1],
          [1, 0],
        ],
      ]}
    />
  ),
} as const;

export function RandomPiece() {
  const keys = Object.keys(PIECES);
  const shape = keys[
    Math.floor(Math.random() * keys.length)
  ] as keyof typeof PIECES;
  return PIECES[shape]();
}
