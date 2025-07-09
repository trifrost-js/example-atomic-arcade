import { css } from "~/css";

export function Background () {
  return (<div className={css.use('cover', {
    overflow: 'hidden',
    zIndex: -1,
    background: css.$t.bgSynth,
    opacity: .8,
    [css.before]: css.mix('cover', {
      content: '""',
      opacity: .6,
      backgroundImage: css.$t.bgSynthLines,
      maskImage: 'linear-gradient(to top, transparent, black 50%)',
    }),
  })}></div>);
}
