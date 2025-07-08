import { CFG, css } from '~/css';
import { ModalClose } from '../modules/Modal';

type GameModalOptions = {
  columns: number;
  rows: number;
  copyWidth?: number;
  children: any;
};

export function GameModal({
  columns,
  rows,
  copyWidth = 40,
  children,
}: GameModalOptions) {
  return (
    <div
      className={css.use('f', 'fh', 'fj_sb', 'panel', {
        width: `calc(${columns * CFG.SIZE}px + ${copyWidth}rem)`,
        height: `${rows * CFG.SIZE + 40}px`,
        position: 'relative',
        padding: css.$v.spaceL,
      })}
    >
      {children}
      <ModalClose type="cross" />
    </div>
  );
}
