import { css } from '~/css';

type KeyOptions = {
  char?: string;
  width: number;
};

export function Key({ char, width }: KeyOptions) {
  const cls = css.use('f', 'fa_c', 'fj_c', {
    width: width + 'rem',
    height: '3rem',
    backgroundColor: css.$t.keyCapBg,
    position: 'relative',
    borderLeft: '.4rem solid ' + css.$t.keyCapSide2,
    borderRight: '.4rem solid ' + css.$t.keyCapSide2,
    borderBottom: '.4rem solid ' + css.$t.keyCapSide1,
    borderTop: '.2rem solid ' + css.$t.keyCapSide2,
    userSelect: 'none',
    span: css.mix('body', {
      fontSize: css.$v.fontSizeHeader,
      color: css.$t.keyCapFg,
    }),
  });
  return <div className={cls}>{char && <span>{char}</span>}</div>;
}

export function KeyArrowUp() {
  return <Key char="↑" width={3} />;
}

export function KeyArrowDown() {
  return <Key char="↓" width={3} />;
}

export function KeyArrowLeft() {
  return <Key char="←" width={3} />;
}

export function KeyArrowRight() {
  return <Key char="→" width={3} />;
}

export function KeyPause() {
  return <Key char="p" width={3} />;
}

export function KeyReset() {
  return <Key char="r" width={3} />;
}

export function KeySpacebar() {
  return <Key width={12} />;
}

export function KeyArrowsAll() {
  const cls = css.use('f', 'fv', {
    width: '12rem',
    gap: css.$v.spaceS,
    '> div': css.mix('f', 'fh', 'fa_c', 'fj_c', {
      width: '100%',
      gap: css.$v.spaceS,
    }),
  });

  return (
    <div className={cls}>
      <div>
        <KeyArrowUp />
      </div>
      <div>
        <KeyArrowLeft />
        <KeyArrowDown />
        <KeyArrowRight />
      </div>
    </div>
  );
}

export function KeyArrowsLBR() {
  const cls = css.use('f', 'fh', 'fa_c', 'fj_c', {
    width: '12rem',
    gap: css.$v.spaceS,
  });

  return (
    <div className={cls}>
      <KeyArrowLeft />
      <KeyArrowDown />
      <KeyArrowRight />
    </div>
  );
}

export function KeyArrowsHorizontal() {
  const cls = css.use('f', 'fh', {
    width: '9rem',
    gap: css.$v.spaceS,
  });

  return (
    <div className={cls}>
      <KeyArrowLeft />
      <KeyArrowRight />
    </div>
  );
}

export function KeyArrowsVertical() {
  const cls = css.use('f', 'fv', {
    width: '9rem',
    gap: css.$v.spaceS,
  });

  return (
    <div className={cls}>
      <KeyArrowUp />
      <KeyArrowDown />
    </div>
  );
}
