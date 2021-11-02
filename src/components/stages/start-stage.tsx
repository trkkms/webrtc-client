/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import classNames from 'classnames';
import { STAGE, Stage } from '../../util/stage';
export interface Props {
  stage: Stage;
  onStageChange: (stage: Stage) => void;
}

const hide = {
  '&.hide': {
    display: 'none',
  },
};

const StartStage = ({ onStageChange, stage }: Props) => {
  return (
    <section css={css({})}>
      <h2>1st. Create an offer or receive an offer.</h2>
      <ul css={css(hide)} className={classNames({ hide: stage > STAGE.START })}>
        <li>
          <button type="button" onClick={() => onStageChange(STAGE.SHOW_OFFER)}>
            Create an offer
          </button>
        </li>
        <li>
          <button type="button" onClick={() => onStageChange(STAGE.WAIT_OFFER)}>
            Receive an Offer
          </button>
        </li>
      </ul>
      <p css={css(hide)} className={classNames({ hide: stage === STAGE.START })}>
        Connection Process Started
      </p>
    </section>
  );
};

export default StartStage;
