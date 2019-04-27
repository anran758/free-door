const http = require('http');
const chalk = require('chalk');
const path = require('path');

const conf = require('./config/defaultConfig');
const route = require('./helper/router');
const openUrl = require('./helper/openUrl.js');

class Server {
    constructor(config) {
        this.config = Object.assign({}, conf, config)
    }

    start() {
        const server = http.createServer((req, res) => {
            const filePath = path.join(this.config.root, req.url);

            route(req, res, filePath, this.config);
        })

        server.listen(this.config.port, this.config.hostname, () => {
            const addr = `http://${this.config.hostname}:${this.config.port}`;
            console.info(`server stared at ${chalk.green(addr)}`);
            openUrl(addr);
        })
    }
}

module.exports = Server;
