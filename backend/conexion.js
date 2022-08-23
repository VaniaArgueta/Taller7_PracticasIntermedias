import mysql from "mysql";
var config = {
  host: "localhost",
  user: "root",
  password: "",
  database: "intermedias",
  port: 3306,
};
const conn = new mysql.createConnection(config);

export default conn;
