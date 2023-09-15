import { join } from "path";
import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";

dotenv.config();
const modelBasename = join(__dirname, "..", "models", "*.model");

export const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dialect: "mysql",
  models: [`${modelBasename}.ts`, `${modelBasename}.js`],
  modelMatch: (filename, member) => {
    return filename.substring(0, filename.indexOf(".model")) === member;
  },
});

export const connectDB = async () => {
  await sequelize.authenticate();
  console.log("✅ Connected to database");
  await sequelize.sync({ force: true });
  console.log("✅ Database synced");
};
