const mariadb = require("mysql2/promise");
// import mariadb from "mysql2/promise";
// const connection = async () => {
//   const conn = await mariadb.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
//     dateStrings: true,
//   });
//   return conn;
// };

const connection = mariadb.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  dateStrings: true,
});

module.exports = connection;
