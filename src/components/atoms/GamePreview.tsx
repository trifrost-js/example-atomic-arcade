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
    'outline',
    {
      padding: css.$v.spaceM,
      textAlign: 'center',
      cursor: 'crosshair',
      boxShadow: '0 6px 10px 5px rgba(0, 0, 0, .3)',
      h2: css.mix('header', { marginBottom: css.$v.spaceM }),
      p: css.mix('body', { marginBottom: css.$v.spaceM}),
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
      }
    },
    style || {}
  );

  return (
    <article className={cls} {...rest}>
      <div>{children}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <Script data={{ source, index }}>
        {({ el, data, $ }) => {
          $.on(el, 'click', () => $.modal.open({frag: data.source}));

          el.$subscribe('sys:randomgame', (val) => {
            if (val !== data.index) return;
            $.modal.open({frag: data.source});
          });
        }}
      </Script>
    </article>
  );
}
