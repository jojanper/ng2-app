const express = require('express');
const serveStatic = require('serve-static-throttle')
const cors = require('cors');


const PORT = 3600;
const THROTTLE = {bps: 384 * 384};

const app = express();
app.use(cors());
app.use(serveStatic('.', {throttle: THROTTLE}))

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
