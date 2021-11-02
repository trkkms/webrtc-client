import React from 'react';
import QRCode from 'react-qr-code';

export interface Props {
  title: string;
  value: string;
}

const QrGenerator = ({ value, title }: Props) => {
  return <QRCode value={value} title={title} />;
};

export default QrGenerator;
