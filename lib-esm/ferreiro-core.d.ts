import * as Sequelize from "sequelize";
import { DialectFunctions } from "./dialects/dialects.i";
export interface Options {
    host: string;
    database: string | Sequelize.Sequelize;
    user: string;
    pass: string;
    port: number;
    output: string;
    dialect: 'postgres' | 'mysql' | 'sqlite';
    tables?: string[];
    skipTables?: string[];
    camel: boolean;
    overwriteFile: boolean;
    schema: string;
    storage: string;
    debug: boolean;
    template: string;
    outDir: string;
    customDataFn?: (data: TableInformation[]) => TableInformation[];
}
export declare class KeyField {
    constraint_name: string;
    source_schema: string;
    source_table: string;
    source_column: string;
    target_schema: string;
    target_table: string;
    target_column: string;
    extra: string;
    column_key: string;
}
export declare class TableField {
    type: string;
    allowNull: boolean;
    defaultValue: string;
    comment: string;
    special: any[];
    primaryKey: boolean;
    isForeignKey: boolean;
    isPrimaryKey: boolean;
    isUniqueKey: boolean;
    isSerialKey: boolean;
    isIdentity: boolean;
    identity: string;
    name: string;
    foreignKey: KeyField;
    uniqueKey: KeyField;
    serialKey: KeyField;
}
export declare class TableInformation {
    tablename: string;
    fields: TableField[];
    foreignKeys: KeyField[];
}
export declare class FerreiroCore {
    db: Sequelize.Sequelize;
    queryInterface: DialectFunctions;
    opts: Options;
    constructor({ host, database, user, pass, port, output, dialect, tables, skipTables, camel, overwriteFile, schema, debug }: Options, callbackConnection?: (err: any, instance: FerreiroCore) => void);
    get isMySql(): boolean;
    get isPg(): boolean;
    get isSqlite(): boolean;
    /**
     * Return all tables
     */
    showTables(): Promise<any>;
    /**
     * Get table foreign keys
     */
    mapTable(): Promise<TableInformation[]>;
    build(): Promise<void>;
    compileTemplateDir(dirPath?: string, files?: string[]): string[];
    getExtension(path: any): string;
    processDefaultHelpers(): void;
    generateEsModules(imports: (keys: string) => string[]): string;
    processFiles(files: string[], dbData: TableInformation[]): void;
}
