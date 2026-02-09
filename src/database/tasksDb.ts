import mysql from "mysql2/promise";
import { TasksController } from "src/auth/tasks.contrller";
const tasksDb = mysql.createPool({
  host: "localhost",
  user: "root",
  password: '',
  database: "tasks_db",
});

export default tasksDb;
