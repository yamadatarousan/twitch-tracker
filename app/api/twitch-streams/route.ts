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
    console.log('取得した VTuber ID (streams):', vtuberIds); // デバッグログ
    await db.end();

    const streams = [];

    const response = await axios.get('https://api.twitch.tv/helix/streams', {
      params: { user_id: vtuberIds, first: 100 },
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    for (const stream of response.data.data) {
      let thumbnailUrl = stream.thumbnail_url;
      if (thumbnailUrl.includes('{width}')) {
        thumbnailUrl = thumbnailUrl.replace('{width}', '320').replace('{height}', '180');
      }

      const userName = await getVtuberName(stream.user_id);
      console.log(`vtuberId: ${stream.user_id}, userName: ${userName} (streams)`); // デバッグログ

      streams.push({
        id: stream.id,
        user_name: userName,
        title: stream.title,
        viewer_count: stream.viewer_count || 0,
        game_name: stream.game_name || 'ゲームなし',
        thumbnail_url: thumbnailUrl,
        url: `https://www.twitch.tv/${stream.user_login}`,
      });
    }

    console.log('返却する配信データ:', streams); // デバッグログ
    return NextResponse.json({ data: streams });
  } catch (error: any) {
    console.error('配信取得エラー:', error);
    return NextResponse.json({ error: error.message || 'Failed to get streams' }, { status: 500 });
  }
}