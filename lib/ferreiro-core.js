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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FerreiroCore = exports.TableInformation = exports.TableField = exports.KeyField = void 0;
const Sequelize = __importStar(require("sequelize"));
const dialect_sqlite_1 = require("./dialects/dialect.sqlite");
const dialect_mysql_1 = require("./dialects/dialect.mysql");
const dialect_postgres_1 = require("./dialects/dialect.postgres");
const _ = __importStar(require("lodash"));
const fs_1 = require("fs");
const path_1 = require("path");
const Handlebars = __importStar(require("handlebars"));
const camelcase_1 = __importDefault(require("camelcase"));
const util_1 = require("./util");
class KeyField {
}
exports.KeyField = KeyField;
class TableField {
}
exports.TableField = TableField;
class TableInformation {
}
exports.TableInformation = TableInformation;
class FerreiroCore {
    constructor({ host, database, user, pass, port, output = undefined, dialect, tables = undefined, skipTables = undefined, camel, overwriteFile = undefined, schema = undefined, debug }, callbackConnection) {
        console.log("🚀 ~ dialect:", dialect);
        if (debug) {
            console.table(Object.assign({}, arguments[0]));
        }
        const sequelizeOpts = {};
        if (dialect === 'sqlite') {
            sequelizeOpts.storage = database;
        }
        sequelizeOpts.dialect = dialect;
        sequelizeOpts.host = host;
        sequelizeOpts.port = port;
        sequelizeOpts.logging = debug;
        if (!schema) {
            schema = 'public';
        }
        switch (dialect) {
            case 'sqlite':
                this.queryInterface = new dialect_sqlite_1.SqLiteDialect();
                break;
            case 'mysql':
                this.queryInterface = new dialect_mysql_1.MySqlDialect();
                break;
            case 'postgres':
                this.queryInterface = new dialect_postgres_1.PostgresDialect();
                break;
        }
        if (database instanceof Sequelize.Sequelize) {
            this.db = database;
        }
        else {
            this.db = new Sequelize.Sequelize(database, user, pass, sequelizeOpts || {});
            this.db.authenticate().then(rs => {
                if (callbackConnection)
                    callbackConnection(undefined, this);
            }).catch(err => {
                if (callbackConnection)
                    callbackConnection(err, undefined);
            });
        }
        this.opts = Object.assign({}, arguments[0]);
    }
    get isMySql() {
        return this.opts.dialect === 'mysql';
    }
    get isPg() {
        return this.opts.dialect === 'postgres';
    }
    get isSqlite() {
        return this.opts.dialect === 'sqlite';
    }
    /**
     * Return all tables
     */
    async showTables() {
        let showTablesQuery;
        if (this.isPg && this.opts.schema) {
            const showTables = this.queryInterface.showTablesQuery(this.opts.schema);
            showTablesQuery = await this.db.query(showTables, {
                raw: true,
                type: Sequelize.QueryTypes.SHOWTABLES
            });
            return _.flatten(showTablesQuery);
        }
        else {
            showTablesQuery = await this.db.getQueryInterface().showAllTables();
            return showTablesQuery;
        }
    }
    /* async describeTable(tableName) {
         creturn await this.db.getQueryInterface().describeTable(tableName);
     }*/
    /**
     * Get table foreign keys
     */
    async mapTable() {
        let tableInfos = [];
        let tables = await this.showTables();
        if (this.opts.tables) {
            tables = _.intersection(tables, this.opts.tables);
        }
        else if (this.opts.skipTables) {
            tables = _.difference(tables, this.opts.skipTables);
        }
        //console.log(tables);
        for (const table of tables) {
            const sql = this.queryInterface.getForeignKeysQuery(table, this.opts.database);
            const tableInf = await this.db.query(sql, {
                raw: true,
                type: Sequelize.QueryTypes.SELECT
            });
            const tableDescrible = await this.db.getQueryInterface().describeTable(table);
            if (this.isPg) {
                try {
                    const pgIdentity = await this.db.query(`SELECT
                is_identity, identity_generation, column_name
             FROM
                information_schema.COLUMNS
             WHERE
                TABLE_NAME = '${table}' and is_identity = 'YES';`, {
                        raw: true,
                        type: Sequelize.QueryTypes.SELECT
                    });
                    if (pgIdentity && pgIdentity.length) {
                        tableDescrible[pgIdentity[0].column_name].isIdentity = true;
                        tableDescrible[pgIdentity[0].column_name].identity = pgIdentity[0].identity_generation;
                    }
                }
                catch (error) {
                    console.warn(`Pg < 10.0 identity_generation not implemented`);
                }
            }
            let foreignKeyList = [];
            for (const field in tableDescrible) {
                const findTab = tableInfos.find(el => el.tablename === table);
                const fkField = tableInf.filter(el => el.source_column === field);
                const foreignKey = fkField.find(el => this.queryInterface.isForeignKey && this.queryInterface.isForeignKey(el) && el.target_table !== null);
                //writeFileSync(`testee/test_${table}_${field}.json`, JSON.stringify(fkField));
                let fieldItem = Object.assign(Object.assign({}, tableDescrible[field]), { name: field, isForeignKey: this.queryInterface.isForeignKey ? fkField.findIndex(el => this.queryInterface.isForeignKey(el) && el.target_table !== null) !== -1 : false, isPrimaryKey: this.queryInterface.isPrimaryKey ? fkField.findIndex(el => this.queryInterface.isPrimaryKey(el)) !== -1 : false, isUniqueKey: this.queryInterface.isUnique ? fkField.findIndex(el => this.queryInterface.isUnique(el)) !== -1 : false, isSerialKey: this.queryInterface.isSerialKey ? fkField.findIndex(el => this.queryInterface.isSerialKey(el)) !== -1 : false, foreignKey, serialKey: fkField.find(el => this.queryInterface.isSerialKey && this.queryInterface.isSerialKey(el)), uniqueKey: fkField.find(el => this.queryInterface.isUnique && this.queryInterface.isUnique(el)) });
                if (!findTab) {
                    tableInfos.push({
                        tablename: table,
                        fields: [fieldItem],
                        foreignKeys: foreignKey ? [foreignKey] : []
                    });
                }
                else {
                    findTab.fields.push(fieldItem);
                    if (foreignKey) {
                        findTab.foreignKeys.push(foreignKey);
                    }
                }
            }
        }
        console.log("🚀 ~ mapTable ~ tableInfos:", JSON.stringify(tableInfos));
        return tableInfos;
    }
    async build() {
        const dbData = await this.mapTable();
        //writeFileSync('tableinf.json', JSON.stringify(dbData, null, 2));
        const files = this.compileTemplateDir();
        this.processFiles(files, dbData);
    }
    compileTemplateDir(dirPath = this.opts.template, files = []) {
        const stat = fs_1.lstatSync(dirPath);
        if (stat.isFile()) {
            files.push(path_1.join(dirPath));
            return files;
        }
        const dirLs = fs_1.readdirSync(dirPath);
        for (const dir of dirLs) {
            const stat = fs_1.lstatSync(path_1.join(dirPath, dir));
            if (stat.isDirectory()) {
                this.compileTemplateDir(path_1.join(dirPath, dir), files);
            }
            else {
                //this.processFileTemplate(join(dirPath, dir), dbData);
                files.push(path_1.join(dirPath, dir));
            }
        }
        return files;
    }
    getExtension(path) {
        if (path === undefined || path === null) {
            return "";
        }
        var basename = path.split(/[\\/]/).pop(), // extract file name from full path ...
        // (supports `\\` and `/` separators)
        pos = basename.lastIndexOf("."); // get last position of `.`
        if (basename === "" || pos < 1) // if file name is empty or ...
            return ""; //  `.` not found (-1) or comes first (0)
        return basename.slice(pos + 1); // extract extension ignoring `.`
    }
    processDefaultHelpers() {
        Handlebars.registerHelper('upper', function (string) {
            return string.toUpperCase();
        });
        Handlebars.registerHelper('lower', function (string) {
            return string.toLowerCase();
        });
        Handlebars.registerHelper('exists', function (val) {
            return val !== undefined && val !== null;
        });
        Handlebars.registerHelper('raw-helper', function (options) {
            return options.fn();
        });
        Handlebars.registerHelper('keys', function (obj) {
            return Object.keys(obj);
        });
        Handlebars.registerHelper('camelcase', function (string, pascalCase = true) {
            return camelcase_1.default(string, { pascalCase: pascalCase === true });
        });
        Handlebars.registerHelper('date', function (format) {
            return new Date();
        });
        Handlebars.registerHelper('negate', function (format) {
            return !format;
        });
        Handlebars.registerHelper('ifequal', function (comp1, comp2) {
            return comp1 === comp2;
        });
        Handlebars.registerHelper('arrayContainString', function (arr, value) {
            return arr.findIndex(el => el === value) !== -1;
        });
    }
    generateEsModules(imports) {
        let importsStr = [];
        for (const importItem in imports) {
            let str = `import { ${imports[importItem].join(', ')} } from '${importItem}';`;
            importsStr.push(str);
        }
        return importsStr.join('\n');
    }
    processFiles(files, dbData) {
        const hbsFiles = files.filter(el => this.getExtension(el).toLowerCase() === 'hbs');
        const scriptsFile = files.filter(el => this.getExtension(el).toLowerCase() === 'js');
        const configFile = files.find(el => this.getExtension(el).toLowerCase() === 'json');
        this.processDefaultHelpers();
        let importsConfig = {};
        let enterData = {};
        if (configFile) {
            const jsonConfig = require(configFile);
            importsConfig = jsonConfig.imports;
            enterData = jsonConfig.data;
        }
        //let imports: any = {};
        let filesImports = {};
        let lastUnicalName = undefined;
        let vars = {};
        Handlebars.registerHelper('getData', function (prefix, unicalName, sufix) {
        });
        Handlebars.registerHelper('fileName', function (unicalName) {
            const args = [...arguments];
            unicalName = unicalName + (args.length > 2 ? args.map((el, index) => {
                if (index > 0 && (_.isString(el) || _.isNumber(el)) && el !== undefined && el !== null) {
                    return el;
                }
            }).join('') : '');
            if (!filesImports[unicalName]) {
                filesImports[unicalName] = {};
                lastUnicalName = unicalName;
            }
            return unicalName;
        });
        Handlebars.registerHelper('set', function (name, value) {
            const args = [...arguments];
            vars[name + lastUnicalName] = value + (args.length > 3 ? args.map((el, index) => {
                if (index > 1 && (_.isString(el) || _.isNumber(el)) && el !== undefined && el !== null) {
                    return el;
                }
            }).join('') : '');
            return '';
        });
        Handlebars.registerHelper('get', function (name, value) {
            return vars[name + lastUnicalName];
        });
        Handlebars.registerHelper('import', function (importItem) {
            if (!lastUnicalName) {
                throw new Error('Please init filename to import item ... filename [prefix name sufix]');
            }
            const imports = filesImports[lastUnicalName];
            for (const item in importsConfig) {
                //  console.log(item);
                const findName = importsConfig[item].find(el => importItem === el);
                if (findName) {
                    if (imports[item]) {
                        if (imports[item].findIndex((el) => el === importItem) === -1) {
                            imports[item].push(findName);
                        }
                    }
                    else {
                        imports[item] = [findName];
                    }
                    return findName;
                } /*else {
                    return importItem;
                }*/
            }
            //console.warn(`Failed to import ${importItem}`);
            return importItem;
        });
        for (const scriptFile of scriptsFile) {
            const jsScript = require(scriptFile);
            jsScript(Handlebars);
        }
        //for (const data of dbData) {
        let genCount = 0;
        console.log(`Loaded ${dbData.length} tables of db ${this.opts.database}`);
        console.log(`Loaded ${configFile} config file`);
        console.log(`Loaded ${scriptsFile.length} script file(s)`);
        console.log(`Find ${hbsFiles.length} file(s) in ${this.opts.template} template.`);
        //writeFileSync('test.json', JSON.stringify(dbData));
        for (const hbsFile of hbsFiles) {
            const str = fs_1.readFileSync(hbsFile).toString('utf-8');
            try {
                const template = Handlebars.compile(str);
                /* console.log(JSON.stringify({
                     tableData: dbData,
                     data: enterData,
                     getId: () => lastUnicalName
                 }))*/
                const templateBuild = template({
                    tableData: dbData,
                    data: enterData,
                    getId: () => lastUnicalName
                });
                const beginFiles = templateBuild.split('#begin_file');
                for (const templateStr of beginFiles) {
                    if (templateStr === '') {
                        continue;
                    }
                    const lines = templateStr.split('\n');
                    const destPath = path_1.join(this.opts.outDir, util_1.getAbsolutePath(path_1.dirname(hbsFile), this.opts.template));
                    if (!fs_1.existsSync(destPath)) {
                        fs_1.mkdirSync(destPath, { recursive: true });
                    }
                    if (lines[1].indexOf(`/`) !== -1 && !fs_1.existsSync(path_1.join(destPath, path_1.dirname(lines[1])))) {
                        fs_1.mkdirSync(path_1.join(destPath, path_1.dirname(lines[1])), { recursive: true });
                    }
                    genCount++;
                    if (!this.opts.overwriteFile && fs_1.existsSync(path_1.join(destPath, lines[1]))) {
                        console.error(`Fail generate ${path_1.join(destPath, lines[1])} file already exixts (--overwriteFile is false)`);
                        continue;
                    }
                    fs_1.writeFileSync(path_1.join(destPath, lines[1].replace(/(\r\n|\n|\r)/gm, "")), this.generateEsModules(filesImports[lines[1]]) +
                        lines.reduce((prev, curr, index) => {
                            if (index > 1) {
                                return prev + curr + '\n';
                            }
                            else {
                                return "";
                            }
                        }, ''), {
                        encoding: 'utf-8',
                        flag: 'w'
                    });
                }
            }
            catch (error) {
                console.error(`Error to compile template ${hbsFile}`);
                throw error;
            }
        }
        console.log(`Generated ${genCount} file(s) in ${this.opts.outDir}.`);
        process.exit(0);
    }
}
exports.FerreiroCore = FerreiroCore;
//# sourceMappingURL=ferreiro-core.js.map