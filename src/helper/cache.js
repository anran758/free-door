const { cache } = require('../config/defaultConfig');

function refreshRes(stats, res) {
    const { maxAge, expires, cacheControl, lastModified, etag } = cache;

    if (expires) {
        res.setHeader('expires', (new Date(Date.now() + maxAge * 1000)))
    }

    if (cacheControl) {
        res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    }

    if (lastModified) {
        res.setHeader('Last-Modified', stats.mtime.toUTCString())
    }

    if (etag) {
        res.setHeader('ETag', `${stats.size}-${stats.mtime}`);
    }
}

module.exports = function isFresh(stats, req, res) {
    refreshRes(stats, res);


    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];

    // console.log('req.headers:', !lastModified && !etag, lastModified && lastModified !== res.getHeader('Last-Modified'), etag && etag !== res.getHeader('ETag'));

    // 没有缓存
    if (!lastModified && !etag) return false;


    // 缓存失效
    if (lastModified && lastModified !== res.getHeader('Last-Modified')) return false;

    // ETag 失效
    if (etag && etag !== res.getHeader('ETag')) return false;

    return true;
}
