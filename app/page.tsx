'use client';
import { useEffect, useState } from 'react';

interface Stream {
  id: string;
  user_name: string;
  title: string;
  viewer_count: number;
  game_name: string;
  thumbnail_url: string;
}

interface Schedule {
  id: string;
  vtuber_id: string;
  title: string;
  start_time: string;
  duration: number | null;
  url: string;
}

interface Video {
  id: string;
  vtuber_id: string;
  title: string;
  published_at: string;
  duration: number | null;
  thumbnail_url: string;
  url: string;
}

export default function Home() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    fetch('/api/twitch-streams')
      .then((res) => res.json())
      .then((data) => setStreams(data.data || []));

    fetch('/api/twitch-schedules')
      .then((res) => res.json())
      .then((data) => setSchedules(data.data || []));

    fetch('/api/twitch-videos')
      .then((res) => res.json())
      .then((data) => setVideos(data.data || []));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* ライブ配信 */}
      <h1 className="text-3xl font-bold text-center text-purple-600 mb-8">
        ぶいすぽっ！ライブ配信トラッカー
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream) => (
          <div key={stream.id} className="bg-white rounded-lg shadow-lg p-4">
            <img
              src={stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180')}
              alt={stream.title}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">{stream.title}</h2>
            <p className="text-gray-600">配信者: {stream.user_name}</p>
            <p className="text-gray-600">ゲーム: {stream.game_name}</p>
            <p className="text-gray-600">視聴者数: {stream.viewer_count}</p>
          </div>
        ))}
      </div>

      {/* 配信予定 */}
      <h2 className="text-2xl font-bold text-center text-purple-600 mt-12 mb-8">
        配信予定
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold">{schedule.title}</h3>
            <p className="text-gray-600">
              開始: {new Date(schedule.start_time).toLocaleString('ja-JP')}
            </p>
            <p className="text-gray-600">
              長さ: {schedule.duration ? `${schedule.duration}分` : '未定'}
            </p>
            <a
              href={schedule.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Twitchで見る
            </a>
          </div>
        ))}
      </div>

      {/* 過去の配信 */}
      <h2 className="text-2xl font-bold text-center text-purple-600 mt-12 mb-8">
        過去の配信
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-lg p-4">
            <img
              src={video.thumbnail_url.replace('{width}', '320').replace('{height}', '180')}
              alt={video.title}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-lg font-semibold">{video.title}</h3>
            <p className="text-gray-600">
              公開日: {new Date(video.published_at).toLocaleString('ja-JP')}
            </p>
            <p className="text-gray-600">
              長さ: {video.duration ? `${video.duration}分` : '不明'}
            </p>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              見る
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}