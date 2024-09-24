import { DialectFunctions } from "./dialects.i";
export declare class PostgresDialect implements DialectFunctions {
    getForeignKeysQuery(tableName: any, schemaName: any): string;
    isForeignKey(record: any): boolean;
    isPrimaryKey(record: any): boolean;
    isUnique(record: any): boolean;
    isSerialKey(record: any): boolean;
    showTablesQuery(schema: any): string;
}
