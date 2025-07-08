import { Script } from '~/script';
import { css } from '~/css';

type GamePreviewOptions = {
  title: string;
  description: string;
  children: any;
  source: string;
  style: Record<string, unknown>;
  index: number;
  [key: string]: unknown;
};

export function GamePreview({
  title,
  description,
  children,
  source,
  style,
  index,
  ...rest
}: GamePreviewOptions) {
  const cls = css.use(
    'f',
    'fv',
    'panel',
    {
      padding: css.$v.spaceM,
      h2: css.mix('header', { marginBottom: css.$v.spaceM }),
      p: css.mix('body', 'fg', { marginBottom: css.$v.spaceL }),
      div: {
        overflow: 'hidden',
        width: '100%',
        borderRadius: css.$v.radius,
        border: '1px solid ' + css.$t.panelBorder,
        marginBottom: css.$v.spaceL,
        img: {
          objectFit: 'contain',
          objectPosition: 'center center',
          width: '100%',
          height: '100%',
        },
      },
      button: css.mix('button'),
    },
    style || {}
  );

  return (
    <article className={cls} {...rest}>
      <div>{children}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button type="button">
        Play
        <Script data={{ source, index }}>
          {({ el, data, $ }) => {
            function start() {
              el.$publish('modal:open', { frag: data.source });
            }

            $.on(el, 'click', () => start());

            el.$subscribe('sys:randomgame', (val) => {
              if (val !== data.index) return;
              start();
            });
          }}
        </Script>
      </button>
    </article>
  );
}
