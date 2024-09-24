import * as _ from 'lodash';
export class MySqlDialect {
    getForeignKeysQuery(tableName, schemaName) {
        return "SELECT \
        K.CONSTRAINT_NAME as constraint_name \
      , K.CONSTRAINT_SCHEMA as source_schema \
      , K.TABLE_SCHEMA as source_table \
      , K.COLUMN_NAME as source_column \
      , K.REFERENCED_TABLE_SCHEMA AS target_schema \
      , K.REFERENCED_TABLE_NAME AS target_table \
      , K.REFERENCED_COLUMN_NAME AS target_column \
      , C.extra \
      , C.COLUMN_KEY AS column_key \
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS K \
      LEFT JOIN INFORMATION_SCHEMA.COLUMNS AS C \
        ON C.TABLE_NAME = K.TABLE_NAME AND C.COLUMN_NAME = K.COLUMN_NAME \
      WHERE \
        K.TABLE_NAME = '" + tableName + "' \
        AND K.CONSTRAINT_SCHEMA = '" + schemaName + "';";
    }
    isForeignKey(record) {
        return _.isObject(record) && _.has(record, 'extra') && record.extra !== "auto_increment";
    }
    isPrimaryKey(record) {
        return _.isObject(record) && _.has(record, 'constraint_name') && record.constraint_name === "PRIMARY";
    }
    isUnique(record) {
        return _.isObject(record) && _.has(record, 'column_key') && record.column_key.toUpperCase() === "UNI";
    }
    isSerialKey(record) {
        return _.isObject(record) && _.has(record, 'extra') && record.extra === "auto_increment";
    }
}
//# sourceMappingURL=dialect.mysql.js.map