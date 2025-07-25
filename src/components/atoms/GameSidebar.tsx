import { css } from '~/css';
import { GameStartButton } from './GameStartButton';

type GameSidebarOptions = {
  width?: number;
  children: any;
  evtStart: keyof AtomicRelay;
  evtEnd: keyof AtomicRelay;
};

export function GameSidebar({
  width = 30,
  evtStart,
  evtEnd,
  children,
}: GameSidebarOptions) {
  const cls = css.use('f', 'fv', { width: width + 'rem', height: '100%' });

  return (
    <div className={cls}>
      {children}
      <GameStartButton eventOver={evtEnd} eventStart={evtStart} timer={60} style={{marginTop: 'calc(' + css.$v.spaceL + ' * 2)'}} />
    </div>
  );
}
