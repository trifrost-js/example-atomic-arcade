import { CFG, css } from '~/css';
import { GameCanvas } from './GameCanvas';
import { Script } from '~/script';
import { GameCountdown } from './GameCountdown';
import { type SoundRegister } from '../modules/AudioPlayer';

type GameOptions = {
  sound: SoundRegister;
  columns: number;
  rows: number;
  children: any;
  evtStart: keyof AtomicRelay;
  evtPause: keyof AtomicRelay;
  evtOver: keyof AtomicRelay;
};

type GameStore = {
  gameConfig: {
    music: 'on' | 'off';
    difficulty: 'beginner' | 'intermediate' | 'expert';
  };
};

type GameEvents = {
  'game:evt:boot': void;
  'game:evt:countdown': void;
};

declare global {
  interface AtomicRelay extends GameEvents {}
  interface AtomicStore extends GameStore {}
}

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
      <GameCountdown evtStart={evtStart} />
      <div>
        <Script data={{ gameSound, evtStart, evtPause, evtOver }}>
          {({ el, data, $ }) => {
            let isPaused = false;

            el.$subscribe(data.evtStart, () => {
              $.audio.restart();
            });

            el.$subscribe(data.evtOver, () => {
              $.audio.pause();
              $.audio.fx('over');
            });

            el.$subscribe('game:evt:boot', () => {
              /* Blur active elements */
              $.blurActive();

              /* Initial draw */
              el.$publish('canvas:draw');

              /* Set music state */
              if ($.storeGet('gameConfig').music === 'on') {
                $.audio.enable();
              } else {
                $.audio.disable();
              }
            });

            /**
             * MARK: Init
             */

            const keydownListener = $.on(document, 'keydown', (e) => {
              if (e.key === 'p') {
                isPaused = !isPaused;
                if (isPaused) $.audio.pause();
                else $.audio.play();
                el.$publish(data.evtPause);
              } else if (e.key === 'r') {
                isPaused = false;
                $.audio.pause();
                el.$publish(data.evtPause);
                el.$publish('game:evt:countdown');
              }
            });

            $.audio.register(data.gameSound);

            el.$unmount = () => {
              $.audio.stop();
              keydownListener();
            };
          }}
        </Script>
      </div>
    </div>
  );
}
