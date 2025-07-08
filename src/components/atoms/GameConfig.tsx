import { Script } from '~/script';
import { css } from '~/css';
import { Radio } from './Radio';

type GameconfigOptions = {
  preview: {
    view: () => JSX.Element;
  };
};

export function GameConfig({ preview }: GameconfigOptions) {
  const cls = css.use('f', 'fh', 'fj_c', 'fa_c', 'panel', {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: css.$v.spaceL,
    zIndex: 1,
    aside: {
      width: '30rem',
      height: '30rem',
      marginRight: 'calc(' + css.$v.spaceL + ' * 2)',
      borderRadius: css.$v.radius,
      border: '1px solid ' + css.$t.panelBorder,
      img: {
        objectFit: 'contain',
        objectPosition: 'center center',
        width: '100%',
        height: '100%',
      },
    },
    form: css.mix('f', 'fj_c', 'fa_c', {
      h1: css.mix('header'),
      '> div': css.mix('f', 'fv', 'fj_c', {
        width: '30rem',
        gap: css.$v.spaceL,
      }),
      fieldset: css.mix('f', 'fv', {
        legend: css.mix('label', { marginBottom: css.$v.spaceL }),
        div: css.mix('f', 'fh', { gap: css.$v.spaceM }),
      }),
      button: css.mix('button', { width: '100%', marginTop: css.$v.spaceL }),
    }),
  });

  return (
    <article className={cls}>
      <aside>{preview.view()}</aside>
      <form>
        <div>
          <h1>Settings</h1>
          <fieldset>
            <legend>Difficulty</legend>
            <div>
              <Radio name="difficulty" value="beginner" label="Beginner" />
              <Radio name="difficulty" value="intermediate" label="So-so" />
              <Radio name="difficulty" value="expert" label="Expert" />
            </div>
          </fieldset>
          <fieldset>
            <legend>Music</legend>
            <div>
              <Radio name="music" value="on" label="On" />
              <Radio name="music" value="off" label="Off" />
            </div>
          </fieldset>
          <button type="button">Next</button>
        </div>
      </form>
      <Script data={{ form: { music: 'on', difficulty: 'beginner' } }}>
        {({ el, data, $ }) => {
          data.$set('form', {
            ...data.form,
            ...($.storeGet('gameConfig') || {}),
          });
          data.$bind('form.music', 'input[name="music"]');
          data.$bind('form.difficulty', 'input[name="difficulty"]');

          const button = $.query(el, 'button')!;
          $.on(button, 'click', () => {
            $.storeSet(
              'gameConfig',
              {
                difficulty: data.form.difficulty,
                music: data.form.music,
              },
              { persist: true }
            );
            el.$publish('game:evt:boot');
            el.remove();
          });
        }}
      </Script>
    </article>
  );
}
