/* eslint-disable no-bitwise */

export class DataReader {
    constructor(dataView) {
        this.view = dataView;
        this.pos = 0;
    }

    remain() {
        return this.view.byteLength - this.pos;
    }

    skip(n) {
        this.pos += n;
    }

    uint8() {
        const data = this.view.getUint8(this.pos, true);
        this.pos += 1;
        return data;
    }

    int16() {
        const data = this.view.getInt16(this.pos, true);
        this.pos += 2;
        return data;
    }

    uint16() {
        const data = this.view.getUint16(this.pos, true);
        this.pos += 2;
        return data;
    }

    uint32() {
        const data = this.view.getUint32(this.pos, true);
        this.pos += 4;
        return data;
    }

    string(n) {
        let data = '';
        for (let i = 0; i < n; i++) {
            data += String.fromCharCode(this.uint8());
        }

        return data;
    }

    pcm8() {
        const data = this.view.getUint8(this.pos) - 128;
        this.pos += 1;
        return data < 0 ? data / 128 : data / 127;
    }

    pcm8s() {
        const data = this.view.getUint8(this.pos) - 127.5;
        this.pos += 1;
        return data / 127.5;
    }

    pcm16() {
        const data = this.view.getInt16(this.pos, true);
        this.pos += 2;
        return data < 0 ? data / 32768 : data / 32767;
    }

    pcm16s() {
        const data = this.view.getInt16(this.pos, true);
        this.pos += 2;
        return data / 32768;
    }

    pcm24() {
        const x0 = this.view.getUint8(this.pos + 0);
        const x1 = this.view.getUint8(this.pos + 1);
        const x2 = this.view.getUint8(this.pos + 2);
        const xx = (x0 + (x1 << 8) + (x2 << 16));
        const data = xx > 0x800000 ? xx - 0x1000000 : xx;
        this.pos += 3;
        return data < 0 ? data / 8388608 : data / 8388607;
    }

    pcm24s() {
        const x0 = this.view.getUint8(this.pos + 0);
        const x1 = this.view.getUint8(this.pos + 1);
        const x2 = this.view.getUint8(this.pos + 2);
        const xx = (x0 + (x1 << 8) + (x2 << 16));
        const data = xx > 0x800000 ? xx - 0x1000000 : xx;
        this.pos += 3;
        return data / 8388608;
    }

    pcm32() {
        const data = this.view.getInt32(this.pos, true);
        this.pos += 4;
        return data < 0 ? data / 2147483648 : data / 2147483647;
    }

    pcm32s() {
        const data = this.view.getInt32(this.pos, true);
        this.pos += 4;
        return data / 2147483648;
    }

    pcm32f() {
        const data = this.view.getFloat32(this.pos, true);
        this.pos += 4;
        return data;
    }

    pcm64f() {
        const data = this.view.getFloat64(this.pos, true);
        this.pos += 8;
        return data;
    }
}
