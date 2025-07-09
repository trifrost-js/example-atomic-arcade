import { css } from '~/css';
import {type RelayEvents, Script} from '~/script';

type GameCountdownProps = {
  evtStart:keyof RelayEvents;
};

export function GameCountdown ({evtStart}:GameCountdownProps) {
  return (<div className={css({
    display: 'none',
    [css.attr('data-running')]: css.mix('f', 'fj_c', 'fa_c', 'title', {
      position: 'absolute',
      inset: 0,
      background: css.$t.overlayBg,
      color: css.$t.fg,
      fontSize: '7rem',
      pointerEvents: 'none',
      zIndex: 999,
    }),
  })}>
    <Script data={{evtStart}}>{({el,data}) => {
      let timer:number|null = null;
      let count = 3;

      function render () {
        el.textContent = String(count);
      }

      function clearTimer () {
        el.removeAttribute('data-running');
        if (timer) clearInterval(timer);
        timer = null;
      }

      function setTimer () {
        clearTimer();
        el.setAttribute('data-running', '');
        count = 3;
        render();
        timer = setInterval(() => {
          count -= 1;
          render();
          if (count === 0) {
            clearTimer();
            el.$publish(data.evtStart);
          }
        }, 1000);
      }

      el.$subscribe('game:evt:countdown', () => setTimer());

      el.$unmount = () => clearTimer();
    }}</Script>
  </div>);
}
