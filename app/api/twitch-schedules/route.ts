import { NextResponse } from 'next/server';
import axios from 'axios';
import mysql from 'mysql2/promise';
import { getVtuberName } from '../../lib/db';

export async function GET() {
  try {
    const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
    });
    const accessToken = tokenResponse.data.access_token;

    // DB から VTuber の ID 一覧を取得
    const db = await mysql.createConnection(process.env.DATABASE_URL!);
    const [vtuberRows] = await db.execute('SELECT id FROM vtubers');
    const vtuberIds = (vtuberRows as any[]).map((row) => row.id);
    console.log('取得した VTuber ID (schedules):', vtuberIds); // デバッグログ
    await db.end();

    const schedules = [];
    const now = new Date(); // 現在日時を動的に取得

    for (const vtuberId of vtuberIds) {
      const response = await axios.get('https://api.twitch.tv/helix/schedule', {
        params: { broadcaster_id: vtuberId },
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      for (const segment of response.data.data.segments || []) {
        const startTime = new Date(segment.start_time);
        // 現在日時より未来の予定のみを追加
        if (startTime > now) {
          const userName = await getVtuberName(vtuberId);
          console.log(`vtuberId: ${vtuberId}, userName: ${userName} (schedules)`); // デバッグログ

          schedules.push({
            id: segment.id,
            vtuber_id: vtuberId,
            user_name: userName,
            title: segment.title || 'タイトル未定',
            start_time: segment.start_time,
            duration: segment.duration ? parseDuration(segment.duration) : null,
            url: `https://www.twitch.tv/${vtuberId}`,
          });
        }
      }
    }

    const dbSave = await mysql.createConnection(process.env.DATABASE_URL!);
    for (const schedule of schedules) {
      await dbSave.execute(
        `INSERT INTO schedules (id, vtuber_id, title, start_time, duration, url, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
         title = VALUES(title), start_time = VALUES(start_time), duration = VALUES(duration)`,
        [
          schedule.id,
          schedule.vtuber_id,
          schedule.title,
          new Date(schedule.start_time),
          schedule.duration,
          schedule.url,
        ]
      );
    }
    await dbSave.end();

    console.log('返却するスケジュールデータ:', schedules); // デバッグログ
    return NextResponse.json({ data: schedules });
  } catch (error: any) {
    console.error('スケジュール取得エラー:', error);
    return NextResponse.json({ error: error.message || 'Failed to get schedules' }, { status: 500 });
  }
}

function parseDuration(duration: string): number | null {
  const match = duration.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match) return null;
  const hours = parseInt(match[1] || '0') * 60;
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0') / 60;
  return hours + minutes + Math.round(seconds);
}