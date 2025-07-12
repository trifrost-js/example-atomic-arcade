import {css} from "~/css";
import {Script} from "~/script";

type ModalCloseOptions = {
  style?:Record<string, unknown>;
  label?:string;
  type?: 'full' | 'cross',
}

export function ModalClose ({label,style,type="full"}:ModalCloseOptions) {
  const buttonStyles = css.mix(css.defs.button({style: 'standard'}), style || {});

  switch (type) {
    case 'full':
      return <button type="button" className={css(buttonStyles)}>
        {label || 'Close'}
        <Script>{({el, $}) => {
          $.on(el, 'click', () => $.modal.close());
        }}</Script>
      </button>;
    case 'cross':
      return <button type="button" className={css.use(buttonStyles, {
        padding: css.$v.spaceS,
        position: 'absolute',
        top: '-5rem',
        right: '-5rem',
      })}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
          <rect width="48" height="8" x="0" y="0" fill="currentColor" rx="5" transform="translate(9 5) rotate(45 0 0)"/>
          <rect width="48" height="8" x="0" y="0" fill="currentColor" rx="5" transform="translate(3 39) rotate(-45 0 0)" />
        </svg>
        <Script>{({el, $}) => {
          $.on(el, 'click', () => $.modal.close());
        }}</Script>
      </button>;
  }
}
