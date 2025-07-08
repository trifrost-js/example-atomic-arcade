export const TITLE = 'Tetris';
export const DESCRIPTION =
  'Classic puzzle video game where players manipulate falling geometric shapes called Tetriminos, each made up of four squares.';

export const PREVIEW = {
  title: TITLE,
  desc: DESCRIPTION,
  source: '/tetris/',
  view: () => <img src="/tetris.jpg" />,
};

export const CFG = {
  COLS: 10 /* Board Columns */,
  ROWS: 20 /* Board Rows */,
};
