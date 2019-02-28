describe('Web Worker', () => {
    let worker;

    beforeEach(() => {
        console.log('WORKER');
        worker = new Worker('/base/src/app/pages/apps/pages/audio/worker/worker.js');
        console.log(worker);
    });

    afterEach(() => {
        if (worker) {
            worker.terminate();
        }
    });

    it('fails', (done) => {
        worker.onerror = (err) => {
            err.preventDefault();
            console.log(err.message);
            expect(err).toBeDefined();
            done();
        };
        worker.postMessage({decode: []});
    });
});
