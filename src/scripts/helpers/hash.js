function arbuf2hex(buffer) {
    var hexCodes = [];
    var view = new DataView(buffer);
    for (var i = 0; i < view.byteLength; i += 4) {
        var value = view.getUint32(i)
        var stringValue = value.toString(16)
        var padding = '00000000'
        var paddedValue = (padding + stringValue).slice(-padding.length)
        hexCodes.push(paddedValue);
    }

    return hexCodes.join("");
}

function sha256(hexstr, callback) {
    var buffer = new Uint8Array(hexstr.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }));
    return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
        let result = arbuf2hex(hash);
        callback(result);
    });
}