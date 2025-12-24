import pool from '../config/database';
import { CreateUniversityInput, UpdateUniversityInput } from '../validators/university.validator';

export const universityService = {
  getAll: async () => {
    const [rows] = await pool.execute('SELECT * FROM University ORDER BY name');
    return rows;
  },

  getById: async (id: number) => {
    const [rows] = await pool.execute('SELECT * FROM University WHERE university_id = ?', [id]);
    const universities = rows as any[];
    return universities[0] || null;
  },

  create: async (data: CreateUniversityInput) => {
    const [result] = await pool.execute(
      'INSERT INTO University (name, country, city) VALUES (?, ?, ?)',
      [data.name, data.country, data.city]
    ) as any;
    const newId = result.insertId;
    return universityService.getById(newId);
  },

  update: async (id: number, data: UpdateUniversityInput) => {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.country !== undefined) {
      updates.push('country = ?');
      values.push(data.country);
    }
    if (data.city !== undefined) {
      updates.push('city = ?');
      values.push(data.city);
    }

    if (updates.length === 0) {
      return universityService.getById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE University SET ${updates.join(', ')} WHERE university_id = ?`,
      values
    );
    return universityService.getById(id);
  },

  delete: async (id: number) => {
    await pool.execute('DELETE FROM University WHERE university_id = ?', [id]);
    return { success: true };
  },
};



