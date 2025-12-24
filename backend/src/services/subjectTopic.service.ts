import pool from '../config/database';
import { CreateSubjectTopicInput, UpdateSubjectTopicInput } from '../validators/subjectTopic.validator';

export const subjectTopicService = {
  getAll: async () => {
    const [rows] = await pool.execute('SELECT * FROM SubjectTopic ORDER BY topic_name');
    return rows;
  },

  getById: async (id: number) => {
    const [rows] = await pool.execute('SELECT * FROM SubjectTopic WHERE topic_id = ?', [id]);
    const topics = rows as any[];
    return topics[0] || null;
  },

  create: async (data: CreateSubjectTopicInput) => {
    const [result] = await pool.execute(
      'INSERT INTO SubjectTopic (topic_name) VALUES (?)',
      [data.topic_name]
    ) as any;
    const newId = result.insertId;
    return subjectTopicService.getById(newId);
  },

  update: async (id: number, data: UpdateSubjectTopicInput) => {
    if (data.topic_name !== undefined) {
      await pool.execute(
        'UPDATE SubjectTopic SET topic_name = ? WHERE topic_id = ?',
        [data.topic_name, id]
      );
    }
    return subjectTopicService.getById(id);
  },

  delete: async (id: number) => {
    await pool.execute('DELETE FROM SubjectTopic WHERE topic_id = ?', [id]);
    return { success: true };
  },
};





