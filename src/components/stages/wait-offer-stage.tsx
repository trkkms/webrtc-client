/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import pako from 'pako';
import { STAGE, Stage } from '../../util/stage';
import PeerService from '../../service/peer';
import QrcodeReader from '../ex/qrcode-reader';
import { Logger } from '../../util/types';
export interface Props {
  stage: Stage;
  onStageChange: (stage: Stage) => void;
  onTrack: (stream: MediaStream) => void;
  setRemoteVolumeChanger: (f: (volume: number) => void) => void;
  setAnswer: (answer: string) => void;
  service: PeerService;
  logger: Logger;
}

const WaitOfferStage = ({
  onStageChange,
  onTrack,
  setAnswer,
  stage,
  service,
  logger,
  setRemoteVolumeChanger,
}: Props) => {
  const [cameraStart, setCameraStart] = useState(true);
  return (
    <section>
      <h2>2nd. Waiting for an offer.</h2>
      {cameraStart && (
        <QrcodeReader
          onResult={async (result) => {
            if (result) {
              logger('QR Code Reading Succeeded');
              setCameraStart(false);
              const text = pako.inflate(result.getText(), { to: 'string' });
              await service.createOfferPeer(onTrack, (answer) => {
                if (!answer) {
                  logger('No Answer Given', 'error');
                  return;
                }
                setAnswer(answer.sdp);
                onStageChange(STAGE.SHOW_ANSWER);
              });
              const base = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
              const volumeChanger = service.addLocalStream(base);
              setRemoteVolumeChanger(volumeChanger);
              try {
                await service.receiveOffer(new RTCSessionDescription({ type: 'offer', sdp: text }));
              } catch (e) {
                logger('Received Text could not be parsed as a session description', 'error');
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
