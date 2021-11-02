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
  service: PeerService;
  logger: Logger;
}

const hide = {
  '&.hide': {
    display: 'none',
  },
};

const WaitAnswerStage = ({ onStageChange, stage, service, logger }: Props) => {
  const [cameraStart, setCameraStart] = useState(false);
  const [text, setText] = useState('');
  return (
    <section>
      <h2>3rd. Waiting for an answer.</h2>
      <button type="button" onClick={() => setCameraStart((prev) => !prev)}>
        {cameraStart ? 'STOP CAMERA' : 'START CAMERA'}
      </button>
      {cameraStart && (
        <QrReader
          onResult={async (result, error) => {
            if (result) {
              logger('QR Code Reading Succeeded');
              setText(result.getText());
            }
            if (error) {
              logger('QR Code Reading Failed', 'error');
            }
            setCameraStart(false);
          }}
          constraints={{ facingMode: 'environment' }}
        />
      )}
      <pre>{text}</pre>
    </section>
  );
};

export default WaitAnswerStage;
