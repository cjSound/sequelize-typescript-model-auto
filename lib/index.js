"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
exports.default = async (options) => {
    const nySeqAuto = await util_1.initFactory(options);
    await nySeqAuto.build();
};
//# sourceMappingURL=index.js.map