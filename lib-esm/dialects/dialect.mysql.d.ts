import { DialectFunctions } from "./dialects.i";
export declare class MySqlDialect implements DialectFunctions {
    getForeignKeysQuery(tableName: any, schemaName: any): string;
    isForeignKey(record: any): boolean;
    isPrimaryKey(record: any): boolean;
    isUnique(record: any): boolean;
    isSerialKey(record: any): boolean;
}
