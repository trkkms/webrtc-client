/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { css } from '@emotion/react';
import QRCode from 'react-qr-code';
import { encodeSDP } from '../util/encode';

export interface Props {
  title: string;
  value: string;
  part: 1 | 2;
}

const QrGenerator = ({ value, title, part }: Props) => {
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
      <QRCode
        value={part === 1 ? compressed.substring(0, Math.floor(part / 2)) : compressed.substring(Math.floor(part / 2))}
        title={title}
      />
    </div>
  );
};

export default QrGenerator;
