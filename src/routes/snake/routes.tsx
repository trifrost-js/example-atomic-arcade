import { type Router } from '~/types';
import { SnakeGame } from './Game';
import { Food } from './atoms/Food';

export function SnakeRouter<State extends {}>(r: Router<State>) {
  r
    .get('/', ctx => ctx.html(<SnakeGame />))
    .get('/food', ctx => ctx.html(<Food />));
}
