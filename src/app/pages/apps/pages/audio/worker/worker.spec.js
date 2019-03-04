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
        worker.postMessage({decode: []});
    });
});
