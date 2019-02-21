import { Observable } from 'rxjs';

import { PlaybackState, DecodedData } from './interfaces';
import { AppObservableObject, NumberValueObserver } from '../../../../../../utils/base';


export const PlaybackStates = {
    PLAY: 'play',
    PAUSE: 'pause'
};

class PlaybackStateObserver extends AppObservableObject<PlaybackState> {
    setPlay(): void {
        this.setObject({state: PlaybackStates.PLAY});
    }

    setPause(): void {
        this.setObject({state: PlaybackStates.PAUSE});
    }
}

/**
 * Buffer collection container for audio chunks. Handles internal re-buffering
 * in case audio duration drops below buffering threshold.
 */
export class AudioRenderBuffers {
    // Audio duration of the buffers
    private duration = 0;

    // Status of the buffering; true if buffers can be consumed, false otherwise
    private canConsume = false;

    // Audio buffers
    private buffers: Array<AudioBuffer>;

    // Buffering threshold in seconds
    private durationThr: number;

    // End of stream flag
    private eos = false;

    /**
     * @param bufferDuration Minimum buffered audio duration, in seconds.
     */
    constructor(bufferDuration: number) {
        this.buffers = [];
        this.durationThr = bufferDuration;
    }

    /**
     * Include new audio buffer for internal buffering.
     *
     * @param audioBuffer Audio chunk data for playback.
     */
    addBuffer(audioBuffer: AudioBuffer) {
        this.duration += audioBuffer.duration;
        this.buffers.push(audioBuffer);

        // Can the internal buffers be consumed at this point?
        this.canConsume = this.duration > this.durationThr;
    }

    /**
     * Return audio buffer for playback. Return value null indicates that no audio
     * is available for playback.
     */
    getBuffer() {
        if (!this.buffering) {
            const buffer = this.buffers.shift();
            this.duration -= buffer.duration;
            return buffer;
         }

         return null;
    }

    /**
     * Set end-of-stream, no more audio buffers are to be added.
     */
    setEndOfStream() {
        this.eos = true;
    }

    /**
     * Return true if re-buffering state is enabled, false otherwise.
     */
    get buffering(): boolean {
        if (this.eos) {
            return !(this.buffers.length > 0);
        }

        return (this.canConsume && this.buffers.length > 0) ? false : true;
    }
}

export class AudioRenderer {
    private stateObserver = new PlaybackStateObserver();
    private posObserver = new NumberValueObserver();
    private buffers: AudioRenderBuffers;
    private audioCtx: AudioContext;
    private audioSrcNodes: Array<AudioBufferSourceNode> = [];
    private nodesEnded = 0;
    private nodesCreated = 0;
    private playPos = 0;
    private playStartedAt = 0;
    private eos = false;

    constructor(bufferDuration: number) {
        this.buffers = new AudioRenderBuffers(bufferDuration);
        this.audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();
    }

    get stateObservable(): Observable<PlaybackState> {
        return this.stateObserver.asPipe();
    }

    get posObservable(): Observable<number> {
        return this.posObserver.asPipe();
    }

    /**
     * Signal end of stream.
     */
    setEndOfStream() {
        this.eos = true;
        this.buffers.setEndOfStream();
        this.flush();
    }

    /**
     * Add new audio data for rendering.
     */
    scheduleRender({channelData, length, numChannels, sampleRate}: DecodedData) {
        const audioBuffer = this.audioCtx.createBuffer(numChannels, length, sampleRate);

        for (let c = 0; c < numChannels; c++) {
            if (audioBuffer.copyToChannel) {
                audioBuffer.copyToChannel(channelData[c], c);
            } else {
                const toChannel = audioBuffer.getChannelData(c);
                for (let i = 0; i < channelData[c].byteLength; i++) {
                    toChannel[i] = channelData[c][i];
                }
            }
        }

        this.buffers.addBuffer(audioBuffer);
        this.flush();
    }

    /**
     * Send all available audio buffers for playback.
     */
    flush() {
        let audioBuffer = this.buffers.getBuffer();
        while (audioBuffer) {
            this.scheduleAudioBuffer(audioBuffer);
            audioBuffer = this.buffers.getBuffer();
        }
    }

    /**
     * Return true if audio is playing, false otherwise.
     */
    get isPlaying(): boolean {
        return this.audioCtx.state === 'running';
    }

    /**
     * Return true if audio is paused, false otherwise.
     */
    get isPause(): boolean {
        return this.audioCtx.state === 'suspended';
    }

    /**
     * Close audio rendering and related resources.
     */
    close() {
        if (this.audioCtx) {
            this.audioCtx.close();
        }

        this.stateObserver.closeSubject();
        this.posObserver.closeSubject();
    }

    /**
     * Switch playback state.
     * 'stateObserver' property status is changed accordingly.
     */
    async togglePlayback() {
        if (this.isPlaying) {
            await this.audioCtx.suspend();
            this.stateObserver.setPause();
        } else if (this.isPause) {
            await this.audioCtx.resume();
            this.stateObserver.setPlay();
        }
    }

    /**
     * System has finished playing specified audio buffer.
     */
    private onAudioNodeEnded(audioBuffer) {
        this.audioSrcNodes.shift();
        this.nodesEnded++;

        this.playPos = this.playPos + audioBuffer.duration;
        this.posObserver.setObject(this.playPos);

        const nodesLeft = this.nodesCreated - this.nodesEnded;
        if (!this.eos && nodesLeft === 0 && this.buffers.buffering) {
            this.playStartedAt = 0;
        }
    }

    /**
     * Add new audio buffer for playback.
     */
    private scheduleAudioBuffer(audioBuffer) {
        const audioSrc = this.audioCtx.createBufferSource();

        // Ensure onended callback is fired in Safari
        if (window['webkitAudioContext']) {
            this.audioSrcNodes.push(audioSrc);
        }

        // Initialize first play position, introduce some delay to ensure smooth playback
        if (!this.playStartedAt) {
            const startDelay = (this.audioCtx.baseLatency || 128 / this.audioCtx.sampleRate);
            this.playStartedAt = this.audioCtx.currentTime + audioBuffer.duration + startDelay;
        }

        audioSrc.onended = () => this.onAudioNodeEnded(audioBuffer);
        audioSrc.buffer = audioBuffer;
        audioSrc.connect(this.audioCtx.destination);
        audioSrc.start(this.playStartedAt);
        this.playStartedAt += audioBuffer.duration;
        this.nodesCreated++;
    }
}
