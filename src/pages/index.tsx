/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LoggerContext from '../contexts/log';
import { LogLevel } from '../util/types';
import Logs from '../components/logs';
import PeerService from '../service/peer';
import { isGuestStage, isHostStage, STAGE, Stage } from '../util/stage';
import StartStage from '../components/stages/start-stage';
import ShowOfferStage from '../components/stages/show-offer-stage';
import WaitAnswerStage from '../components/stages/wait-answer-stage';
import { css } from '@emotion/react';
import Layout from '../components/layout';
import WaitOfferStage from '../components/stages/wait-offer-stage';
import ShowAnswerStage from '../components/stages/show-answer-stage';

const Index = () => {
  const [logs, setLogs] = useState<Array<{ message: string; level: LogLevel }>>([]);
  const [stage, setStage] = useState<Stage>(STAGE.START);
  const [localVolume, setLocalVolume] = useState(1);
  const [isSpeakerMute, setSpeakerMute] = useState(false);
  const [answer, setAnswer] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const onTrack = useCallback((stream: MediaStream) => {
    if (audioRef.current) {
      if ('srcObject' in audioRef.current) {
        audioRef.current.srcObject = stream;
      } else {
        // eslint-disable-next-line
        (audioRef.current as any).src = window.URL.createObjectURL(stream);
      }
      audioRef.current.play().catch((e) => {
        logger('error on playing' + String(e), 'error');
      });
      audioRef.current.volume = localVolume;
    }
  }, []);
  const logger = useCallback((message: string, level: LogLevel = 'log') => {
    setLogs((prev) => [{ message, level }, ...prev]);
  }, []);
  const service = useMemo(() => new PeerService(logger), []);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isSpeakerMute ? 0 : localVolume;
    }
  }, [localVolume, isSpeakerMute]);
  return (
    <LoggerContext.Provider value={logger}>
      <Layout>
        <main
          css={css({
            maxWidth: '1200px',
          })}
        >
          <h1>WebRTC Example</h1>
          <StartStage stage={stage} onStageChange={setStage} />
          {/* Host Stages */}
          <>
            {isHostStage(stage, 10) && (
              <ShowOfferStage
                stage={stage}
                onStageChange={setStage}
                service={service}
                logger={logger}
                onTrack={onTrack}
              />
            )}
            {isHostStage(stage, 20) && (
              <WaitAnswerStage stage={stage} onStageChange={setStage} service={service} logger={logger} />
            )}
          </>
          {/* Guest Stages */}
          <>
            {isGuestStage(stage, 10) && (
              <WaitOfferStage
                stage={stage}
                onStageChange={setStage}
                service={service}
                logger={logger}
                onTrack={onTrack}
                setAnswer={setAnswer}
              />
            )}
            {isGuestStage(stage, 20) && (
              <ShowAnswerStage stage={stage} service={service} onStageChange={setStage} answer={answer} />
            )}
          </>
          <div
            css={css({
              paddingBottom: '20rem',
            })}
          />
          <audio autoPlay ref={audioRef} />
          <div
            css={css({
              position: 'fixed',
              bottom: 0,
              height: '6.5rem',
              padding: '0.25rem',
              margin: 0,
            })}
          >
            <div css={css({ height: '3rem' })}>
              <ul
                css={css({
                  listStyleType: 'none',
                  display: 'flex',
                  margin: 0,
                  padding: 0,
                  borderTop: '1px solid rgba(128, 128, 128, 0.5)',
                })}
              >
                <li>
                  <label>
                    <span>Speaker</span>
                    <input
                      type="range"
                      value={localVolume}
                      max={1}
                      min={0}
                      step={0.01}
                      onChange={(e) => setLocalVolume(Number(e.target.value))}
                    />
                  </label>
                  <button
                    type="button"
                    css={css({
                      display: 'inline-flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textDecoration: isSpeakerMute ? 'line-through' : 'none',
                      width: '5rem',
                      '& span': {
                        textDecoration: isSpeakerMute ? 'line-through' : 'none',
                      },
                    })}
                    onClick={() => setSpeakerMute((prev) => !prev)}
                  >
                    <span>{'🔈'}</span>
                    <span>{localVolume.toFixed(2)}</span>
                  </button>
                </li>
              </ul>
            </div>
            <Logs items={logs} />
          </div>
        </main>
      </Layout>
    </LoggerContext.Provider>
  );
};

export default Index;
