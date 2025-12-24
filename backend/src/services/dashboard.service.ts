import pool from '../config/database';

export const dashboardService = {
  getStats: async () => {
    const [thesesCount] = await pool.execute('SELECT COUNT(*) as count FROM Thesis') as any[];
    const [universitiesCount] = await pool.execute('SELECT COUNT(*) as count FROM University') as any[];
    const [peopleCount] = await pool.execute('SELECT COUNT(*) as count FROM Person') as any[];
    const [institutesCount] = await pool.execute('SELECT COUNT(*) as count FROM Institute') as any[];

    return {
      totalTheses: thesesCount[0].count,
      totalUniversities: universitiesCount[0].count,
      totalPeople: peopleCount[0].count,
      totalInstitutes: institutesCount[0].count,
    };
  },
};





