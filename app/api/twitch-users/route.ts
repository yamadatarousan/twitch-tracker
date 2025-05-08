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

    const vtubers = ['ramuneshiranami', 'asumisena', 'nazunakaga'];
    const response = await axios.get('https://api.twitch.tv/helix/users', {
      params: new URLSearchParams(vtubers.map(login => ['login', login])),
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const db = await mysql.createConnection(process.env.DATABASE_URL!);
    for (const user of response.data.data) {
      await db.execute(
        `INSERT INTO vtubers (id, name, vtuber_group, icon_url)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         name = VALUES(name), icon_url = VALUES(icon_url)`,
        [user.id, user.display_name, 'vspo', user.profile_image_url || null]
      );
    }
    await db.end();

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get users' }, { status: 500 });
  }
}