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

    const vtuberIds = ['858359149', '776751504', '790167759', '584184005'];
    const videos = [];

    // すべてのVTuberのアーカイブを取得
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

        videos.push({
          id: video.id,
          vtuber_id: vtuberId,
          title: video.title,
          published_at: video.published_at,
          duration: video.duration ? parseDuration(video.duration) : null,
          thumbnail_url: thumbnailUrl,
          url: video.url,
          view_count: video.view_count || 0,
        });
      }
    }

    // すべてのアーカイブをpublished_atでソート（新しい順）
    videos.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    const db = await mysql.createConnection(process.env.DATABASE_URL!);
    for (const video of videos) {
      await db.execute(
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
    await db.end();

    return NextResponse.json({ data: videos });
  } catch (error: any) {
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