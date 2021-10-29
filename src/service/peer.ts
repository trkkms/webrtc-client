export default class PeerService {
  private peer?: RTCPeerConnection;

  start() {
    if (this.peer !== undefined) {
      console.warn('peer connection already exists. close existing one');
      this.peer.close();
    }
    const peer = new RTCPeerConnection({ iceServers: [] });
    this.peer = peer;
  }
  close() {
    if (this.peer === undefined) {
      console.warn('peer connection does not exist.');
      return;
    }
    this.peer.close();
    this.peer = undefined;
  }
  async startLocalAudio() {
    if (this.peer === undefined) {
      console.warn('No peer connection established');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.peer as any).addStream(stream);
    } catch (e) {
      console.error('ERROR: cannot open local audio:', e);
    }
  }
}
