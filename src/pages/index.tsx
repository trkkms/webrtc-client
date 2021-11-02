/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LoggerContext from '../contexts/log';
import { LogLevel } from '../util/types';
import Logs from '../components/logs';
import PeerService from '../service/peer';
import { isHostStage, STAGE, Stage } from '../util/stage';
import StartStage from '../components/stages/start-stage';
import ShowOfferStage from '../components/stages/show-offer-stage';
import WaitAnswerStage from '../components/stages/wait-answer-stage';
import { css } from '@emotion/react';

const Index = () => {
  const [logs, setLogs] = useState<Array<{ message: string; level: LogLevel }>>([]);
  const [stage, setStage] = useState<Stage>(STAGE.START);
  const [localVolume, setLocalVolume] = useState(1);
  const [remoteVolume, setRemoteVolume] = useState(1);
  const [isMicMute, setMicMute] = useState(false);
  const [isSpeakerMute, setSpeakerMute] = useState(false);
  const [answer, setAnswer] = useState('');
  const remoteVolumeChangerRef = useRef<{ f: ((volume: number) => void) | null }>({ f: null });
  const setRemoteVolumeChanger = useCallback((f: (volume: number) => void) => {
    remoteVolumeChangerRef.current.f = f;
  }, []);
  const audioRef = useRef<HTMLAudioElement>(null);
  const onTrack = useCallback((stream: MediaStream) => {
    if (audioRef.current) {
      audioRef.current.srcObject = stream;
    }
  }, []);
  const logger = useCallback((message: string, level: LogLevel = 'log') => {
    setLogs((prev) => [{ message, level }, ...prev]);
  }, []);
  const service = useMemo(() => new PeerService(logger), []);
  useEffect(() => {
    if (remoteVolumeChangerRef.current.f) {
      remoteVolumeChangerRef.current.f(isMicMute ? 0 : remoteVolume);
    }
  }, [remoteVolume, isMicMute]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isSpeakerMute ? 0 : localVolume;
    }
  }, [localVolume, isSpeakerMute]);
  return (
    <LoggerContext.Provider value={logger}>
      <main>
        <h1>WebRTC Example</h1>
        <StartStage stage={stage} onStageChange={setStage} />
        {isHostStage(stage, 10) && (
          <ShowOfferStage
            stage={stage}
            onStageChange={setStage}
            service={service}
            logger={logger}
            onTrack={onTrack}
            setRemoteVolumeChanger={setRemoteVolumeChanger}
          />
        )}
        {isHostStage(stage, 20) && (
          <WaitAnswerStage stage={stage} onStageChange={setStage} service={service} logger={logger} />
        )}
        <audio autoPlay ref={audioRef} />
        <div
          css={css({
            position: 'fixed',
            bottom: 0,
            display: 'flex',
            width: '100%',
            height: '4rem',
            padding: '0.25rem',
            margin: 0,
            overflowY: 'scroll',
          })}
        >
          <div>
            <ul css={css({ listStyleType: 'none', display: 'flex', margin: 0, padding: 0 })}>
              <li>
                <label>
                  <span>Mic</span>
                  <input
                    type="range"
                    max={1}
                    min={0}
                    step={0.01}
                    onChange={(e) => setRemoteVolume(Number(e.target.value))}
                  />
                </label>
                <button
                  type="button"
                  css={css({
                    position: 'relative',
                    textDecoration: isMicMute ? 'line-through' : 'none',
                    width: '4rem',
                    '& span': {
                      textDecoration: isMicMute ? 'line-through' : 'none',
                    },
                  })}
                  onClick={() => setMicMute((prev) => !prev)}
                >
                  <span css={css({ position: 'absolute', left: '0.25rem' })}>{'🎤'}</span>
                  <span css={css({ position: 'absolute', right: '0.25rem' })}>{remoteVolume.toFixed(2)}</span>
                  {'　'}
                </button>
              </li>
              <li>
                <label>
                  <span>Speaker</span>
                  <input
                    type="range"
                    max={1}
                    min={0}
                    step={0.01}
                    onChange={(e) => setLocalVolume(Number(e.target.value))}
                  />
                </label>
                <button
                  type="button"
                  css={css({
                    position: 'relative',
                    textDecoration: isSpeakerMute ? 'line-through' : 'none',
                    width: '4rem',
                    '& span': {
                      textDecoration: isSpeakerMute ? 'line-through' : 'none',
                    },
                  })}
                  onClick={() => setSpeakerMute((prev) => !prev)}
                >
                  <span css={css({ position: 'absolute', left: '0.25rem' })}>{'🔈'}</span>
                  <span css={css({ position: 'absolute', right: '0.25rem' })}>{localVolume.toFixed(2)}</span>
                  {'　'}
                </button>
              </li>
            </ul>
          </div>
          <Logs items={logs} />
        </div>
      </main>
    </LoggerContext.Provider>
  );
};

export default Index;
