/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { STAGE, Stage } from '../../util/stage';
import PeerService from '../../service/peer';
import QrcodeReader from '../ex/qrcode-reader';
import { Logger } from '../../util/types';
import { decodeSDP } from '../../util/encode';
export interface Props {
  stage: Stage;
  onStageChange: (stage: Stage) => void;
  onTrack: (stream: MediaStream) => void;
  setRemoteVolumeChanger: (f: (volume: number) => void) => void;
  setAnswer: (answer: string) => void;
  service: PeerService;
  logger: Logger;
  setLocalAudio: (stream: MediaStream) => void;
}

const WaitOfferStage = ({
  onStageChange,
  onTrack,
  setAnswer,
  stage,
  service,
  logger,
  setRemoteVolumeChanger,
  setLocalAudio,
}: Props) => {
  const [cameraStart, setCameraStart] = useState(true);
  const [firstHalf, setFirstHalf] = useState('');
  return (
    <section>
      <h2>2nd. Waiting for an offer.</h2>
      {!cameraStart && firstHalf && stage === STAGE.WAIT_OFFER && (
        <ul>
          <li>
            <button type="button" onClick={() => setCameraStart(true)}>
              Restart Camera for 2nd Part
            </button>
          </li>
        </ul>
      )}
      {cameraStart && (
        <QrcodeReader
          onResult={async (result, controls) => {
            if (result) {
              logger('QR Code Reading Succeeded');
              controls.stop();
              setCameraStart(false);
              if (firstHalf === '') {
                setFirstHalf(result.getText());
                return;
              }
              await service.createOfferPeer(onTrack, (answer) => {
                if (!answer) {
                  logger('No Answer Given', 'error');
                  return;
                }
                setAnswer(answer.sdp);
                onStageChange(STAGE.SHOW_ANSWER);
              });
              const base = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
              const volumeChanger = service.addLocalStream(base, setLocalAudio);
              setRemoteVolumeChanger(volumeChanger);
              try {
                const sdp = decodeSDP(firstHalf + result.getText());
                console.log(sdp);
                await service.receiveOffer(new RTCSessionDescription({ type: 'offer', sdp: sdp }));
              } catch (e) {
                logger('Received Text could not be parsed as a session description' + String(e), 'error');
              }
            }
            setCameraStart(false);
          }}
        />
      )}
      {!cameraStart && stage === STAGE.WAIT_OFFER && <p>Loading...</p>}
    </section>
  );
};

export default WaitOfferStage;
