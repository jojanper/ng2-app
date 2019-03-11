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

    it('fails', (done) => {
        worker.onerror = (err) => {
            err.preventDefault();
            expect(err).toBeDefined();
            done();
        };
        worker.postMessage({config: {mime: 'audio/wav'}});
        worker.postMessage({decode: []});
    });

    it('unsupported mime type', (done) => {
        worker.onmessage = (event) => {
            expect(event.data.error).toEqual('Unsupported mime type foo');
            done();
        };
        worker.postMessage({config: {mime: 'foo'}});
    });
});
