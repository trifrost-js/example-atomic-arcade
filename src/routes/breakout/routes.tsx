import { type Router } from '~/types';
import { BreakoutGame } from './Game';
import { Board } from './atoms/Board';

export function BreakoutRouter<State extends {}>(r: Router<State>) {
  r.get('/', (ctx) => ctx.html(<BreakoutGame />)).get('/board', (ctx) =>
    ctx.html(<Board />)
  );
}
