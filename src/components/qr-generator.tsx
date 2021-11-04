import React, { useMemo } from 'react';
import pako from 'pako';
import QRCode from 'react-qr-code';

export interface Props {
  title: string;
  value: string;
}

const QrGenerator = ({ value, title }: Props) => {
  const compressed = useMemo(() => {
    const t = pako.deflate(value, { level: 9 });
    return String.fromCharCode.apply(null, Array.from(t));
  }, [value]);
  return <QRCode value={compressed} title={title} />;
};

export default QrGenerator;
