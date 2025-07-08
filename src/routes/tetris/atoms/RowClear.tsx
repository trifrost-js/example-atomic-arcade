import { css, CFG } from '~/css';
import { Script } from '~/script';

export function RowClear({ top, rows }: { top: number; rows: number }) {
  const ANIM_DURATION = 350;
  const base = css({
    ...css.animation('flash', { duration: ANIM_DURATION + 'ms' }),
    position: 'absolute',
    left: 0,
    right: 0,
    height: CFG.SIZE + 'px',
    backgroundColor: css.$t.board_fg,
    zIndex: 10,
  });

  // Row-specific classes that only set top
  const rowTopClasses = Array.from({ length: rows }, (_, idx) =>
    css({ top: `${top + idx * CFG.SIZE}px` })
  );

  return (
    <div>
      {rowTopClasses.map((topCls, idx) => (
        <div key={idx} className={`${base} ${topCls}`} />
      ))}
      <Script data={{ ANIM_DURATION }}>
        {({ el, data }) => {
          setTimeout(() => {
            el.$publish('tetris:rowclearend');
            el.remove();
          }, data.ANIM_DURATION);
        }}
      </Script>
    </div>
  );
}
