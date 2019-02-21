export interface PlaybackState {
    state: string;
}

export interface DecodedData {
    channelData: Array<Float32Array>;
    length: number;
    numChannels: number;
    sampleRate: number;
}
