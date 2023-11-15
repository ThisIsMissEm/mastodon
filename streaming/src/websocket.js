// @ts-check

const Websocket = require('ws');

class MastodonWebsocket extends Websocket {
  constructor(address, protocols, options) {
    super(address, protocols, options);

    // Logger for the WebSocket connection
    this.log = null;

    // Handle keep-alive state for the websocket:
    this.isAlive = true;

    this.on('open', () => this.isAlive = true);
    this.on('pong', () => this.isAlive = true);
    this.on('close', () => this.isAlive = false);
  }

  checkLiveliness() {
    if (this.readyState === Websocket.OPEN) {
      if (this.isAlive === false) {
        this.terminate();
      } else {
        this.isAlive = false;
        this.ping('', false);
      }
    }
  }
}

module.exports = MastodonWebsocket;
