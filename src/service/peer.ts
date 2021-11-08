import { Logger } from '../util/types';

export default class PeerService {
  private peer?: RTCPeerConnection;
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
    if ('ontrack' in peer) {
      peer.ontrack = (evt) => {
        onTrack(evt.streams[0]);
      };
    } else {
      // eslint-disable-next-line
      (peer as any).onaddstream = (evt: { stream: MediaStream }) => {
        onTrack(evt.stream);
      };
    }

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
  addLocalStream(stream: MediaStream): void {
    if (this.peer === undefined) {
      this.logger('no peer found on addLocalStream()', 'error');
      return;
    }
    if ('addStream' in this.peer) {
      // eslint-disable-next-line
      (this.peer as any).addStream(stream);
    } else {
      for (const track of stream.getTracks()) {
        this.peer.addTrack(track);
      }
    }
    return;
  }
}
