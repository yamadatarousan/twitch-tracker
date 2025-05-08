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
    console.log('取得した VTuber ID (videos):', vtuberIds); // デバッグログ
    await db.end();

    const videos = [];

    for (const vtuberId of vtuberIds) {
      const response = await axios.get('https://api.twitch.tv/helix/videos', {
        params: { user_id: vtuberId, type: 'archive', first: 20 },
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      for (const video of response.data.data) {
        let thumbnailUrl = video.thumbnail_url;
        if (thumbnailUrl.includes('%{width}')) {
          thumbnailUrl = thumbnailUrl.replace('%{width}', '320').replace('%{height}', '180');
        } else if (thumbnailUrl.includes('{width}')) {
          thumbnailUrl = thumbnailUrl.replace('{width}', '320').replace('{height}', '180');
        }

        const userName = await getVtuberName(vtuberId);
        console.log(`vtuberId: ${vtuberId}, userName: ${userName} (videos)`); // デバッグログ

        videos.push({
          id: video.id,
          vtuber_id: vtuberId,
          user_name: userName,
          title: video.title,
          published_at: video.published_at,
          duration: video.duration ? parseDuration(video.duration) : null,
          thumbnail_url: thumbnailUrl,
          url: video.url,
          view_count: video.view_count || 0,
        });
      }
    }

    videos.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    const dbSave = await mysql.createConnection(process.env.DATABASE_URL!);
    for (const video of videos) {
      await dbSave.execute(
        `INSERT INTO videos (id, vtuber_id, title, published_at, duration, thumbnail_url, url, view_count, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
         title = VALUES(title), view_count = VALUES(view_count)`,
        [
          video.id,
          video.vtuber_id,
          video.title,
          new Date(video.published_at),
          video.duration,
          video.thumbnail_url,
          video.url,
          video.view_count,
        ]
      );
    }
    await dbSave.end();

    console.log('返却する動画データ:', videos); // デバッグログ
    return NextResponse.json({ data: videos });
  } catch (error: any) {
    console.error('動画取得エラー:', error);
    return NextResponse.json({ error: error.message || 'Failed to get videos' }, { status: 500 });
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