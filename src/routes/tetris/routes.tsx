import { TetrisGame } from './Game';
import { RandomPiece } from './atoms/Pieces';
import { type Router } from '~/types';
import { RowClear } from './atoms/RowClear';

export function TetrisRouter<State extends {}>(r: Router<State>) {
  r.get('/', (ctx) => ctx.html(<TetrisGame />))
    .get('/piece', (ctx) => ctx.html(<RandomPiece />))
    .get('/rowclear', (ctx) => {
      const top = Number(ctx.query.get('top') || 0);
      const rows = Number(ctx.query.get('rows') || 0);
      return ctx.html(<RowClear top={top} rows={rows} />);
    });
}
