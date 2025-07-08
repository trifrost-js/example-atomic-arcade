export const TITLE = 'Breakout';
export const DESCRIPTION =
  'Classic arcade game where players use a paddle to bounce a ball and break through a wall of bricks.';

export const PREVIEW = {
  title: TITLE,
  desc: DESCRIPTION,
  source: '/breakout/',
  view: () => <img src="/breakout.jpg" />,
};

export const CFG = {
  COLS: 16 /* Board Columns */,
  ROWS: 20 /* Board Rows */,
};
