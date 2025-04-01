import pg from 'pg';
import { 
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE
 } from './config.js';

export const pool = new pg.Pool({
  connectionString: process.env.DB_URL,
  // ssl:  true,
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT

  });

  // poll.query('SELECT NOW()')
  //   .then(result => {
  //   console.log(result);
  // })  
 

