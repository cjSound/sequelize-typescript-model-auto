"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_tests_1 = require("./init.tests");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const fs_1 = require("fs");
const path_1 = require("path");
let tableInf;
mocha_1.describe('Configurer', () => {
    mocha_1.beforeEach(async () => {
        init_tests_1.buildEnv();
        const nySeqAuto = await init_tests_1.initConnection({
            camel: true,
            dialect: process.env.dialect,
            database: process.env.database,
            host: process.env.host,
            overwriteFile: true,
            output: '',
            pass: process.env.pass,
            port: process.env.port,
            schema: process.env.schema,
            //skipTables: [],
            storage: undefined,
            //tables: [],
            user: process.env.user,
            debug: true,
            template: path_1.join(process.cwd(), 'templates'),
            outDir: ''
        });
        tableInf = await nySeqAuto.mapTable();
    });
    mocha_1.describe('Test Show Tables', () => {
        it('should run test and invoke hooks', (done) => {
            console.log(tableInf);
            fs_1.writeFileSync('tableinf.json', JSON.stringify(tableInf, null, 2));
            chai_1.expect(tableInf).to.be.an('array');
            done();
        });
    });
});
//# sourceMappingURL=show.maptable.test.js.map