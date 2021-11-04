/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { Result } from '@zxing/library';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

export interface Props {
  onResult: (result: Result) => void;
}

const QrcodeReader = ({ onResult }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  useEffect(() => {
    const f = async () => {
      if (!videoRef.current) {
        return;
      }
      const codeReader = new BrowserQRCodeReader();
      await codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, error, controls) => {
        if (error) {
          return;
        }
        if (result) {
          onResult(result);
        }
        controlsRef.current = controls;
      });
    };
    f().catch((e) => {
      console.log(e);
    });
    return () => {
      if (!controlsRef.current) {
        return;
      }
      controlsRef.current.stop();
      controlsRef.current = null;
    };
  }, [onResult]);
  return (
    <div
      css={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        background: 'rgba(0,0,0,0.7)',
        zIndex: 10,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      })}
    >
      <video
        ref={videoRef}
        css={css({
          width: 400,
          height: 600,
          maxWidth: '100%',
          maxHeight: '100%',
        })}
      />
    </div>
  );
};

export default QrcodeReader;
