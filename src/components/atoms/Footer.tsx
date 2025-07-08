import { css } from '~/css';
import { Link } from './Link';

export function Footer() {
  return (
    <footer
      className={css.use('f', 'fv', 'fa_c', 'body', {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: css.$v.spaceL,
      })}
    >
      <small>
        ©2025 <Link to="https://github.com/peterver">Peter Vermeulen</Link>{' '}
        &amp; <Link to="https://trifrost.dev">TriFrost</Link> contributors
      </small>
      <small>
        Built with <Link to="https://trifrost.dev">TriFrost</Link> | Licensed
        under MIT
      </small>
    </footer>
  );
}
