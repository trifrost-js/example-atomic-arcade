import { Module } from '~/script';

export type SoundRegister = {
  track: string[];
  fx: Record<string, string>
};

export function AudioPlayer() {
  return Module({
    name: 'audio',
    mod: ({ $ }) => {
      let trackList: string[] = [];
      let fx: Record<string, HTMLAudioElement> = {};
      let audioIdx = 0;
      let isStopped = false;
      let isEnabled = false;

      // Shared track audio element
      const track_audio = $.create('audio', {
        attrs: { preload: 'auto', crossOrigin: 'anonymous' },
      });
      document.body.appendChild(track_audio);

      function playTrack(index: number) {
        if (!isEnabled) return;

        isStopped = false;

        const src = trackList[index % trackList.length];
        track_audio.pause();
        track_audio.src = src;
        track_audio.load();

        track_audio.oncanplaythrough = () => {
          if (!isStopped && isEnabled) track_audio.play().catch(() => {});
        };

        track_audio.onended = () => {
          if (!isStopped && isEnabled) {
            audioIdx++;
            playTrack(audioIdx);
          }
        };
      }

      return {
        register: (val:SoundRegister) => {
          trackList = val.track;
          audioIdx = 0;

          // Load FX upfront
          fx = Object.fromEntries(
            Object.entries(val.fx).map(([name, src]) => {
              const el = new Audio(src);
              el.preload = 'auto';
              el.crossOrigin = 'anonymous';
              el.load();
              return [name, el];
            })
          );

          // Preload first track
          if (!track_audio.paused) track_audio.pause();
          track_audio.src = trackList[0];
          track_audio.load();
        },
        enable: () => isEnabled = true,
        disable: () => isEnabled = false,
        restart: () => {
          audioIdx = 0;
          playTrack(audioIdx);
        },
        play: () => {
          if (!isEnabled) return;
          if (!track_audio.src && trackList.length) {
            playTrack(audioIdx);
          } else {
            track_audio.play().catch(() => {});
          }
        },
        pause: () => {
          if (!isEnabled) return;
          track_audio.pause();
        },
        stop: () => {
          isStopped = true;
          isEnabled = false;

          track_audio.pause();
          track_audio.removeAttribute('src');
          track_audio.load();
          trackList = [];
          fx = {};
          audioIdx = 0;
        },
        fx: (key:string) => {
          if (!isEnabled) return;
          const snd = fx[key];
          if (snd) {
            try {
              snd.currentTime = 0;
              snd.play();
            } catch {
              /* Noop */
            }
          }
        },
      }
    },
  });
}
