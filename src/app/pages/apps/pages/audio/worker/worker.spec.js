describe('Web Worker', () => {
    let worker;

    beforeEach(() => {
        worker = new Worker('/base/src/app/pages/apps/pages/audio/worker/worker.js');
    });

    it('fails', (done) => {
        worker.onerror = (err) => {
            expect(err).toBeDefined();
            done();
        };
        worker.postMessage({decode: []});
    });
});
