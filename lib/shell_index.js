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
const program = __importStar(require("commander"));
const dotenv = __importStar(require("dotenv"));
const util_1 = require("./util");
const path_1 = require("path");
const fs_1 = require("fs");
program
    .option('--genenv', 'Generate env file in root path')
    .option('--dialect', 'Select dialect postgres, mysql or mssql')
    .option('--database <name>', 'Name of database')
    .option('--schema <schema name>', 'schema')
    .option('--host <host>', 'Host of database')
    .option('--port <port>', 'Port number')
    .option('--user  <host>', 'User of database')
    .option('--pw', 'Password of database')
    .option('--env  <path>', 'User of database')
    .option('--tables <table1, table2, ...>', 'tables  of db')
    .option('--skipTables <table1, table2, ...>', 'skip tables of db')
    .option('--template <path>', 'path of template generate files')
    .option('--overwriteFile <true|false (default false)>', 'overwrite file in out dir')
    .option('--dbug <true|false>', 'Show dbug logs')
    .option('--outDir <path>', 'path of generated files');
program.parse(process.argv);
if (program.genenv) {
    fs_1.writeFileSync(path_1.join(process.cwd(), '.env-gen'), `#FERREIRO ENV VARIABLES\ndialect = [postgres, mysql, mssql or sqlite]
database = [...name of database]
host = 127.0.0.1
pass = [..pass]
port = [..set a port]
schema = [..schema only in pg]
user = [..set user]`);
    console.log(`Env generated in ${path_1.join(process.cwd(), '.env-gen')} OK`);
    process.exit(1);
}
(async () => {
    let database = program.env.database;
    let dialect = program.env.dialect;
    let schema = program.env.schema;
    let host = program.env.host;
    let port = program.env.port;
    let user = program.env.user;
    let pw = program.env.pw;
    if (program.env) {
        const result = dotenv.config({
            path: program.env
        });
        if (result.error) {
            console.log(`It was not possible to find the environment configuration file ${program.env}.`);
            throw result.error;
        }
        database = process.env.database;
        dialect = process.env.dialect;
        schema = process.env.schema;
        host = process.env.host;
        port = process.env.port;
        user = process.env.user;
        pw = process.env.pass;
    }
    const nySeqAuto = await util_1.initFactory({
        dialect: dialect,
        database: database,
        host: host,
        pass: pw,
        schema: schema,
        port: port,
        user: user,
        camel: true,
        overwriteFile: program.overwriteFile ? program.overwriteFile === 'true' : false,
        output: '',
        skipTables: program.skipTables ? program.skipTables.split(',') : [],
        storage: undefined,
        tables: program.tables ? program.tables.split(',') : undefined,
        debug: program.dbug ? program.dbug === 'true' : false,
        template: path_1.resolve(program.template),
        outDir: path_1.resolve(program.outDir)
    });
    await nySeqAuto.build();
})();
//# sourceMappingURL=shell_index.js.map