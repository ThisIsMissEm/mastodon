// @ts-check

const EventEmitter = require('events');
const http = require('http');

class EventStream extends EventEmitter {
  #request;
  #response;
  #keepAliveTimer;
  #messageId = 0;

  /**
   *
   * @param {http.IncomingMessage} request
   * @param {http.ServerResponse} response
   */
  constructor(request, response) {
    super();

    this.send = this.send.bind(this);

    this.#messageId = 0;

    this.#request = request;
    this.#response = response;

    this.readyState = 'CONNECTING';

    request.socket.setTimeout(0);
    response.socket?.setTimeout(0);
    response.socket?.setNoDelay();

    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control','no-cache, no-transform');
    response.setHeader('Connection','keep-alive');
    response.setHeader('Keep-Alive','timeout=60');
    response.setHeader('Transfer-Encoding', 'chunked');
    response.writeHead(200);

    response.write(':)\n\n');

    this.#keepAliveTimer = setInterval(() => {
      if (this.readyState === 'OPEN') {
        this.#response.write(': ping\n\n');
      }
    }, 30000);

    this.isAlive = false;

    this.#request.on('close', () => {
      this.readyState = 'CLOSED';
      clearInterval(this.#keepAliveTimer);
      this.emit("close");
    });


    // this.#response.setHeader('x-accel-buffering', 'no');

    this.isAlive = true;
    this.readyState = 'OPEN';
    this.emit('open', this.#request);
  }

  send(event, data) {
    if (this.readyState === 'OPEN') {
      this.#response.write(`id: ${this.#messageId++}\n`);
      this.#response.write(`event: ${event}\n`);
      this.#response.write(`data: ${data}\n\n`);
    }
  }
}

module.exports = EventStream;
