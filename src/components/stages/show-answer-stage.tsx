/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import { STAGE, Stage } from '../../util/stage';
import PeerService from '../../service/peer';
import QrGenerator from '../qr-generator';

export interface Props {
  stage: Stage;
  onStageChange: (stage: Stage) => void;
  answer: string;
  service: PeerService;
}

const ShowAnswerStage = ({ onStageChange, service, answer, stage }: Props) => {
  useEffect(() => {
    service.onConnect((peer) => {
      if (peer === undefined) {
        return;
      }
      if (peer.connectionState === 'connected') {
        onStageChange(STAGE.GUEST_CONNECTED);
      }
    });
  }, []);
  return (
    <section>
      <h2>Show Answer SDP</h2>
      {stage === STAGE.SHOW_ANSWER && <QrGenerator title="Answer SDP" value={answer} />}
      {stage !== STAGE.SHOW_ANSWER && <p>Connected!</p>}
    </section>
  );
};

export default ShowAnswerStage;
