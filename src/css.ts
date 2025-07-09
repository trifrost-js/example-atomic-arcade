import { createCss } from '@trifrost/core';
import { CFG as TETRIS_CFG } from './routes/tetris/constants';
import { CFG as BREAKOUT_CFG } from './routes/breakout/constants';
import { CFG as SNAKE_CFG } from './routes/snake/constants';

export const CFG = {
  SIZE: 25 /* Cell Size */,
  COLORS: {
    orange: `linear-gradient(to bottom, #ffcb6b, #c49b41)`,
    yellow: `linear-gradient(to bottom, #ffeb7a, #d8b945)`,
    purple: `linear-gradient(to bottom, #8181ff, #4c4cff)`,
    red: `linear-gradient(to bottom, #ff5b5b, #c33a3a)`,
    pink: `linear-gradient(to bottom, #e947e9, #b730b7)`,
    cyan: `linear-gradient(to bottom, #77ffff, #3bbbbb)`,
    green: `linear-gradient(to bottom, #78ff78, #3bcc3b)`,
  },
};

export const css = createCss({
  theme: {
    bg: 'linear-gradient(160deg, #0A0F1C 0%, #202d44 50%, #081018 100%)',
    fg: '#ffffff',
    board_bg: '#050b24',
    board_fg: '#ffffff',
    board_grid: '#3B3B3B',
    board_border: '#ffffff',
    panelBg: '#02080F',
    panelFg: '#FFFFFF',
    panelBorder: '#30343a',
    buttonBg: '#3C4659',
    buttonFg: '#FFFFFF',
    buttonBlueBg: 'linear-gradient(135deg, #1f9fc9, #1484B6, #53abcb)',
    buttonBlueFg: '#FFFFFF',
    outline: '2px solid #FFFFFF',
    keyCapBg: '#e9e9e9',
    keyCapFg: '#333333',
    keyCapSide1: '#d2d2d2',
    keyCapSide2: '#c2c2c2',
    overlayBg: 'rgba(12, 18, 32, .75)',
    bgSynth: 'linear-gradient(to top, #0f0c29, #302b63, #24243e)',
    bgSynthLines: 'repeating-linear-gradient(to right,rgba(255, 0, 150, 0.2) 0,rgba(255, 0, 150, 0.2) 1px,transparent 1px,transparent 40px),repeating-linear-gradient(to top,rgba(0, 200, 255, 0.2) 0,rgba(0, 200, 255, 0.2) 1px,transparent 1px,transparent 40px)',
  },
  var: {
    fontSizeBody: '1.6rem',
    fontSizeLabel: '2rem',
    fontSizeHeader: '2.4rem',
    fontSizeTitle: '3rem',
    fontFamilyHeader: "'Fira Code', monospace",
    fontFamilyBody: "'Roboto', Sans-serif",
    tetrisBoardCols: String(TETRIS_CFG.COLS),
    tetrisBoardRows: String(TETRIS_CFG.ROWS),
    breakoutBoardCols: String(BREAKOUT_CFG.COLS),
    breakoutBoardRows: String(BREAKOUT_CFG.ROWS),
    snakeBoardCols: String(SNAKE_CFG.COLS),
    snakeBoardRows: String(SNAKE_CFG.ROWS),
    boardSize: String(CFG.SIZE),
    spaceS: '.5rem',
    spaceM: '1rem',
    spaceL: '2rem',
    radius: '1rem',
  },
  animations: {
    flash: {
      keyframes: {
        '0%': {
          backgroundImage:
            'linear-gradient(to right,rgb(241, 124, 182),rgb(120, 183, 246))',
          opacity: 0.4,
          maskImage:
            'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 100%)',
          maskSize: `${CFG.SIZE}px 100%`,
          maskRepeat: 'repeat',
        },
        '40%': {
          backgroundImage:
            'linear-gradient(to right,rgb(244, 152, 221),rgb(129, 178, 243))',
          opacity: 1,
        },
        '100%': {
          backgroundImage:
            'linear-gradient(to right,rgb(241, 124, 182),rgb(120, 183, 246))',
          opacity: 0.4,
        },
      },
      easingFunction: 'ease-out',
      duration: '300ms',
    },
    squishV: {
      keyframes: {
        '0%': { transform: 'scale(1, 1)' },
        '50%': { transform: 'scale(1.2, 0.7)' },
        '100%': { transform: 'scale(1, 1)' },
      },
      duration: '200ms',
      easingFunction: 'ease-in-out',
    },
    squishH: {
      keyframes: {
        '0%': { transform: 'scale(1, 1)' },
        '50%': { transform: 'scale(0.7, 1.2)' },
        '100%': { transform: 'scale(1, 1)' },
      },
      duration: '200ms',
      easingFunction: 'ease-in-out',
    },
    goldenGlow: {
      keyframes: {
        '0%': {
          filter: 'drop-shadow(0 0 1px #fff8d1) brightness(1)',
          transform: 'scale(1)',
        },
        '50%': {
          filter: 'drop-shadow(0 0 5px #ffe066) brightness(1.3)',
          transform: 'scale(1.08)',
        },
        '100%': {
          filter: 'drop-shadow(0 0 1px #fff8d1) brightness(1)',
          transform: 'scale(1)',
        },
      },
      easingFunction: 'ease-in-out',
      duration: '1000ms',
      iterationCount: 'infinite',
    },
  },
  definitions: (mod) => ({
    f: () => ({ display: 'flex' }),
    fg: () => ({ flexGrow: '1' }),
    fa_c: () => ({ alignItems: 'center' }),
    fa_r: () => ({ alignItems: 'flex-end' }),
    fj_c: () => ({ justifyContent: 'center' }),
    fj_sb: () => ({ justifyContent: 'space-between' }),
    fh: () => ({ flexDirection: 'row' }),
    fv: () => ({ flexDirection: 'column' }),
    cover: () => ({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    title: () => ({
      fontFamily: mod.$v.fontFamilyHeader,
      fontSize: mod.$v.fontSizeTitle,
      fontWeight: 800,
      letterSpacing: '.1rem',
    }),
    header: () => ({
      fontFamily: mod.$v.fontFamilyHeader,
      fontSize: mod.$v.fontSizeHeader,
      fontWeight: 800,
      letterSpacing: '.1rem',
    }),
    label: () => ({
      fontFamily: mod.$v.fontFamilyHeader,
      fontWeight: 600,
      fontSize: mod.$v.fontSizeLabel,
    }),
    body: () => ({
      fontFamily: mod.$v.fontFamilyBody,
      fontSize: mod.$v.fontSizeBody,
      fontWeight: 400,
      letterSpacing: '.05rem',
      lineHeight: 1.4,
    }),
    button: (opts: { style?: 'blue' | 'standard' }) => ({
      appearance: 'none',
      border: 'none',
      fontFamily: mod.$v.fontFamilyBody,
      fontWeight: 800,
      textDecoration: 'none',
      cursor: 'pointer',
      letterSpacing: '.1rem',
      span: { textDecoration: 'none' },
      padding: mod.$v.spaceM,
      fontSize: mod.$v.fontSizeBody,
      borderRadius: mod.$v.radius,
      ...{
        blue: {
          background: mod.$t.buttonBlueBg,
          color: mod.$t.buttonBlueFg,
        },
        standard: {
          background: mod.$t.buttonBg,
          color: mod.$t.buttonFg,
        },
      }[opts?.style || 'blue'],
      [mod.hover]: { outline: mod.$t.outline },
      [mod.media.mobile]: {
        paddingTop: `calc(${mod.$v.spaceS} - 0.2rem)`,
        paddingBottom: `calc(${mod.$v.spaceS} - 0.2rem)`,
        paddingLeft: mod.$v.spaceS,
        paddingRight: mod.$v.spaceS,
        fontSize: `calc(${mod.$v.fontSizeBody} - 0.2rem)`,
      },
    }),
    linkButton: () => ({
      appearance: 'none',
      border: 'none',
      padding: 0,
      fontFamily: mod.$v.fontFamilyBody,
      fontWeight: 800,
      textDecoration: 'underline',
      cursor: 'pointer',
      background: 'transparent',
      color: mod.$t.fg,
      fontSize: mod.$v.fontSizeBody,
      display: 'inline-block',
    }),
    panel: () => ({
      background: mod.$t.panelBg,
      color: mod.$t.panelFg,
      borderRadius: mod.$v.radius,
      border: '1px solid ' + mod.$t.panelBorder,
    }),
    outline: () => ({
      [mod.hover]: { outline: mod.$t.outline },
    }),
  }),
  reset: true,
});
