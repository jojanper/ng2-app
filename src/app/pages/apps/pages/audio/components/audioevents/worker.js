self.onmessage = event => {
  if (event.data.decode) {
    console.log('DATA RECEIVED');
    //self.postMessage(decoded, decoded.channelData);
  }
}
