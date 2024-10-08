import * as _ from 'lodash';
export class PostgresDialect {
    getForeignKeysQuery(tableName, schemaName) {
        return 'SELECT \
      o.conname AS constraint_name, \
      (SELECT nspname FROM pg_namespace WHERE oid=m.relnamespace) AS source_schema, \
      m.relname AS source_table, \
      (SELECT a.attname FROM pg_attribute a WHERE a.attrelid = m.oid AND a.attnum = o.conkey[1] AND a.attisdropped = false) AS source_column, \
      (SELECT nspname FROM pg_namespace WHERE oid=f.relnamespace) AS target_schema, \
      f.relname AS target_table, \
      (SELECT a.attname FROM pg_attribute a WHERE a.attrelid = f.oid AND a.attnum = o.confkey[1] AND a.attisdropped = false) AS target_column, \
      o.contype, \
      (SELECT \'\' AS extra FROM pg_catalog.pg_attribute a LEFT JOIN pg_catalog.pg_attrdef d ON (a.attrelid, a.attnum) = (d.adrelid,  d.adnum) \ WHERE NOT a.attisdropped AND a.attnum > 0 AND a.attrelid = o.conrelid AND a.attnum = o.conkey[1]\ LIMIT 1) \
    FROM pg_constraint o \
    LEFT JOIN pg_class c ON c.oid = o.conrelid \
    LEFT JOIN pg_class f ON f.oid = o.confrelid \
    LEFT JOIN pg_class m ON m.oid = o.conrelid \
    WHERE o.conrelid = (SELECT oid FROM pg_class WHERE relname = \'' + tableName + '\' LIMIT 1)';
    }
    isForeignKey(record) {
        return _.isObject(record) && _.has(record, 'contype') && record.contype === "f";
    }
    isPrimaryKey(record) {
        return _.isObject(record) && _.has(record, 'contype') && record.contype === "p";
    }
    isUnique(record) {
        return _.isObject(record) && _.has(record, 'contype') && record.contype === "u";
    }
    isSerialKey(record) {
        return _.isObject(record) && this.isPrimaryKey(record) && (_.has(record, 'extra') &&
            _.startsWith(record.extra, 'nextval')
            && _.includes(record.extra, '_seq')
            && _.includes(record.extra, '::regclass'));
    }
    showTablesQuery(schema) {
        return "SELECT table_name FROM information_schema.tables WHERE table_schema = '" + schema + "' AND table_type LIKE '%TABLE' AND table_name != 'spatial_ref_sys';";
    }
}
//# sourceMappingURL=dialect.postgres.js.map