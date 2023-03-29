import 'reflect-metadata';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const MySQLDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: ['dist/entity/**/*.js'],
  migrations: [],
  subscribers: [],
  namingStrategy: new SnakeNamingStrategy(),
  /**
   * namingStrategy
   * : Naming strategy to be used to name tables and columns in the DB.
   */
});
