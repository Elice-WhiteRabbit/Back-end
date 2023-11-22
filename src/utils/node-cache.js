const NodeCache = require('node-cache');

const authCodeCache = new NodeCache();

module.exports = authCodeCache;