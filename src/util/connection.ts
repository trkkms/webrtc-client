import { useCallback, useEffect, useState } from 'react';

export interface PreparePeerArgs {
  playRemoteAudio: (stream: MediaStream) => void;
  sendSDP: (description: RTCSessionDescription | null) => void;
  localStream: MediaStream | null;
}

const preparePeer = ({ playRemoteAudio, sendSDP, localStream }: PreparePeerArgs): RTCPeerConnection => {
  const config = { iceServers: [] };
  const peer = new RTCPeerConnection(config);
  peer.ontrack = (evt) => {
    playRemoteAudio(evt.streams[0]);
  };
  peer.onicecandidate = (evt) => {
    if (!evt.candidate) {
      sendSDP(peer.localDescription);
    }
  };
  if (localStream) {
    for (const track of localStream.getTracks()) {
      peer.addTrack(track);
    }
  }

  return peer;
};

export interface UseWebRTCArgs {
  playRemoteAudio: (stream: MediaStream | null) => void;
}

export const useWebRTC = ({ playRemoteAudio }: UseWebRTCArgs) => {
  const [ws, setWS] = useState<WebSocket>();
  const [peer, setPeer] = useState<RTCPeerConnection>();
  const [localStream, setLocalStream] = useState<MediaStream>();
  useEffect(() => {
    const f = async () => {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    };
    f().then((stream) => {
      setLocalStream(stream);
    });
  }, []);
  const sendMessage = useCallback(
    (message: string) => {
      if (ws) {
        ws.send(message);
      }
    },
    [ws],
  );
  const sendSDP = useCallback(
    (sdp: RTCSessionDescription | null) => {
      if (sdp) {
        sendMessage(JSON.stringify(sdp));
      }
    },
    [ws],
  );
  const onOffer = useCallback((offer: RTCSessionDescription) => {
    const peer = preparePeer({ sendSDP, localStream: null, playRemoteAudio: () => {} });
    setPeer(peer);
  }, []);
  const onAnswer = useCallback(
    (answer: RTCSessionDescription) => {
      peer?.setRemoteDescription(answer);
    },
    [peer],
  );
  const onStartWebsocket = useCallback(
    (url: string) => {
      const ws = new WebSocket(url);
      ws.onopen = () => {
        console.log('Websocket OPEN');
      };
      ws.onerror = (err) => {
        console.log('Websocket ERROR:', err);
      };
      ws.onmessage = (evt) => {
        console.log('Websocket MESSAGE:', evt.data);
        const message = JSON.parse(evt.data);
        switch (message.type) {
          case 'offer': {
            console.log('WebRTC OFFER received');
            onOffer(new RTCSessionDescription(message));
            return;
          }
          case 'answer': {
            console.log('Websocket ANSWER received');
            onAnswer(new RTCSessionDescription(message));
            return;
          }
          default: {
            console.error('Websocket ERROR: Invalid Websocket Message Received.');
          }
        }
      };
      setWS(ws);
    },
    [peer],
  );

  useEffect(() => {
    if (ws) {
      ws.close();
    }
  }, [ws]);
};
