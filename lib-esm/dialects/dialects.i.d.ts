export interface DialectFunctions {
    /**
     * Generates an SQL query that returns all foreign keys of a table.
     *
     * @param  {String} tableName  The name of the table.
     * @param  {String} schemaName The name of the schema.
     * @return {String}            The generated sql query.
     */
    getForeignKeysQuery: (tableName: any, schemaName: any) => string;
    /**
   * Determines if record entry from the getForeignKeysQuery
   * results is an actual foreign key
   *
   * @param {Object} record The row entry from getForeignKeysQuery
   * @return {Bool}
   */
    isForeignKey?: (record: any) => boolean;
    /**
    * Determines if record entry from the getForeignKeysQuery
    * results is an actual primary key
    *
    * @param {Object} record The row entry from getForeignKeysQuery
    * @return {Bool}
    */
    isPrimaryKey: (record: any) => boolean;
    /**
   * Determines if record entry from the getForeignKeysQuery
   * results is a unique key
   *
   * @param {Object} record The row entry from getForeignKeysQuery
   * @return {Bool}
   */
    isUnique?: (record: any) => boolean;
    /**
    * Determines if record entry from the getForeignKeysQuery
    * results is an actual serial/auto increment key
    *
    * @param {Object} record The row entry from getForeignKeysQuery
    * @return {Bool}
    */
    isSerialKey?: (record: any) => boolean;
    /**
    * Overwrites Sequelize's native method for showing all tables.
    * This allows custom schema support
    * @param {String} schema The schema to list all tables from
    * @return {String}
    */
    showTablesQuery?: (schema: any) => string;
}
