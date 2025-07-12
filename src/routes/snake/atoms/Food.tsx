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
      {/* Banana crescent */}
      <path
        d="
          M5 20
          C2 12, 11 5, 18 6
          C19 10, 10 16, 5 20
          Z
        "
        fill="#ffeb7a"
      />

      {/* Inner flesh shading */}
      <path
        d="
          M6 19
          C4 13, 11 6, 17 7
          C18 10, 10 15, 6 19
          Z
        "
        fill="#d8b945"
      />

      {/* Gloss streak */}
      <path
        d="M7 18 C9 13, 13 10, 15 9"
        fill="none"
        stroke="#fff8d1"
        stroke-width="1"
        stroke-linecap="round"
        stroke-dasharray="2,1"
      />

      {/* Peel tip */}
      <circle cx="5" cy="20" r="1.5" fill="#fff8d1" />

      {/* Stem */}
      <rect x="17" y="5" width="2" height="3" fill="#c49b41" transform="rotate(-20 17 5)" />
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
      <circle cx="12.5" cy="12.5" r="7.5" fill="#c49b41" />
      {/* Peel texture segments */}
      <path
        d="M12.5 3.5 L12.5 21.5 M3.5 12.5 L21.5 12.5"
        stroke="#ffcb6b"
        stroke-width="1"
      />
      <path
        d="M6 6 L19 19 M19 6 L6 19"
        stroke="#ffcb6b"
        stroke-width="0.75"
      />
      {/* Highlight */}
      <circle cx="10" cy="10" r="1.5" fill="#fff8d1" />
    </>
  );
}

function Lime() {
  return (
    <>
      <circle cx="12.5" cy="12.5" r="9" fill="#78ff78" />
      <circle cx="12.5" cy="12.5" r="7.5" fill="#3bcc3b" />
      {/* Wedge segmentation */}
      <path
        d="M12.5 3.5 L12.5 21.5 M3.5 12.5 L21.5 12.5"
        stroke="#78ff78"
        strokeWidth="1"
      />
      <path
        d="M6 6 L19 19 M19 6 L6 19"
        stroke="#78ff78"
        stroke-width="0.75"
      />
      {/* Zest */}
      <circle cx="9" cy="9" r="1.25" fill="#fff8d1" />
    </>
  );
}

function GoldenApple() {
  return (
    <>
      {/* Outer glow */}
      <circle cx="12.5" cy="13" r="9" fill="#ffe066" />
      <circle cx="12.5" cy="13" r="7" fill="#f9c342" />

      {/* Shine + gloss */}
      <circle cx="9.5" cy="10" r="1.75" fill="#fff8d1" />
      <circle cx="11.5" cy="9.5" r="1" fill="#fff8d1" />

      {/* Stem */}
      <rect x="12" y="4" width="1.5" height="3" fill="#3bcc3b" />
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
  const isGolden = Math.random() < 0.1;
  const {growth, pix} = isGolden
    ? {growth: 2, pix: <GoldenApple />}
    : {growth: 1, pix: TYPES[Math.floor(Math.random() * TYPES.length)]()};
  const cls = css.use({
    position: 'absolute',
    imageRendering: 'pixelated',
    shapeRendering: 'crispEdges',
    ...isGolden && {
      [css.not(css.attr('data-consumed'))]: {
        ...css.animation('goldenGlow'),
      }
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
        $.audio.fx('pong' + Math.ceil(Math.random() * 3));
        el.remove();
      });

      el.$subscribe('snake:gameover', () => el.remove());
      el.$subscribe('snake:start', () => el.remove());
    }}</Script>
  </svg>;
}
