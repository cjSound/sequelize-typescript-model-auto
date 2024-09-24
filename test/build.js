const sequelizeAuto = require('../lib');
const { join } = require('path');
console.log("🚀 ~ sequelizeAuto:", sequelizeAuto)
sequelizeAuto.default({
  camel: true,
  dialect: 'mysql',
  database: 'test',
  host: '119.29.11.225',
  overwriteFile: true,
  output: '',
  pass: 'cjManager1',
  port: 3306,
  // skipTables: [],
  storage: undefined,
  // tables: ['profissional'/*, 'servico_faturamento', 'paciente', 'ocorrencia'*/],
  user: 'root',
  debug: false,
  outDir: join(process.cwd(), 'buil-gen'),
});
