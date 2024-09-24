"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_tests_1 = require("./init.tests");
const path_1 = require("path"); /*
(async () => {
    buildEnv();
const nySeqAuto = await initConnection({
    camel: true,
    dialect: process.env.dialect as any,
    database: process.env.database as any,
    host: process.env.host as any,
    noWrite: true,
    output: '',
    pass: process.env.pass,
    port: process.env.port as any,
    schema: process.env.schema as any,
   // skipTables: [],
    storage: undefined,
   // tables: [],
    user: process.env.user,
    debug: true,
    template: join(process.cwd(), 'templates'),
    outDir: join(process.cwd(), 'buil-gen')
});

await nySeqAuto.build();
})();

*/
let showTables;
describe('Configurer', function () {
    this.enableTimeouts(false);
    beforeEach(async () => {
        init_tests_1.buildEnv();
        console.log(111, process.env.dialect);
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
            // skipTables: [],
            storage: undefined,
            // tables: ['profissional'/*, 'servico_faturamento', 'paciente', 'ocorrencia'*/],
            user: process.env.user,
            debug: false,
            template: path_1.join(process.cwd(), 'templates'),
            outDir: path_1.join(process.cwd(), 'buil-gen')
        });
        await nySeqAuto.build();
    });
    describe('Test Show Tables', () => {
        it('should run test and invoke hooks', (done) => {
            done();
        });
    });
});
//# sourceMappingURL=build.compile.test.js.map