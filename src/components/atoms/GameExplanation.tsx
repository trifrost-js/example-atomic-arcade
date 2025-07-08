import { css } from '~/css';
import { Link } from './Link';
import { KeyPause, KeyReset } from './Keys';

type GameExplanationOptions = {
  title: string;
  description: string;
  keybindings: {
    lbl: string;
    description: string;
    key: JSX.Element;
  }[];
  sources: {
    lbl: string;
    url: string;
  }[];
};

export function GameExplanation({
  title,
  description,
  keybindings,
  sources,
}: GameExplanationOptions) {
  const cls = css.use('f', 'fv', 'fg', {
    width: '100%',
    gap: css.$v.spaceL,
    h1: css.mix('header'),
    h2: css.mix('label'),
    p: css.mix('body'),
    li: css.mix('body'),
    ul: { listStyleType: 'disc', marginLeft: css.$v.spaceL },
    section: css.mix('f', 'fv', {
      gap: css.$v.spaceS,
      aside: css.mix('f', 'fh', 'fa_r', {
        gap: css.$v.spaceL,
        marginTop: css.$v.spaceS,
      }),
    }),
  });

  const gameBindings = [
    ...keybindings,
    { lbl: 'p', description: 'pause/unpause', key: <KeyPause /> },
    { lbl: 'r', description: 'reset', key: <KeyReset /> },
  ];

  return (
    <article className={cls}>
      <h1>{title}</h1>
      <p>{description}</p>
      <section>
        <h2>Keyboard usage</h2>
        <ul>
          {gameBindings.map((el) => (
            <li>
              <strong>{el.lbl}</strong>: {el.description}
            </li>
          ))}
        </ul>
        <aside>{gameBindings.map((el) => el.key)}</aside>
      </section>
      <section>
        <h2>Sources</h2>
        <ul>
          {sources.map((el) => (
            <li>
              <Link to={el.url}>{el.lbl}</Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
