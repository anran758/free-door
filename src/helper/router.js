const fs = require('fs');
const path = require('path');
const Handlebars = require('Handlebars');
const promisify = require('util').promisify;
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString())

module.exports = async function(req, res, filePath, config) {
    try {
        const stats = await stat(filePath);

        if (stats.isFile()) {
            const contentType = mime(filePath);

            // 读取文件
            res.setHeader('Content-Type', contentType);

            if (isFresh(stats, req, res)) {
                res.statusCode = 304;
                res.end();

                return;
            }

            let rs;
            const { code, start, end } = range(stats.size, req, res);
            if (code === 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filePath);
            } else {
                res.statusCode = 206;
                rs = fs.createReadStream(filePath, { start, end });
            }

            // 使用流的方式进行读写
            if (filePath.match(config.compress)) {
                rs = compress(rs, req, res);
            }
            rs.pipe(res);

        } else if (stats.isDirectory()) {
            // 读取文件夹下的文件列表
            const files = await readdir(filePath);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const dir = path.relative(config.root, filePath)
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files
            }
            res.end(template(data))
        }
    } catch (err) {
        console.error(err);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory of file \n ${err}`);
    }

}
