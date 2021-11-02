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
  setRemoteVolumeChanger: (f: (volume: number) => void) => void;
}

const hide = {
  '&.hide': {
    display: 'none',
  },
};

const ShowOfferStage = ({ stage, onStageChange, service, onTrack, logger, setRemoteVolumeChanger }: Props) => {
  const [offer, setOffer] = useState('');
  useEffect(() => {
    const f = async () => {
      await service.createOfferPeer(onTrack, (offer) => {
        if (offer) {
          setOffer(offer.sdp);
        }
      });
      const base = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const volumeChanger = service.addLocalStream(base);
      setRemoteVolumeChanger(volumeChanger);
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
      {offer && stage === STAGE.SHOW_OFFER && <QrGenerator title="Offer SDP" value={offer} />}
      {offer && stage === STAGE.SHOW_OFFER && (
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
