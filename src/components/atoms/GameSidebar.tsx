import { css } from '~/css';
import { type RelayEvents } from '~/script';
import { GameStartButton } from './GameStartButton';

type GameSidebarOptions = {
  width?: number;
  children: any;
  evtStart: keyof RelayEvents;
  evtEnd: keyof RelayEvents;
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
      <GameStartButton eventOver={evtEnd} eventStart={evtStart} timer={60} />
    </div>
  );
}
