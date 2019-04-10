describe('Audio web worker', () => {
    let worker;

    beforeEach(() => {
        worker = new Worker('/base/src/app/pages/apps/pages/audio/worker/worker.js');
    });

    afterEach(() => {
        if (worker) {
            worker.terminate();
        }
    });

    it('decoding fails', (done) => {
        // GIVEN PCM decoder has been initialized
        worker.postMessage({config: {mime: 'audio/pcm'}});

        worker.onerror = (err) => {
            // THEN decoding should fail
            err.preventDefault();
            expect(err).toBeDefined();
            done();
        };

        // WHEN invalid data is sent to PCM decoder
        worker.postMessage({decode: []});
    });

    it('unsupported mime type', (done) => {
        worker.onmessage = (event) => {
            // THEN error message should be received
            expect(event.data.error).toEqual('Unsupported mime type foo');
            done();
        };

        // GIVEN invalid mime type has been specified for the codec
        const config = {config: {mime: 'foo'}};

        // WHEN initializing decoder
        worker.postMessage(config);
    });

    it('decoder init data is set', (done) => {
        worker.onmessage = (event) => {
            // THEN message should be sent to indicate successfull initialization
            expect(event.data.config.sampleRate).toEqual(48000);
            expect(event.data.config.numberOfChannels).toEqual(2);
            done();
        };

        // GIVEN PCM decoder configuration data
        const config = {config: {mime: 'audio/pcm', samplerate: 48000, channels: 2}};

        // WHEN initializing the decoder
        worker.postMessage(config);
    });
});
