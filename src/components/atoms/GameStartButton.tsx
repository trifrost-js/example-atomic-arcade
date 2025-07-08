import { css } from '~/css';
import { Script, type RelayEvents } from '~/script';

type GameStartButtonOptions = {
  timer: number;
  eventStart: keyof RelayEvents;
  eventOver: keyof RelayEvents;
  style?: Record<string, unknown>;
};

export function GameStartButton(data: GameStartButtonOptions) {
  return (
    <button type="button" className={css.use('button', {
      width: '100%',
      [css.attr('data-hidden')]: {
        visibility: 'hidden',
        pointerEvents: 'none',
        cursor: 'none',
      },
    }, data.style || {})}>
      Start Now (<span>{data.timer}</span>s)
      <Script data={data}>
        {({ el, data, $ }) => {
          const counter = $.query(el, 'span')!;

          /* Start interval of 1s */
          let int: number | null = null;

          function clearTimer() {
            if (int) {
              clearInterval(int);
              int = null;
            }
          }

          function setTimer() {
            clearTimer();
            setInterval(() => data.$set('timer', data.timer - 1), 1000);
          }

          function start() {
            el.$publish(data.eventStart);
            clearTimer();
            counter.style.display = 'none';
          }

          /* Watch timer prop to start */
          data.$watch('timer', (v) => {
            if (v === 0) start();
            else counter.textContent = v;
          });

          /* Click start */
          $.on(el, 'click', start);

          /* On game over, enable our button again */
          el.$subscribe(data.eventOver, () => {
            $.clear(el);
            el.textContent = 'Play again?';
          });

          /* On game start, hide element */
          el.$subscribe(data.eventStart, () => (el.setAttribute('data-hidden', '')));

          /* Start the clock on game boot */
          el.$subscribeOnce('game:evt:boot', setTimer);

          /* On unmount clear interval */
          el.$unmount = () => clearTimer();
        }}
      </Script>
    </button>
  );
}
