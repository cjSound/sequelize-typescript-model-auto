"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConnection = exports.buildEnv = void 0;
const dotenv = __importStar(require("dotenv"));
const path_1 = require("path");
const ferreiro_core_1 = require("../ferreiro-core");
function buildEnv() {
    console.log(`buildEnv: ` + path_1.join(process.cwd(), process.argv[5].replace('--', '')));
    const result = dotenv.config({
        path: path_1.join(process.cwd(), process.argv[5].replace('--', ''))
    });
    if (result.error) {
        console.log('Def env variables.');
        throw result.error;
    }
}
exports.buildEnv = buildEnv;
exports.initConnection = ((opts) => {
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
//# sourceMappingURL=init.tests.js.map