import { css } from '../../css';

type RadioProps = {
  name: string;
  value: string;
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  [key: string]: unknown;
};

export function Radio({
  name,
  value,
  label,
  defaultChecked,
  checked,
  ...rest
}: RadioProps) {
  const base = css.use('f', 'fj_c', 'fg', 'fa_c', 'body', {
    padding: css.$v.spaceS,
    borderRadius: css.$v.radius,
    cursor: 'pointer',
    userSelect: 'none',
    border: 'none',
    overflow: 'hidden',
    [css.has('input:checked')]: {
      backgroundColor: css.$t.buttonBg,
      color: css.$t.buttonFg,
      cursor: 'default',
    },
    [css.not(css.has('input:checked'))]: css.mix('outline'),
    [css.media.tablet]: {
      height: '5rem',
      lineHeight: '5rem',
    },
    [css.media.desktop]: {
      fontSize: css.$v.fontSizeBody,
    },
  });

  return (
    <label className={base} {...rest}>
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className={css({ display: 'none', pointerEvents: 'none' })}
        {...(checked && { checked })}
      />
      <span>{label}</span>
    </label>
  );
}
