function MohayonaoReader(dataView) {
    this.view = dataView;
    this.pos = 0;
  }

  MohayonaoReader.prototype.remain = function() {
    return this.view.byteLength - this.pos;
  },

  MohayonaoReader.prototype.skip = function(n) {
    this.pos += n;
  },

  MohayonaoReader.prototype.uint8 = function() {
    const data = this.view.getUint8(this.pos, true);
    this.pos += 1;
    return data;
  },

  MohayonaoReader.prototype.int16 = function() {
    const data = this.view.getInt16(this.pos, true);
    this.pos += 2;
    return data;
  },

  MohayonaoReader.prototype.uint16 = function() {
    const data = this.view.getUint16(this.pos, true);
    this.pos += 2;
    return data;
  },

  MohayonaoReader.prototype.uint32 = function() {
    const data = this.view.getUint32(this.pos, true);
    this.pos += 4;
    return data;
  },

  MohayonaoReader.prototype.string = function(n) {
    let data = "";
    for (let i = 0; i < n; i++) {
      data += String.fromCharCode(this.uint8());
    }
    return data;
  },

  MohayonaoReader.prototype.pcm8 = function() {
    const data = this.view.getUint8(this.pos) - 128;
    this.pos += 1;
    return data < 0 ? data / 128 : data / 127;
  },

  MohayonaoReader.prototype.pcm8s = function() {
    const data = this.view.getUint8(this.pos) - 127.5;
    this.pos += 1;
    return data / 127.5;
  },

  MohayonaoReader.prototype.pcm16 = function() {
    const data = this.view.getInt16(this.pos, true);
    this.pos += 2;
    return data * 0.000030518;
    //return data < 0 ? data / 32768 : data / 32767;
  },

  MohayonaoReader.prototype.pcm16s = function() {
    const data = this.view.getInt16(this.pos, true);
    this.pos += 2;
    return data / 32768;
  },

  MohayonaoReader.prototype.pcm24 = function() {
    let x0 = this.view.getUint8(this.pos + 0);
    let x1 = this.view.getUint8(this.pos + 1);
    let x2 = this.view.getUint8(this.pos + 2);
    let xx = (x0 + (x1 << 8) + (x2 << 16));
    let data = xx > 0x800000 ? xx - 0x1000000 : xx;
    this.pos += 3;
    return data < 0 ? data / 8388608 : data / 8388607;
  },

  MohayonaoReader.prototype.pcm24s = function() {
    let x0 = this.view.getUint8(this.pos + 0);
    let x1 = this.view.getUint8(this.pos + 1);
    let x2 = this.view.getUint8(this.pos + 2);
    let xx = (x0 + (x1 << 8) + (x2 << 16));
    let data = xx > 0x800000 ? xx - 0x1000000 : xx;
    this.pos += 3;
    return data / 8388608;
  },

  MohayonaoReader.prototype.pcm32 = function() {
    const data = this.view.getInt32(this.pos, true);
    this.pos += 4;
    return data < 0 ? data / 2147483648 : data / 2147483647;
  },

  MohayonaoReader.prototype.pcm32s = function() {
    const data = this.view.getInt32(this.pos, true);
    this.pos += 4;
    return data / 2147483648;
  },

  MohayonaoReader.prototype.pcm32f = function() {
    const data = this.view.getFloat32(this.pos, true);
    this.pos += 4;
    return data;
  },

  MohayonaoReader.prototype.pcm64f = function() {
    const data = this.view.getFloat64(this.pos, true);
    this.pos += 8;
    return data;
  }

class Decoder {
    constructor() {
        this.readerMeta = null;
    }

    decode(arrayBuffer) {
        const dataView = new DataView(arrayBuffer);

        const reader = new MohayonaoReader(dataView);
        if (!this.readerMeta) {
            this.init(reader);
        }

        const blockSize = this.readerMeta.blockSize;
        const numChannels = this.readerMeta.numberOfChannels;
        const sampleRate = this.readerMeta.sampleRate;

        //console.log(blockSize, numChannels, sampleRate);

        const chunkSize = reader.remain();

        let length = Math.floor(chunkSize / blockSize);
        let channelData = new Array(numChannels);

        for (let ch = 0; ch < numChannels; ch++) {
            channelData[ch] = new Float32Array(length);
        }

        const read = reader[this.readerMeta.readerMethodName].bind(reader);

        //let pos = 0;
        for (let i = 0; i < length; i++) {
            for (let ch = 0; ch < numChannels; ch++) {
                //const data = dataView.getInt16(pos);
                //channelData[ch][i] = data < 0 ? data / 32768 : data / 32767;
                //channelData[ch][i] = dataView.getInt16(pos) / 32768;
                //pos += 2;
                //pos++;

                channelData[ch][i] = read();
            }
        }

        //console.log('DONE Reading', length, chunkSize, pos);

        return {
            channelData: channelData.map(arr => arr.buffer),
            length,
            numChannels,
            sampleRate
        };
    }

    init(reader) {
        if (reader.string(4) !== "RIFF") {
          throw new TypeError("Invalid WAV file");
        }

        reader.uint32(); // skip file length

        if (reader.string(4) !== "WAVE") {
          throw new TypeError("Invalid WAV file");
        }

        let dataFound = false, chunkType, chunkSize;

        do {
          chunkType = reader.string(4);
          chunkSize = reader.uint32();

          switch (chunkType) {
          case "fmt ":
            this.readerMeta = this.decodeMetaInfo(reader, chunkSize);
            if (this.readerMeta instanceof Error) {
              throw this.readerMeta;
            }
            break;
          case "data":
            dataFound = true;
            break;
          default:
            reader.skip(chunkSize);
            break;
          }
        } while (!dataFound);

    }

    decodeMetaInfo(reader, chunkSize) {
        const formats = {
          0x0001: "lpcm",
          0x0003: "lpcm"
        };

        const formatId = reader.uint16();

        if (!formats.hasOwnProperty(formatId)) {
            return new TypeError("Unsupported format in WAV file: 0x" + formatId.toString(16));
        }

        const meta = {
          formatId,
          floatingPoint: formatId === 0x0003,
          numberOfChannels: reader.uint16(),
          sampleRate: reader.uint32(),
          byteRate: reader.uint32(),
          blockSize: reader.uint16(),
          bitDepth: reader.uint16(),
          readerMethodName: null
        };
        reader.skip(chunkSize - 16);

        const decoderOption = meta.floatingPoint ? "f" : "";
        meta.readerMethodName = "pcm" + meta.bitDepth + decoderOption;

        if (!reader[meta.readerMethodName]) {
          return new TypeError("Not supported bit depth: " + meta.bitDepth);
        }
        return meta;
    }
}

const decoder = new Decoder();

self.onmessage = event => {
    if (event.data.decode) {
      console.log('DATA RECEIVED');
      const decoded = decoder.decode(event.data.decode);
      //decoded.channelData = decoded.channelData.map(arr => arr.buffer);
      self.postMessage(decoded, decoded.channelData);
    }
}
