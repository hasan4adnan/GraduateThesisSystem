import pool from '../config/database';
import { CreateThesisInput, UpdateThesisInput, SearchThesisInput } from '../validators/thesis.validator';

export const thesisService = {
  getAll: async () => {
    const [rows] = await pool.execute('SELECT * FROM Thesis ORDER BY year DESC, thesis_id DESC');
    return rows;
  },

  getById: async (id: number) => {
    const [rows] = await pool.execute('SELECT * FROM Thesis WHERE thesis_id = ?', [id]);
    const theses = rows as any[];
    return theses[0] || null;
  },

  getSupervisors: async (thesisId: number) => {
    const [rows] = await pool.execute(
      'SELECT * FROM SupervisorAssignment WHERE thesis_id = ?',
      [thesisId]
    );
    return rows;
  },

  getSubjectTopics: async (thesisId: number) => {
    const [rows] = await pool.execute(
      `SELECT st.* FROM SubjectTopic st
       INNER JOIN Thesis_SubjectTopic tst ON st.topic_id = tst.topic_id
       WHERE tst.thesis_id = ?`,
      [thesisId]
    );
    return rows;
  },

  getKeywords: async (thesisId: number) => {
    const [rows] = await pool.execute(
      `SELECT k.* FROM Keyword k
       INNER JOIN Thesis_Keyword tk ON k.keyword_id = tk.keyword_id
       WHERE tk.thesis_id = ?`,
      [thesisId]
    );
    return rows;
  },

  create: async (data: CreateThesisInput) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert thesis
      const [result] = await connection.execute(
        `INSERT INTO Thesis (title, abstract, author_id, year, type, university_id, institute_id, num_pages, language, submission_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.title,
          data.abstract,
          data.author_id,
          data.year,
          data.type,
          data.university_id,
          data.institute_id,
          data.num_pages,
          data.language,
          data.submission_date,
        ]
      ) as any;
      const thesisId = result.insertId;

      // Insert supervisors
      for (const personId of data.supervisor_ids) {
        await connection.execute(
          'INSERT INTO SupervisorAssignment (thesis_id, person_id, role) VALUES (?, ?, ?)',
          [thesisId, personId, 'Supervisor']
        );
      }

      // Insert co-supervisor if provided
      if (data.co_supervisor_id) {
        await connection.execute(
          'INSERT INTO SupervisorAssignment (thesis_id, person_id, role) VALUES (?, ?, ?)',
          [thesisId, data.co_supervisor_id, 'Co-Supervisor']
        );
      }

      // Insert subject topics
      for (const topicId of data.subject_topic_ids || []) {
        await connection.execute(
          'INSERT INTO Thesis_SubjectTopic (thesis_id, topic_id) VALUES (?, ?)',
          [thesisId, topicId]
        );
      }

      // Insert keywords (create if not exists, then link)
      for (const keyword of data.keywords || []) {
        // Check if keyword exists
        const [existing] = await connection.execute(
          'SELECT keyword_id FROM Keyword WHERE word = ?',
          [keyword]
        ) as any[];

        let keywordId: number;
        if (existing.length > 0) {
          keywordId = existing[0].keyword_id;
        } else {
          const [kwResult] = await connection.execute(
            'INSERT INTO Keyword (word) VALUES (?)',
            [keyword]
          ) as any;
          keywordId = kwResult.insertId;
        }

        // Link keyword to thesis
        await connection.execute(
          'INSERT IGNORE INTO Thesis_Keyword (thesis_id, keyword_id) VALUES (?, ?)',
          [thesisId, keywordId]
        );
      }

      await connection.commit();
      return thesisService.getById(thesisId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  update: async (id: number, data: UpdateThesisInput) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update thesis basic info
      const updates: string[] = [];
      const values: any[] = [];

      if (data.title !== undefined) {
        updates.push('title = ?');
        values.push(data.title);
      }
      if (data.abstract !== undefined) {
        updates.push('abstract = ?');
        values.push(data.abstract);
      }
      if (data.author_id !== undefined) {
        updates.push('author_id = ?');
        values.push(data.author_id);
      }
      if (data.year !== undefined) {
        updates.push('year = ?');
        values.push(data.year);
      }
      if (data.type !== undefined) {
        updates.push('type = ?');
        values.push(data.type);
      }
      if (data.university_id !== undefined) {
        updates.push('university_id = ?');
        values.push(data.university_id);
      }
      if (data.institute_id !== undefined) {
        updates.push('institute_id = ?');
        values.push(data.institute_id);
      }
      if (data.num_pages !== undefined) {
        updates.push('num_pages = ?');
        values.push(data.num_pages);
      }
      if (data.language !== undefined) {
        updates.push('language = ?');
        values.push(data.language);
      }
      if (data.submission_date !== undefined) {
        updates.push('submission_date = ?');
        values.push(data.submission_date);
      }

      if (updates.length > 0) {
        values.push(id);
        await connection.execute(
          `UPDATE Thesis SET ${updates.join(', ')} WHERE thesis_id = ?`,
          values
        );
      }

      // Update supervisors if provided
      if (data.supervisor_ids !== undefined) {
        // Delete existing supervisors
        await connection.execute(
          "DELETE FROM SupervisorAssignment WHERE thesis_id = ? AND role = 'Supervisor'",
          [id]
        );
        // Insert new supervisors
        for (const personId of data.supervisor_ids) {
          await connection.execute(
            'INSERT INTO SupervisorAssignment (thesis_id, person_id, role) VALUES (?, ?, ?)',
            [id, personId, 'Supervisor']
          );
        }
      }

      // Update co-supervisor if provided
      if (data.co_supervisor_id !== undefined) {
        await connection.execute(
          "DELETE FROM SupervisorAssignment WHERE thesis_id = ? AND role = 'Co-Supervisor'",
          [id]
        );
        if (data.co_supervisor_id) {
          await connection.execute(
            'INSERT INTO SupervisorAssignment (thesis_id, person_id, role) VALUES (?, ?, ?)',
            [id, data.co_supervisor_id, 'Co-Supervisor']
          );
        }
      }

      // Update subject topics if provided
      if (data.subject_topic_ids !== undefined) {
        await connection.execute('DELETE FROM Thesis_SubjectTopic WHERE thesis_id = ?', [id]);
        for (const topicId of data.subject_topic_ids) {
          await connection.execute(
            'INSERT INTO Thesis_SubjectTopic (thesis_id, topic_id) VALUES (?, ?)',
            [id, topicId]
          );
        }
      }

      // Update keywords if provided
      if (data.keywords !== undefined) {
        await connection.execute('DELETE FROM Thesis_Keyword WHERE thesis_id = ?', [id]);
        for (const keyword of data.keywords) {
          const [existing] = await connection.execute(
            'SELECT keyword_id FROM Keyword WHERE word = ?',
            [keyword]
          ) as any[];

          let keywordId: number;
          if (existing.length > 0) {
            keywordId = existing[0].keyword_id;
          } else {
            const [kwResult] = await connection.execute(
              'INSERT INTO Keyword (word) VALUES (?)',
              [keyword]
            ) as any;
            keywordId = kwResult.insertId;
          }

          await connection.execute(
            'INSERT INTO Thesis_Keyword (thesis_id, keyword_id) VALUES (?, ?)',
            [id, keywordId]
          );
        }
      }

      await connection.commit();
      return thesisService.getById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  delete: async (id: number) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete related records
      await connection.execute('DELETE FROM SupervisorAssignment WHERE thesis_id = ?', [id]);
      await connection.execute('DELETE FROM Thesis_SubjectTopic WHERE thesis_id = ?', [id]);
      await connection.execute('DELETE FROM Thesis_Keyword WHERE thesis_id = ?', [id]);
      await connection.execute('DELETE FROM Thesis WHERE thesis_id = ?', [id]);

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  search: async (filters: SearchThesisInput) => {
    let query = 'SELECT * FROM Thesis WHERE 1=1';
    const values: any[] = [];

    if (filters.query) {
      query += ' AND (title LIKE ? OR thesis_id LIKE ?)';
      const searchTerm = `%${filters.query}%`;
      values.push(searchTerm, filters.query);
    }

    if (filters.author_id) {
      query += ' AND author_id = ?';
      values.push(filters.author_id);
    }

    if (filters.university_id) {
      query += ' AND university_id = ?';
      values.push(filters.university_id);
    }

    if (filters.institute_id) {
      query += ' AND institute_id = ?';
      values.push(filters.institute_id);
    }

    if (filters.type) {
      query += ' AND type = ?';
      values.push(filters.type);
    }

    if (filters.language) {
      query += ' AND language = ?';
      values.push(filters.language);
    }

    if (filters.year_from) {
      query += ' AND year >= ?';
      values.push(filters.year_from);
    }

    if (filters.year_to) {
      query += ' AND year <= ?';
      values.push(filters.year_to);
    }

    query += ' ORDER BY year DESC, thesis_id DESC';

    const [rows] = await pool.execute(query, values);
    return rows;
  },
};



