import pool from '../config/database';
import { CreatePersonInput, UpdatePersonInput } from '../validators/person.validator';

export const personService = {
  getAll: async () => {
    const [rows] = await pool.execute('SELECT * FROM Person ORDER BY last_name, first_name');
    return rows;
  },

  getById: async (id: number) => {
    const [rows] = await pool.execute('SELECT * FROM Person WHERE person_id = ?', [id]);
    const people = rows as any[];
    return people[0] || null;
  },

  create: async (data: CreatePersonInput) => {
    const [result] = await pool.execute(
      'INSERT INTO Person (first_name, last_name, email, affiliation) VALUES (?, ?, ?, ?)',
      [data.first_name, data.last_name, data.email, data.affiliation || null]
    ) as any;
    const newId = result.insertId;
    return personService.getById(newId);
  },

  update: async (id: number, data: UpdatePersonInput) => {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.first_name !== undefined) {
      updates.push('first_name = ?');
      values.push(data.first_name);
    }
    if (data.last_name !== undefined) {
      updates.push('last_name = ?');
      values.push(data.last_name);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }
    if (data.affiliation !== undefined) {
      updates.push('affiliation = ?');
      values.push(data.affiliation);
    }

    if (updates.length === 0) {
      return personService.getById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE Person SET ${updates.join(', ')} WHERE person_id = ?`,
      values
    );
    return personService.getById(id);
  },

  delete: async (id: number) => {
    await pool.execute('DELETE FROM Person WHERE person_id = ?', [id]);
    return { success: true };
  },
};



