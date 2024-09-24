import * as lodash from 'lodash';
export class SqLiteDialect {
    getForeignKeysQuery(tableName, schemaName) {
        return "PRAGMA foreign_key_list(" + tableName + ");";
    }
    isPrimaryKey(record) {
        return lodash.isObject(record) && lodash.has(record, 'primaryKey') && record.primaryKey === true;
    }
}
//# sourceMappingURL=dialect.sqlite.js.map