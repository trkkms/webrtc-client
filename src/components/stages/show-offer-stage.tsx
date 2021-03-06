/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import classNames from 'classnames';
import { STAGE, Stage } from '../../util/stage';
import PeerService from '../../service/peer';
import QrGenerator from '../qr-generator';
import { Logger } from '../../util/types';

export interface Props {
  stage: Stage;
  service: PeerService;
  logger: Logger;
  onStageChange: (stage: Stage) => void;
  onTrack: (stream: MediaStream) => void;
}

const hide = {
  '&.hide': {
    display: 'none',
  },
};

const ShowOfferStage = ({ stage, onStageChange, service, onTrack, logger }: Props) => {
  const [offer, setOffer] = useState('');
  const [part, setPart] = useState<1 | 2>(1);
  useEffect(() => {
    const f = async () => {
      await service.createOfferPeer(onTrack, (offer) => {
        if (offer) {
          setOffer(offer.sdp);
        }
      });
      const base = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      service.addLocalStream(base);
      await service.createOffer();
    };
    logger('START OFFER');
    f().catch((err) => {
      logger('ERROR ON OFFER' + String(err), 'error');
    });
  }, []);
  return (
    <section>
      <h2>2nd. Showing Offer QR Code for </h2>
      <p css={css(hide)} className={classNames({ hide: offer.length > 0 })}>
        Loading ...
      </p>
      <div>
        {stage === STAGE.SHOW_OFFER && part === 1 && (
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
        )}
        {offer && stage === STAGE.SHOW_OFFER && <QrGenerator title="Offer SDP" value={offer} part={part} />}
      </div>
      {offer && stage === STAGE.SHOW_OFFER && part === 2 && (
        <ul>
          <li>
            <button type="button" onClick={() => onStageChange(STAGE.WAIT_ANSWER)}>
              Wait for an answer
            </button>
          </li>
        </ul>
      )}
    </section>
  );
};

export default ShowOfferStage;
