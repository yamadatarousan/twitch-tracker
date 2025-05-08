import mysql from 'mysql2/promise';

// vtubers テーブルから名前を取得する関数
export async function getVtuberName(vtuberId: string): Promise<string> {
  const db = await mysql.createConnection(process.env.DATABASE_URL!);
  try {
    const [rows] = await db.execute('SELECT name FROM vtubers WHERE id = ?', [vtuberId]);
    const result = rows as any[];
    return result.length > 0 ? result[0].name : '不明な配信者';
  } catch (error) {
    console.error('VTuber名取得エラー:', error);
    return '不明な配信者';
  } finally {
    await db.end();
  }
}