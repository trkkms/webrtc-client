/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { STAGE, Stage } from '../../util/stage';
import PeerService from '../../service/peer';
import { Logger } from '../../util/types';
import QrcodeReader from '../ex/qrcode-reader';
import { decodeSDP } from '../../util/encode';
export interface Props {
  stage: Stage;
  onStageChange: (stage: Stage) => void;
  service: PeerService;
  logger: Logger;
}

const WaitAnswerStage = ({ onStageChange, stage, service, logger }: Props) => {
  const [cameraStart, setCameraStart] = useState(false);
  const [firstHalf, setFirstHalf] = useState('');
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
        {cameraStart ? 'STOP CAMERA' : firstHalf ? 'Start Camera for next part' : 'START CAMERA'}
      </button>
      {cameraStart && (
        <QrcodeReader
          onResult={async (result, controls) => {
            if (result) {
              controls.stop();
              setCameraStart(false);
              logger('QR Code Reading Succeeded');
              if (firstHalf === '') {
                setFirstHalf(result.getText());
                return;
              }
              try {
                const sdp = decodeSDP(firstHalf + result.getText());
                console.log(sdp);
                await service.receiveAnswer(new RTCSessionDescription({ type: 'answer', sdp }));
              } catch (e) {
                logger('Error on Reading SDP Answer' + String(e), 'error');
              }
            }
          }}
        />
      )}
      {!cameraStart && stage === STAGE.WAIT_ANSWER && <pre>Loading...</pre>}
      {!cameraStart && stage !== STAGE.WAIT_ANSWER && <p>Connected!</p>}
    </section>
  );
};

export default WaitAnswerStage;
