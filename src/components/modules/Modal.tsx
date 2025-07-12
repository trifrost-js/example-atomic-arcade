import {css} from "~/css";
import {Module} from "~/script";

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

  return Module({
    name: "modal",
    data: {cls},
    mod: ({data, $}) => {
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

      return {
        close: () => clear(),
        open: async ({frag}:{frag:string}) => {
          if (root) root.remove();

          const res = await $.fetch<DocumentFragment>(frag);
          if (res.ok && res.content) open(res.content);
        },
      };
    },
  });
}
