import {css, CFG} from '~/css';
import {Script} from '~/script';
import {Brick} from './Brick';
import {CFG as BREAKOUT_CFG} from '../constants';

export const LEVELS: (Array<(keyof typeof CFG.COLORS | null)[]>)[] = [
  /* Full Rows */
  [
    ['red','red','red','red','red','red','red','red'],
    ['orange','orange','orange','orange','orange','orange','orange','orange'],
    ['yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow'],
  ],
  /* Chevron */
  [
    ['pink','pink',null,null,null,null,'pink','pink'],
    [null,'pink','pink',null,null,'pink','pink',null],
    [null,null,'pink','pink','pink','pink',null,null],
    [null,null,null,'pink','pink',null,null,null],
  ],
  /* Spiral Box */
  [
    ['red','red','red','red','red','red','red','red'],
    ['red',null,null,null,null,null,null,'red'],
    ['red',null,'yellow','yellow','yellow','yellow',null,'red'],
    ['red',null,'yellow',null,null,'yellow',null,'red'],
    ['red',null,'yellow','yellow','yellow','yellow',null,'red'],
    ['red',null,null,null,null,null,null,'red'],
    ['red','red','red','red','red','red','red','red'],
  ],
  /* Pyramid */
  [
    [null,null,null,'cyan','cyan',null,null,null],
    [null,null,'green','green','green','green',null,null],
    [null,'yellow','yellow','yellow','yellow','yellow','yellow',null],
    ['orange','orange','orange','orange','orange','orange','orange','orange'],
  ],
  /* Offset Stripes */
  [
    ['red','red','red','red','red','red','red','red'],
    [null,null,'purple','purple','purple','purple',null,null],
    ['cyan',null,'cyan',null,'cyan',null,'cyan',null],
  ],
  /* Hollow Box */
  [
    ['green','green','green','green','green','green','green','green'],
    ['green',null,null,null,null,null,null,'green'],
    ['green',null,null,null,null,null,null,'green'],
    ['green','green','green','green','green','green','green','green'],
  ],
  /* Wave */
  [
    ['pink',null,null,null,null,null,null,'pink'],
    [null,'pink',null,null,null,null,'pink',null],
    [null,null,'pink',null,null,'pink',null,null],
    [null,null,null,'pink','pink',null,null,null],
    [null,null,'pink',null,null,'pink',null,null],
    [null,'pink',null,null,null,null,'pink',null],
    ['pink',null,null,null,null,null,null,'pink'],
  ],
  /* Checkerboard Chaos */
  [
    ['yellow',null,'red',null,'purple',null,'cyan',null],
    [null,'cyan',null,'green',null,'orange',null,'pink'],
    ['yellow',null,'red',null,'purple',null,'cyan',null],
    [null,'cyan',null,'green',null,'orange',null,'pink'],
  ],
];

export function Board() {
  const level = LEVELS[Math.floor(Math.random() * LEVELS.length)];

  const bricks = [];
  for (let r = 0; r < level.length; r++) {
    for (let c = 0; c < level[r].length; c++) {
      const type = level[r][c];
      if (!type) continue;
      bricks.push(<Brick row={r} col={c * 2} type={type} />);
    }
  }

  const base = css.use({
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${BREAKOUT_CFG.COLS * CFG.SIZE}px`,
    height: `${BREAKOUT_CFG.ROWS * CFG.SIZE}px`,
  });

  return (
    <div className={base}>
      {bricks}
      <Script data={{count: bricks.length}}>
        {({el, data}) => {
          let remaining = data.count;
          let loop:number|null = null;
          let isPaused = false;
          const speed = 6000;

          /**
           * Stop internal timer
           */
          function stop () {
            if (loop) clearInterval(loop);
            loop = null;
          }

          /**
           * Start internal timer
           */
          function start () {
            stop();
            isPaused = false;
            loop = setInterval(() => {
              if (!isPaused) el.$publish('breakout:evt:brick:shift');
            }, speed);
          }

/**
 * MARK: Listeners
 */

          el.$subscribe('breakout:start', () => start());

          el.$subscribe('breakout:evt:brick:cleared', () => {
            remaining--;
            if (remaining <= 0) el.$publish('breakout:cleared');
          });

          el.$subscribe('breakout:pause', () => {
            isPaused = !isPaused;
          });

          el.$subscribe('breakout:gameover', () => stop());

/**
 * MARK: Init
 */

          el.$unmount = () => clearInterval(loop);

          start();
        }}
      </Script>
    </div>
  );
}
