import { Script } from "~/script";
import { css } from "~/css";

function Cherry() {
  return (
    <>
      {/* Left cherry */}
      <circle cx="6" cy="18" r="3" fill="#ff5b5b" />
      <circle cx="6" cy="18" r="2" fill="#c33a3a" />

      {/* Right cherry */}
      <circle cx="18" cy="18" r="3" fill="#ff5b5b" />
      <circle cx="18" cy="18" r="2" fill="#c33a3a" />

      {/* Stems */}
      <path
        d="M6 15 C10 10, 12 10, 12 10"
        stroke="#3bcc3b"
        stroke-width="1"
        fill="none"
      />
      <path
        d="M18 15 C14 10, 12 10, 12 10"
        stroke="#3bcc3b"
        stroke-width="1"
        fill="none"
      />

      {/* Gloss */}
      <circle cx="5" cy="17" r="0.5" fill="#fff8d1" />
      <circle cx="17" cy="17" r="0.5" fill="#fff8d1" />
    </>
  );
}

function Banana() {
  return (
    <>
      <path
        d="M4 20 C10 10, 20 8, 22 4"
        fill="none"
        stroke="#ffeb7a"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M4 20 C10 10, 20 8, 22 4"
        fill="none"
        stroke="#d8b945"
        stroke-width="1"
      />
      <circle cx="4" cy="20" r="1" fill="#fff8d1" />
      <circle cx="22" cy="4" r="1" fill="#c49b41" />
    </>
  );
}

function Apple() {
  return (
    <>
      {/* Body */}
      <circle cx="12" cy="14" r="6.5" fill="#ff5b5b" />
      <circle cx="12" cy="14" r="5.5" fill="#c33a3a" />

      {/* Stem */}
      <rect x="11.5" y="6" width="1" height="3" fill="#3bcc3b" />

      {/* Gloss */}
      <circle cx="10" cy="12" r="1" fill="#fff8d1" />
    </>
  );
}

function Orange() {
  return (
    <>
      <circle cx="12.5" cy="12.5" r="9" fill="#ffcb6b" />
      <circle cx="12.5" cy="12.5" r="7" fill="#c49b41" />
      <circle cx="10" cy="10" r="1.5" fill="#fff8d1" />
    </>
  );
}

function Lime() {
  return (
    <>
      <circle cx="12.5" cy="12.5" r="9" fill="#78ff78" />
      <circle cx="12.5" cy="12.5" r="7" fill="#3bcc3b" />
      <path
        d="M12.5 4 L12.5 21 M4 12.5 L21 12.5"
        stroke="#3bcc3b"
        stroke-width="0.75"
      />
    </>
  );
}

function GoldenApple() {
  return (
    <>
      {/* Outer ring */}
      <circle cx="12.5" cy="13" r="8.5" fill="#ffe066" />
      <circle cx="12.5" cy="13" r="6.5" fill="#f9c342" />
      {/* Stem */}
      <rect x="12" y="4" width="1.5" height="3" fill="#3bcc3b" />
      {/* Gloss */}
      <circle cx="10" cy="10" r="1.2" fill="#fff8d1" />
    </>
  );
}

const TYPES = [
  () => <Cherry />,
  () => <Banana />,
  () => <Apple />,
  () => <Orange />,
  () => <Lime />
] as const;

export function Food () {
  const uid = css.cid();
  const {growth, pix} = Math.random() < 0.1
    ? {growth: 2, pix: <GoldenApple />}
    : {growth: 1, pix: TYPES[Math.floor(Math.random() * TYPES.length)]()};
  const cls = css.use({
    position: 'absolute',
    imageRendering: 'pixelated',
    shapeRendering: 'crispEdges',
    [css.attr('data-consumed')]: {
      /* Todo */
    },
  });

  return <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 25 25"
    width="25"
    height="25"
    preserveAspectRatio="none"
    className={cls}
  >
    {pix}
    <Script data={{uid,growth}}>{({el,data,$}) => {
      const SIZE = Number($.cssVar('boardSize'));

      el.$publish('snake:food:spawn', {
        uid: data.uid,
        growth: data.growth,
        fn: (pos) => {
          el.style.left = `${SIZE * pos.col}px`;
          el.style.top = `${SIZE * pos.row}px`;
        },
      });

      el.$subscribeOnce('snake:food:consume', ({uid}) => {
        if (uid !== data.uid) return;
        el.$publish('audio:fx', 'pong' + Math.ceil(Math.random() * 3));
        el.remove();
        $.timedAttr(el, 'data-consumed', {
          duration: 200,
          after: () => el.remove(),
        });
      });

      el.$subscribe('snake:gameover', () => el.remove());
      el.$subscribe('snake:start', () => el.remove());
    }}</Script>
  </svg>;
}
