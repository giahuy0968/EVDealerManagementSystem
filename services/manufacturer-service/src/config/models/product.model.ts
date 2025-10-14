import { pool } from '../config/database'

export interface Product {
  id?: string
  model_name: string
  version?: string
  color?: string
  base_price: number
  created_at?: Date
  updated_at?: Date
}

export class ProductModel {
  static async getAll(): Promise<Product[]> {
    const res = await pool.query('SELECT * FROM products ORDER BY created_at DESC')
    return res.rows
  }

  static async getById(id: string): Promise<Product | null> {
    const res = await pool.query('SELECT * FROM products WHERE id = $1', [id])
    return res.rows[0] || null
  }

  static async create(data: Product): Promise<Product> {
    const res = await pool.query(
      `INSERT INTO products (model_name, version, color, base_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.model_name, data.version, data.color, data.base_price]
    )
    return res.rows[0]
  }

  static async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const res = await pool.query(
      `UPDATE products
       SET model_name = COALESCE($1, model_name),
           version = COALESCE($2, version),
           color = COALESCE($3, color),
           base_price = COALESCE($4, base_price),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [data.model_name, data.version, data.color, data.base_price, id]
    )
    return res.rows[0] || null
  }

  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM products WHERE id = $1', [id])
  }
}
