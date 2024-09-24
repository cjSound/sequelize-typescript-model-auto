"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFactory = exports.getAbsolutePath = exports.addInStr = void 0;
const ferreiro_core_1 = require("./ferreiro-core");
function addInStr(str, index, string) {
    if (index > 0)
        return str.substring(0, index) + string + str.substring(index, str.length);
    else
        return string + str;
}
exports.addInStr = addInStr;
;
function getAbsolutePath(folderPath, rootFolder /*, baseFolder = os.hostname()*/) {
    let srt = '';
    for (let i = 0; i < folderPath.length; i++) {
        if (folderPath[i] !== rootFolder[i]) {
            srt += folderPath[i] === '\\' ? '/' : folderPath[i];
        }
    }
    if (srt[0] !== '/') {
        srt = addInStr(srt, 0, '/');
    }
    return srt;
}
exports.getAbsolutePath = getAbsolutePath;
exports.initFactory = ((opts) => {
    return new Promise((resolve, reject) => {
        const initFunc = (err, inst) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(inst);
            }
        };
        new ferreiro_core_1.FerreiroCore(Object.assign({}, opts), initFunc);
    });
});
//# sourceMappingURL=util.js.map