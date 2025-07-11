import {css} from "~/css";
import {Module, Script} from "~/script";

type ModalEvents = {
  'modal:open': {frag:string};
  'modal:replace': {frag:string};
  'modal:close': void;
};

declare global {
  interface AtomicRelay extends ModalEvents {}
}

export function Modal () {
  const cls = css.use('f', 'fv', 'fa_c', 'fj_c', {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: css.$t.overlayBg,
    zIndex: 10,
  });

  return <Module name="modal" data={{cls}}>{({mod, data, $}) => {
    let root:HTMLDivElement|null = null;
    let key_handler:(()=>void)|null = null;

    function open (val:DocumentFragment) {
      clear();

      /* Create modal */
      root = $.create('div', {
        attrs: {class: data.cls},
        children: [
          $.create('div', {children: [val]}),
        ],
      });
      document.body.appendChild(root);

      /* Listen for keyboard events */
      key_handler = $.on(document, 'keydown', (e) => {
          if (e.key !== 'Escape') return;
          clear();
      });
    }

    function clear () {
      /* Clear any open root */
      if (root) root.remove();
      root = null;

      /* Unmount listener */
      if (key_handler) key_handler();
      key_handler = null;
    }

    /* Listen for modal open */
    mod.$subscribe('modal:open', async ({frag}) => {
      if (root) root.remove();

      const res = await $.fetch<DocumentFragment>(frag);
      if (res.ok && res.content) open(res.content);
    });

    /* Listen for modal close event */
    mod.$subscribe('modal:close', () => clear());
  }}</Module>;
}

/**
 * MARK: Close
 */

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
          $.on(el, 'click', () => el.$publish('modal:close'));
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
          $.on(el, 'click', () => el.$publish('modal:close'));
        }}</Script>
      </button>;
  }
}
