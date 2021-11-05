/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { css } from '@emotion/react';
import QRCode from 'react-qr-code';
import { encodeSDP } from '../util/encode';

export interface Props {
  title: string;
  value: string;
}

const QrGenerator = ({ value, title }: Props) => {
  const compressed = useMemo(() => {
    return encodeSDP(value);
  }, [value]);
  return (
    <div
      css={css({
        display: 'flex',
        justifyContent: 'center',
      })}
    >
      <QRCode value={compressed} title={title} />
    </div>
  );
};

export default QrGenerator;
