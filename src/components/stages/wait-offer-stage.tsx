/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';
import classNames from 'classnames';
import { STAGE, Stage } from '../../util/stage';
import PeerService from '../../service/peer';
import { QrReader } from '@blackbox-vision/react-qr-reader';
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

const hide = {
  '&.hide': {
    display: 'none',
  },
};

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
        <QrReader
          onResult={async (result, error) => {
            if (result) {
              logger('QR Code Reading Succeeded');
              const text = result.getText();
              await service.createOfferPeer(onTrack, (answer) => {
                if (!answer) {
                  logger('No Answer Given', 'error');
                  return;
                }
                setCameraStart(false);
                setAnswer(answer.sdp);
                onStageChange(STAGE.SHOW_ANSWER);
              });
              const base = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
              const volumeChanger = service.addLocalStream(base);
              setRemoteVolumeChanger(volumeChanger);
              await service.receiveOffer(new RTCSessionDescription({ type: 'answer', sdp: text }));
            }
            if (error) {
              logger('QR Code Reading Failed', 'error');
            }
            setCameraStart(false);
          }}
          constraints={{ facingMode: 'environment' }}
        />
      )}
    </section>
  );
};

export default WaitOfferStage;
