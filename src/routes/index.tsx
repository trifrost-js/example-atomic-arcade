import { type Router } from '~/types';
import { css } from '~/css';
import { Layout } from '~/components/Layout';
import { BreakoutRouter } from './breakout/routes';
import { PREVIEW as BreakoutPreview } from './breakout/constants';
import { TetrisRouter } from './tetris/routes';
import { PREVIEW as TetrisPreview } from './tetris/constants';
import { SnakeRouter } from './snake/routes';
import { PREVIEW as SnakePreview } from './snake/constants';
import { GamePreview } from '~/components/atoms/GamePreview';
import { ModalClose } from '~/components/atoms/ModalClose';
import { Script } from '~/script';

const PREVIEWS = [BreakoutPreview, TetrisPreview, SnakePreview];

type SystemEvents = {
  'sys:randomgame': number;
};

declare global {
  interface AtomicRelay extends SystemEvents {}
}

export async function routes<State extends Record<string, unknown>>(
  r: Router<State>
) {
  r.get('/public/:path', (ctx) => ctx.file(`/${ctx.state.path}`))
    .get('/', (ctx) => {
      ctx.html(
        <Layout title={'Atomic Arcade'}>
          <main
            className={css.use('f', 'fv', 'fa_c', {
              padding: '2rem',
              gap: '1rem',
            })}
          >
            <h1 className={css.use('title')}>Atomic Arcade</h1>
            <p className={css.use('body', { fontWeight: 100 })}>
              No Bundles. Just Fragments and Fun.&nbsp;
              <button type="button" className={css.use('linkButton')}>
                What's this?
                <Script>
                  {({ el, $ }) => {
                    $.on(el, 'click', () => $.modal.open({frag: '/about'}));
                  }}
                </Script>
              </button>
            </p>
            <section
              className={css.use('f', 'fh', {
                marginTop: css.$v.spaceL,
                gap: '2rem',
              })}
            >
              {PREVIEWS.map((el, idx) => (
                <GamePreview
                  title={el.title}
                  description={el.desc}
                  source={el.source}
                  index={idx}
                  style={{
                    width: '30rem',
                    div: { height: '26rem' },
                  }}
                >
                  {el.view()}
                </GamePreview>
              ))}
            </section>
            <button className={css.use('linkButton', {marginTop: css.$v.spaceL})}>
              I don't know what to choose
              <Script data={{ length: PREVIEWS.length }}>
                {({ el, data, $ }) => {
                  $.on(el, 'click', () =>
                    el.$publish(
                      'sys:randomgame',
                      Math.floor(Math.random() * data.length)
                    )
                  );
                }}
              </Script>
            </button>
          </main>
        </Layout>
      );
    })
    .get('/about', (ctx) =>
      ctx.html(
        <div
          className={css.use('f', 'fv', 'panel', {
            width: '50rem',
            padding: css.$v.spaceL,
            p: { marginTop: css.$v.spaceL },
          })}
        >
          <h1 className={css.use('title')}>What's in a name</h1>
          <p>
            <strong>Atomic Arcade</strong> is a live demo of{' '}
            <strong>TriFrost Atomic’s</strong> fragment-based rendering model. A
            small arcade where each game is streamed, hydrated, and run
            on-demand. No bundling, no preloading, no magic.
          </p>
          <p>
            It’s <strong>server-first</strong> all the way. Each game is
            delivered as a <strong>runtime fragment</strong>. When you start a
            game, TriFrost sends only the{' '}
            <strong>html, scripts and styles</strong> it needs. When that game
            needs something else, the <strong>next level</strong>,{' '}
            <strong>next block</strong>, a <strong>UI component</strong> it
            fetches that too, on the fly.
          </p>
          <p>
            Under the hood, the{' '}
            <strong>TriFrost Atomic runtime and its Arc spark</strong> handle
            hydration, lifecycle, and cleanup. It entirely on{' '}
            <strong>
              a just-in-time delivery model without heavy compilers or bundlers
            </strong>
            .
          </p>
          <p>
            It’s kind of like an arcade cabinet, but instead of ROMs and wiring,
            it’s built from live fragments, assembled as needed.
          </p>
          <p>No reloads. No client router. No big frontend.</p>
          <p>Just games, fragments, and fast rendering.</p>
          <p>Have fun.</p>
          <p>As always, stay frosty ❄️ — Peter</p>
          <p>PS: Even this modal was loaded up as a Fragment</p>
          <ModalClose style={{ marginTop: css.$v.spaceL }} />
        </div>
      )
    )
    .group('/tetris', TetrisRouter)
    .group('/breakout', BreakoutRouter)
    .group('/snake', SnakeRouter);
}
