export class VoiceChat {
    constructor(socket, localPlayerId) {
        this.socket = socket;
        this.localPlayerId = Number(localPlayerId);
        this.peers = new Map();
        this.localStream = null;
        this.muted = false;
        this.enabled = false;
        this.remoteAudio = new Map();
        this.iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
    }

    async start() {
        if (this.enabled) return true;
        if (!navigator.mediaDevices?.getUserMedia) {
            this.showStatus('Voice chat is not supported here.');
            return false;
        }
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            this.enabled = true;
            this.updateButton();
            this.showStatus('🎤 Voice chat enabled');
            return true;
        } catch (error) {
            console.error('[VoiceChat] microphone error', error);
            this.showStatus('Microphone permission was denied.');
            return false;
        }
    }

    async connectToPlayer(playerId) {
        playerId = Number(playerId);
        if (!this.enabled || playerId === this.localPlayerId || this.peers.has(playerId)) return;
        // The lower player id creates the offer. This prevents both sides from offering at once.
        if (this.localPlayerId < playerId) {
            const pc = this.createPeer(playerId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            this.signal(playerId, { type: 'offer', sdp: pc.localDescription });
        }
    }

    createPeer(playerId) {
        const pc = new RTCPeerConnection({ iceServers: this.iceServers });
        this.peers.set(playerId, pc);

        if (this.localStream) {
            for (const track of this.localStream.getTracks()) pc.addTrack(track, this.localStream);
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) this.signal(playerId, { type: 'candidate', candidate: event.candidate });
        };

        pc.ontrack = (event) => {
            let audio = this.remoteAudio.get(playerId);
            if (!audio) {
                audio = document.createElement('audio');
                audio.autoplay = true;
                audio.playsInline = true;
                audio.dataset.voicePlayer = playerId;
                document.body.appendChild(audio);
                this.remoteAudio.set(playerId, audio);
            }
            audio.srcObject = event.streams[0];
            audio.play().catch(() => {});
        };

        pc.onconnectionstatechange = () => {
            if (['failed', 'closed', 'disconnected'].includes(pc.connectionState)) {
                this.closePeer(playerId);
            }
        };
        return pc;
    }

    signal(targetPlayerId, signal) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'voice.signal',
                target_player_id: Number(targetPlayerId),
                signal
            }));
        }
    }

    async handleSignal(senderId, signal) {
        senderId = Number(senderId);
        if (!this.enabled || senderId === this.localPlayerId) return;

        let pc = this.peers.get(senderId);
        if (signal.type === 'offer') {
            if (!pc) pc = this.createPeer(senderId);
            await pc.setRemoteDescription(signal.sdp);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            this.signal(senderId, { type: 'answer', sdp: pc.localDescription });
        } else if (signal.type === 'answer') {
            if (pc) await pc.setRemoteDescription(signal.sdp);
        } else if (signal.type === 'candidate') {
            if (pc) {
                try { await pc.addIceCandidate(signal.candidate); } catch (e) {}
            }
        }
    }

    toggleMute() {
        if (!this.localStream) return;
        this.muted = !this.muted;
        this.localStream.getAudioTracks().forEach(track => track.enabled = !this.muted);
        this.updateButton();
        this.showStatus(this.muted ? '🔇 Muted' : '🎤 Unmuted');
    }

    closePeer(playerId) {
        const pc = this.peers.get(Number(playerId));
        if (pc) pc.close();
        this.peers.delete(Number(playerId));
        const audio = this.remoteAudio.get(Number(playerId));
        if (audio) audio.remove();
        this.remoteAudio.delete(Number(playerId));
    }

    stop() {
        for (const id of this.peers.keys()) this.closePeer(id);
        this.localStream?.getTracks().forEach(track => track.stop());
        this.localStream = null;
        this.enabled = false;
    }

    updateButton() {
        const btn = document.getElementById('voiceChatBtn');
        if (btn) btn.textContent = !this.enabled ? '🎤 Voice' : (this.muted ? '🔇 Unmute' : '🎤 Mute');
    }

    showStatus(message) {
        const el = document.getElementById('voiceStatus');
        if (!el) return;
        el.textContent = message;
        clearTimeout(this.statusTimer);
        this.statusTimer = setTimeout(() => el.textContent = '', 2200);
    }
}
