/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import pako from 'pako';
import { STAGE, Stage } from '../../util/stage';
import PeerService from '../../service/peer';
import { Logger } from '../../util/types';
import QrcodeReader from '../ex/qrcode-reader';
export interface Props {
  stage: Stage;
  onStageChange: (stage: Stage) => void;
  service: PeerService;
  logger: Logger;
}

const WaitAnswerStage = ({ onStageChange, stage, service, logger }: Props) => {
  const [cameraStart, setCameraStart] = useState(false);
  useEffect(() => {
    service.onConnect((peer) => {
      if (peer === undefined) {
        return;
      }
      if (peer.connectionState === 'connected') {
        onStageChange(STAGE.HOST_CONNECTED);
      }
    });
  }, []);
  return (
    <section>
      <h2>3rd. Waiting for an answer.</h2>
      <button type="button" onClick={() => setCameraStart((prev) => !prev)}>
        {cameraStart ? 'STOP CAMERA' : 'START CAMERA'}
      </button>
      {cameraStart && (
        <QrcodeReader
          onResult={async (result) => {
            setCameraStart(false);
            if (result) {
              logger('QR Code Reading Succeeded');
              const compressed = new Uint8Array();
              const t = result.getText();
              for (const [idx, c] of t.split('').entries()) {
                compressed[idx] = c.charCodeAt(0);
              }
              console.log(compressed);
              const inflated = pako.inflate(compressed);
              const sdp = String.fromCharCode.apply(null, Array.from(inflated));
              try {
                await service.receiveAnswer(new RTCSessionDescription({ type: 'answer', sdp }));
              } catch (e) {
                logger('Error on Reading SDP Answer', 'error');
              }
            }
          }}
        />
      )}
      {!cameraStart && stage === STAGE.WAIT_ANSWER && <p>Loading...</p>}
      {!cameraStart && stage !== STAGE.WAIT_ANSWER && <p>Connected!</p>}
    </section>
  );
};

export default WaitAnswerStage;
