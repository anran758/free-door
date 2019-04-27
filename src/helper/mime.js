const path = require('path')

const mimeTypes = {
    "txt": "text/plain",
    "xml": "text/xml",
    "html": "text/html",
    "css": "text/css",
    "js": "text/javascript",
    "json": "application/json",
    "gif": "image/gif",
    "png": "image/png",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "svg": "image/svg+xml",
    "ico": "image/x-icon",
    "pdf": "application/pdf",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv"
};

module.exports = (filePath) => {
    let ext = path.extname(filePath)
        .split('.')
        .pop()
        .toLocaleLowerCase();

    if (!ext) {
        ext = filePath;
    }

    return mimeTypes[ext] || mimeTypes['txt'];
}
