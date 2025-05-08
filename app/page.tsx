'use client';
import { useEffect, useState } from 'react';

interface Stream {
  id: string;
  user_name: string;
  title: string;
  viewer_count: number;
  game_name: string;
  thumbnail_url: string;
  url: string;
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
    <div className="min-h-screen bg-gradient-to-b from-vspoPurple to-vspoLightPurple p-6 md:p-10">
      {/* ライブ配信セクション */}
      <h1 className="text-4xl md:text-5xl font-bold text-center text-vspoWhite mb-10 drop-shadow-lg">
        ぶいすぽっ！ライブ配信トラッカー
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.length > 0 ? (
          streams.map((stream) => (
            <div
              key={stream.id}
              className="relative bg-vspoWhite rounded-xl shadow-vspo hover:shadow-vspo-hover transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <a href={stream.url} target="_blank" rel="noopener noreferrer">
                <div className="relative">
                  <img
                    src={stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180')}
                    alt={stream.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  {/* オーバーレイ（ライブ配信中） */}
                  <div className="absolute top-0 left-0 w-full h-48 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-vspoWhite font-semibold text-lg">ライブ配信中</span>
                  </div>
                </div>
              </a>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-vspoDark truncate">{stream.title}</h2>
                <p className="text-vspoDark text-sm mt-1">配信者: {stream.user_name}</p>
                <p className="text-vspoDark text-sm">ゲーム: {stream.game_name}</p>
                <p className="text-vspoPurple text-sm font-medium mt-1">視聴者数: {stream.viewer_count}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-vspoWhite col-span-3 text-lg">現在配信中のVTuberはいません</p>
        )}
      </div>

      {/* 配信予定セクション */}
      <h2 className="text-3xl font-bold text-center text-vspoWhite mt-16 mb-8 drop-shadow-lg">
        配信予定
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-vspoWhite rounded-xl shadow-vspo hover:shadow-vspo-hover transition-all duration-300 transform hover:-translate-y-1 p-4"
            >
              <h3 className="text-lg font-semibold text-vspoDark truncate">{schedule.title}</h3>
              <p className="text-vspoDark text-sm mt-1">
                開始: {new Date(schedule.start_time).toLocaleString('ja-JP')}
              </p>
              <p className="text-vspoDark text-sm">
                長さ: {schedule.duration ? `${schedule.duration}分` : '未定'}
              </p>
              <a
                href={schedule.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-vspoPurple hover:text-vspoLightPurple font-medium text-sm mt-2 inline-block transition-colors"
              >
                Twitchで見る
              </a>
            </div>
          ))
        ) : (
          <p className="text-center text-vspoWhite col-span-3 text-lg">近日中の配信予定はありません</p>
        )}
      </div>

      {/* 過去の配信セクション */}
      <h2 className="text-3xl font-bold text-center text-vspoWhite mt-16 mb-8 drop-shadow-lg">
        過去の配信
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div
              key={video.id}
              className="relative bg-vspoWhite rounded-xl shadow-vspo hover:shadow-vspo-hover transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                <div className="relative">
                  <img
                    src={video.thumbnail_url || 'https://via.placeholder.com/320x180?text=No+Thumbnail'}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail')}
                  />
                  {/* オーバーレイ（再生ボタン風） */}
                  <div className="absolute top-0 left-0 w-full h-48 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-vspoWhite font-semibold text-lg">再生する</span>
                  </div>
                </div>
              </a>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-vspoDark truncate">{video.title}</h3>
                <p className="text-vspoDark text-sm mt-1">
                  公開日: {new Date(video.published_at).toLocaleString('ja-JP')}
                </p>
                <p className="text-vspoDark text-sm">
                  長さ: {video.duration ? `${video.duration}分` : '不明'}
                </p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-vspoPurple hover:text-vspoLightPurple font-medium text-sm mt-2 inline-block transition-colors"
                >
                  見る
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-vspoWhite col-span-3 text-lg">過去の配信はありません</p>
        )}
      </div>
    </div>
  );
}