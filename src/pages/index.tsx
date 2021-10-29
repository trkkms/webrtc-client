import React, { useCallback, useRef } from 'react';
import Provider from '../components/provider';
import WebsocketStarter from '../components/websocket-starter';

const Index = () => {
  const ref = useRef<HTMLAudioElement>(null);
  const playRemoteAudio = useCallback((stream: MediaStream | null) => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
    if (ref.current && stream) {
      ref.current.volume = 0.5;
      ref.current.play().catch((e) => {
        console.error('play ERROR', e);
      });
    }
  }, []);
  return (
    <Provider>
      <main>
        <h1>WebRTC Example</h1>
        <WebsocketStarter onWebsocketStart={() => {}} />
        <audio ref={ref} autoPlay />
      </main>
    </Provider>
  );
};

export default Index;
