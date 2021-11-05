/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
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
  const [part, setPart] = useState<1 | 2>(1);
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
      {stage === STAGE.SHOW_ANSWER && part === 1 && (
        <div>
          <ul>
            <li>
              <button
                type="button"
                onClick={() => {
                  setPart(2);
                }}
              >
                Next Part
              </button>
            </li>
          </ul>
          <QrGenerator title="Answer SDP" value={answer} part={part} />
        </div>
      )}
      {stage !== STAGE.SHOW_ANSWER && <p>Connected!</p>}
    </section>
  );
};

export default ShowAnswerStage;
