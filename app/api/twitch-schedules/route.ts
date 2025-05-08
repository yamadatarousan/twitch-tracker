import { NextResponse } from 'next/server';
import axios from 'axios';
import mysql from 'mysql2/promise';

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

    const vtuberIds = ['858359149', '776751504', '790167759', '584184005']; // ユーザーIDのリスト
    const schedules = [];

    for (const vtuberId of vtuberIds) {
      try {
        const response = await axios.get('https://api.twitch.tv/helix/schedule', {
          params: { broadcaster_id: vtuberId },
          headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.data?.segments) {
          for (const segment of response.data.data.segments) {
            schedules.push({
              id: segment.id,
              vtuber_id: vtuberId,
              title: segment.title,
              start_time: segment.start_time,
              duration: segment.duration ? parseInt(segment.duration) : null,
              url: `https://twitch.tv/${response.data.data.broadcaster_login}`,
            });
          }
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`No schedule found for vtuber_id: ${vtuberId}`);
          continue; // 404ならスキップして次のVTuberへ
        }
        throw error; // 404以外のエラーは再スロー
      }
    }

    const db = await mysql.createConnection(process.env.DATABASE_URL!);
    for (const schedule of schedules) {
      await db.execute(
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
    await db.end();

    return NextResponse.json({ data: schedules });
  } catch (error: any) {
    console.error('Error in /api/twitch-schedules:', error.message, error.stack);
    return NextResponse.json({ error: error.message || 'Failed to get schedules' }, { status: 500 });
  }
}