export const TITLE = 'Snake';
export const DESCRIPTION =
  'Classic arcade game where you control a growing snake, collecting food while avoiding collisions with walls or your own tail.';

export const PREVIEW = {
  title: TITLE,
  desc: DESCRIPTION,
  source: '/snake/',
  view: () => <img src="/snake.jpg" />,
};

export const CFG = {
  COLS: 20 /* Board Columns */,
  ROWS: 20 /* Board Rows */,
};
