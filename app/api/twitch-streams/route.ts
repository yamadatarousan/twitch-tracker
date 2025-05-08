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

    const vtubers = ['ramuneshiranami', 'asumisena', 'nazunakaga', 'akarindao'];
    const response = await axios.get('https://api.twitch.tv/helix/streams', {
      params: new URLSearchParams(vtubers.map(login => ['user_login', login])),
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const db = await mysql.createConnection(process.env.DATABASE_URL!);
    for (const stream of response.data.data) {
      await db.execute(
        `INSERT INTO streams (id, vtuber_id, title, start_time, game_name, viewer_count, thumbnail_url, url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         title = VALUES(title), viewer_count = VALUES(viewer_count)`,
        [
          stream.id,
          stream.user_id,
          stream.title,
          new Date(stream.started_at),
          stream.game_name,
          stream.viewer_count,
          stream.thumbnail_url,
          `https://twitch.tv/${stream.user_login}`,
        ]
      );
    }
    await db.end();

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get streams' }, { status: 500 });
  }
}