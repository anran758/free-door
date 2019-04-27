const { createGzip, createDeflate } = require('zlib');

module.exports = (rs, req, res) => {
    // 允许的压缩方式
    const acceptEncoding = req.headers['accept-encoding'];

    // 不允许压缩或者服务器没有所支持的压缩方法
    if (!acceptEncoding || acceptEncoding.match(/\b(gizp|defalate)\b/)) return rs;

    if (acceptEncoding.match(/\bgzip\b/)) {
        res.setHeader('Content-Encoding', 'gzip');
        return rs.pipe(createGzip());
    }

    if (acceptEncoding.match(/\bdeflate\b/)) {
        res.setHeader('Content-Encoding', 'deflate');
        return rs.pipe(createDeflate());
    }
}
