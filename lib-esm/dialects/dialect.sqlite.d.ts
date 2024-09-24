import { DialectFunctions } from "./dialects.i";
export declare class SqLiteDialect implements DialectFunctions {
    getForeignKeysQuery(tableName: any, schemaName: any): string;
    isPrimaryKey(record: any): boolean;
}
