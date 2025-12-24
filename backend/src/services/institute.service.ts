import pool from '../config/database';
import { CreateInstituteInput, UpdateInstituteInput } from '../validators/institute.validator';

export const instituteService = {
  getAll: async () => {
    const [rows] = await pool.execute('SELECT * FROM Institute ORDER BY name');
    return rows;
  },

  getById: async (id: number) => {
    const [rows] = await pool.execute('SELECT * FROM Institute WHERE institute_id = ?', [id]);
    const institutes = rows as any[];
    return institutes[0] || null;
  },

  getByUniversityId: async (universityId: number) => {
    const [rows] = await pool.execute(
      'SELECT * FROM Institute WHERE university_id = ? ORDER BY name',
      [universityId]
    );
    return rows;
  },

  create: async (data: CreateInstituteInput) => {
    const [result] = await pool.execute(
      'INSERT INTO Institute (name, university_id) VALUES (?, ?)',
      [data.name, data.university_id]
    ) as any;
    const newId = result.insertId;
    return instituteService.getById(newId);
  },

  update: async (id: number, data: UpdateInstituteInput) => {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.university_id !== undefined) {
      updates.push('university_id = ?');
      values.push(data.university_id);
    }

    if (updates.length === 0) {
      return instituteService.getById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE Institute SET ${updates.join(', ')} WHERE institute_id = ?`,
      values
    );
    return instituteService.getById(id);
  },

  delete: async (id: number) => {
    await pool.execute('DELETE FROM Institute WHERE institute_id = ?', [id]);
    return { success: true };
  },
};



