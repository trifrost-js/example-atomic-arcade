import { type Router } from '~/types';
import { SnakeGame } from './Game';

export function SnakeRouter<State extends {}>(r: Router<State>) {
  r.get('/', (ctx) => ctx.html(<SnakeGame />));
}
