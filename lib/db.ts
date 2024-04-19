import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  host: process.env.PGSQL_HOST,
  port: Number(process.env.PGSQL_PORT),
  user: process.env.PGSQL_USER,
  password: process.env.PGSQL_PASSWORD,
  database: process.env.PGSQL_DB,
});

export async function getFromDB(table: string, options: { id?: string, email?: string } = {}) {
  try {
    let rows;
    if (options.id) {
      const { rows } = await pool.query(`SELECT * FROM "${table}" WHERE id = $1`,[options.id]);
      const item = rows[0];
      return NextResponse.json(item);
    } else if (options.email) {
      const { rows } = await pool.query(`SELECT * FROM "${table}" WHERE email = $1`,[options.email]);
      const item = rows[0];
      return NextResponse.json(item);
    } else {
      const result = await pool.query(`SELECT * FROM "${table}"`);
      rows = result.rows
      return NextResponse.json(rows);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function postToDB(table: string, columns: string[], values: any[]) {
  const columnsString = columns.join(', ');
  const valuesPlaceholders = values.map((_, index) => `$${index + 1}`).join(', ');

  try {
    const { rows } = await pool.query(
      `INSERT INTO "${table}" (${columnsString}) VALUES (${valuesPlaceholders}) RETURNING *`,
      values
    );
    const item = rows[0];

    return NextResponse.json(`${table} inserido: ` + JSON.stringify(item));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}


export async function getFromDBTeste(table: string, options: { id?: string, email?: string } = {}) {
  try {
    let rows;
    if (options.id) {
      const { rows } = await pool.query(`SELECT * FROM "${table}" WHERE id = $1`,[options.id]);
      const item = rows[0];
      return item;
    } else if (options.email) {
      const { rows } = await pool.query(`SELECT * FROM "${table}" WHERE email = $1`,[options.email]);
      const item = rows[0];
      return item;
    } else {
      const result = await pool.query(`SELECT * FROM "${table}"`);
      rows = result.rows
      return rows;
    }
  } catch (err) {
    console.error(err);
    return err;
  }
}