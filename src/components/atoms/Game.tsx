import { CFG, css } from '~/css';
import { GameCanvas } from './GameCanvas';
import { type RelayEvents, Script } from '~/script';

type GameOptions = {
  sound: RelayEvents['audio:register'];
  columns: number;
  rows: number;
  children: any;
  evtStart: keyof RelayEvents;
  evtPause: keyof RelayEvents;
  evtOver: keyof RelayEvents;
};

export type GameStore = {
  gameConfig: {
    music: 'on' | 'off';
    difficulty: 'beginner' | 'intermediate' | 'expert';
  };
};

export type GameEvents = {
  'game:evt:boot': void;
};

export function Game({
  sound,
  columns,
  rows,
  children,
  evtOver,
  evtPause,
  evtStart,
}: GameOptions) {
  const gameSound = {
    track: sound.track,
    fx: {
      over: 'gameover.mp3',
      ...sound.fx,
    },
  };

  return (
    <div
      className={css({
        position: 'relative',
        width: `${columns * CFG.SIZE}px`,
        height: `${rows * CFG.SIZE}px`,
      })}
    >
      <GameCanvas columns={columns} rows={rows} size={CFG.SIZE} />
      {children}
      <div>
        <Script data={{ gameSound, evtStart, evtPause, evtOver }}>
          {({ el, data, $ }) => {
            let isPaused = false;

            el.$subscribe(data.evtStart, () => {
              el.$publish('audio:restart');
            });

            el.$subscribe(data.evtOver, () => {
              el.$publish('audio:pause');
              el.$publish('audio:fx', 'over');
            });

            el.$subscribe('game:evt:boot', () => {
              /* Blur active elements */
              $.blurActive();

              /* Initial draw */
              el.$publish('canvas:draw');

              /* Set music state */
              el.$publish(
                $.storeGet('gameConfig').music === 'on'
                  ? 'audio:enable'
                  : 'audio:disable'
              );
            });

            /**
             * MARK: Init
             */

            const keydownListener = $.on(document, 'keydown', (e) => {
              if (e.key === 'p') {
                isPaused = !isPaused;
                el.$publish(isPaused ? 'audio:pause' : 'audio:play');
                el.$publish(data.evtPause);
              } else if (e.key === 'r') {
                isPaused = false;
                el.$publish(data.evtStart);
              }
            });

            el.$publish('audio:register', data.gameSound);

            el.$unmount = () => {
              el.$publish('audio:stop');
              keydownListener();
            };
          }}
        </Script>
      </div>
    </div>
  );
}
