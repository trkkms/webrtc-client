import { Logger } from '../util/types';

export interface PeerEventEmitters {
  onReceiveOffer: (sdp: RTCSessionDescription) => void;
  onReceiveAnswer: (sdp: RTCSessionDescription) => void;
  setVolume: (volume: number) => void;
}

export default class PeerService {
  private peer?: RTCPeerConnection;
  private tuner?: AudioTuner;
  constructor(private logger: Logger) {}
  preparePeer(): RTCPeerConnection {
    if (this.peer !== undefined) {
      this.logger('peer connection already exists. close existing one', 'warn');
      this.peer.close();
    }
    this.peer = new RTCPeerConnection({ iceServers: [] });
    return this.peer;
  }
  async createOfferPeer(
    onTrack: (stream: MediaStream) => void,
    onSDP: (sdp: RTCSessionDescription | null) => void,
  ): Promise<void> {
    const peer = this.preparePeer();
    peer.ontrack = (evt) => {
      onTrack(evt.streams[0]);
    };
    peer.onicecandidate = (evt) => {
      if (!evt.candidate) {
        onSDP(peer.localDescription);
      }
    };
  }
  async createOffer(): Promise<void> {
    if (this.peer === undefined) {
      return;
    }
    const description = await this.peer.createOffer();
    await this.peer.setLocalDescription(description);
    this.logger('setLocalDescription() succeeded.');
  }
  async receiveOffer(offer: RTCSessionDescription): Promise<void> {
    if (this.peer === undefined) {
      return;
    }
    await this.peer.setRemoteDescription(offer);
    this.logger('Received Offer, creating an answer.');
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);
  }
  async receiveAnswer(answer: RTCSessionDescription): Promise<void> {
    if (this.peer === undefined) {
      this.logger('The connection has not been created on receiveAnswer()', 'error');
      return;
    }
    await this.peer.setRemoteDescription(answer);
    this.logger('Received Answer. creating connection...');
  }
  onConnect(f: (peer?: RTCPeerConnection) => void) {
    if (this.peer === undefined) {
      return;
    }
    this.peer.onconnectionstatechange = () => {
      if (this.peer) {
        this.logger(this.peer.connectionState);
      }
      f(this.peer);
    };
  }
  close() {
    if (this.peer === undefined) {
      this.logger('peer connection does not exist.', 'warn');
      return;
    }
    this.peer.close();
    this.peer = undefined;
  }
  addLocalStream(base: MediaStream): (volume: number) => void {
    if (this.tuner === undefined) {
      this.tuner = new AudioTuner();
    }
    const [stream, setVolume] = this.tuner.createTunableMedia(base);
    this.peer?.addTrack(stream.getTracks()[0]);
    return setVolume;
  }
}

class AudioTuner {
  private context: AudioContext = new AudioContext();
  createTunableMedia(base: MediaStream): [stream: MediaStream, setVolume: (volume: number) => void] {
    const source = this.context.createMediaStreamSource(base);
    const dest = this.context.createMediaStreamDestination();
    const gainNode = this.context.createGain();
    source.connect(gainNode);
    gainNode.connect(dest);
    gainNode.gain.setValueAtTime(1.0, this.context.currentTime);
    return [
      dest.stream,
      (volume) => {
        gainNode.gain.setValueAtTime(volume, this.context.currentTime);
      },
    ];
  }
}
