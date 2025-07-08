import { css } from '~/css';
import { Script, type RelayEvents } from '~/script';

type GameStartButtonOptions = {
  timer: number;
  eventStart: keyof RelayEvents;
  eventOver: keyof RelayEvents;
};

export function GameStartButton(data: GameStartButtonOptions) {
  return (
    <button type="button" className={css.use('button', { width: '100%' })}>
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
            el.style.display = 'inline-block';
          });

          /* On game start, hide element */
          el.$subscribe(data.eventStart, () => (el.style.display = 'none'));

          /* Start the clock on game boot */
          el.$subscribeOnce('game:evt:boot', setTimer);

          /* On unmount clear interval */
          el.$unmount = () => clearTimer();
        }}
      </Script>
    </button>
  );
}
