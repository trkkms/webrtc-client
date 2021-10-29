import React, { useState } from 'react';

const Provider = ({ children }: { children: React.ReactElement }) => {
  const [ws, setWS] = useState<WebSocket>();
  const [peer, setPeer] = useState<RTCPeerConnection>();
  return <>{children}</>;
};

export default Provider;
