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
  view_count: number;
}

export default function Home() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState<'streams' | 'schedules' | 'videos'>('streams');
  const [isLoading, setIsLoading] = useState(true); // ローディング状態を追加

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // ローディング開始
      try {
        const [streamsRes, schedulesRes, videosRes] = await Promise.all([
          fetch('/api/twitch-streams').then((res) => res.json()),
          fetch('/api/twitch-schedules').then((res) => res.json()),
          fetch('/api/twitch-videos').then((res) => res.json()),
        ]);
        setStreams(streamsRes.data || []);
        setSchedules(schedulesRes.data || []);
        setVideos(videosRes.data || []);
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setIsLoading(false); // ローディング終了
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="min-h-screen bg-vspoBlack p-6 md:p-8 bg-vspo-texture bg-vspo-texture-size relative"
      style={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(139, 92, 246, 0.05), transparent), var(--tw-bg-vspo-texture)',
      }}
    >
      {/* 背景のオーバーレイ */}
      <div className="absolute inset-0 bg-vspoDarkOverlay pointer-events-none" />

      {/* タイトル */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-vspoWhite shadow-neon-strong animate-fade-in inline-block">
          {Array.from('ぶいすぽっ！ライブ配信トラッカー').map((char, index) => (
            <span
              key={index}
              className="inline-block animate-char-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {char}
            </span>
          ))}
        </h1>
        <div className="mt-6 h-1 w-1/3 mx-auto bg-title-underline rounded-full" />
      </div>

      {/* タブボタン */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('streams')}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
            activeTab === 'streams'
              ? 'bg-gray-100 text-vspoDark shadow-neon-strong animate-pulse-glow'
              : 'bg-gray-600 text-vspoWhite hover:bg-gray-100 hover:text-vspoDark'
          }`}
        >
          ライブ配信
        </button>
        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
            activeTab === 'schedules'
              ? 'bg-gray-100 text-vspoDark shadow-neon-strong animate-pulse-glow'
              : 'bg-gray-600 text-vspoWhite hover:bg-gray-100 hover:text-vspoDark'
          }`}
        >
          配信予定
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
            activeTab === 'videos'
              ? 'bg-gray-100 text-vspoDark shadow-neon-strong animate-pulse-glow'
              : 'bg-gray-600 text-vspoWhite hover:bg-gray-100 hover:text-vspoDark'
          }`}
        >
          過去の配信
        </button>
      </div>

      {/* タブコンテンツ */}
      <div className="animate-fade-in">
        {/* ライブ配信タブ */}
        {activeTab === 'streams' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              <p className="text-center text-vspoLightPurple col-span-4 text-lg">
                読み込み中...
              </p>
            ) : streams.length > 0 ? (
              streams.map((stream) => (
                <div
                  key={stream.id}
                  className="relative bg-vspoDark rounded-lg shadow-vspo hover:shadow-vspo-hover transition-transform-glow duration-300 transform hover:scale-105 border border-vspoPurple border-opacity-30 overflow-hidden"
                >
                  <a href={stream.url} target="_blank" rel="noopener noreferrer">
                    <div className="relative">
                      <img
                        src={stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180')}
                        alt={stream.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-t from-vspoPurple to-transparent opacity-0 hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-vspoWhite font-semibold text-sm shadow-neon-strong">
                          ライブ配信中
                        </span>
                      </div>
                    </div>
                  </a>
                  <div className="p-3">
                    <h2 className="text-sm font-semibold text-vspoWhite truncate">{stream.title}</h2>
                    <p className="text-xs text-vspoLightPurple mt-1">配信者: {stream.user_name}</p>
                    <p className="text-xs text-vspoLightPurple">ゲーム: {stream.game_name}</p>
                    <p className="text-xs text-vspoPurple font-medium mt-1">
                      視聴者: {stream.viewer_count}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-vspoLightPurple col-span-4 text-lg">
                現在配信中のVTuberはいません
              </p>
            )}
          </div>
        )}

        {/* 配信予定タブ */}
        {activeTab === 'schedules' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              <p className="text-center text-vspoLightPurple col-span-4 text-lg">
                読み込み中...
              </p>
            ) : schedules.length > 0 ? (
              schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-vspoDark rounded-lg shadow-vspo hover:shadow-vspo-hover transition-transform-glow duration-300 transform hover:scale-105 border border-vspoPurple border-opacity-30 p-3"
                >
                  <h3 className="text-sm font-semibold text-vspoWhite truncate">{schedule.title}</h3>
                  <p className="text-xs text-vspoLightPurple mt-1">
                    開始: {new Date(schedule.start_time).toLocaleString('ja-JP')}
                  </p>
                  <p className="text-xs text-vspoLightPurple">
                    長さ: {schedule.duration ? `${schedule.duration}分` : '未定'}
                  </p>
                  <a
                    href={schedule.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-vspoPurple hover:text-vspoLightPurple text-xs font-medium mt-1 inline-block transition-colors"
                  >
                    Twitchで見る
                  </a>
                </div>
              ))
            ) : (
              <p className="text-center text-vspoLightPurple col-span-4 text-lg">
                近日中の配信予定はありません
              </p>
            )}
          </div>
        )}

        {/* 過去の配信タブ */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              <p className="text-center text-vspoLightPurple col-span-4 text-lg">
                読み込み中...
              </p>
            ) : videos.length > 0 ? (
              videos.map((video) => (
                <div
                  key={video.id}
                  className="relative bg-vspoDark rounded-lg shadow-vspo hover:shadow-vspo-hover transition-transform-glow duration-300 transform hover:scale-105 border border-vspoPurple border-opacity-30 overflow-hidden"
                >
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    <div className="relative">
                      <img
                        src={video.thumbnail_url || 'https://via.placeholder.com/320x180?text=No+Thumbnail'}
                        alt={video.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail')}
                      />
                      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-t from-vspoPurple to-transparent opacity-0 hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-vspoWhite font-semibold text-sm shadow-neon-strong">
                          再生する
                        </span>
                      </div>
                    </div>
                  </a>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-vspoWhite truncate">{video.title}</h3>
                    <p className="text-xs text-vspoLightPurple mt-1">
                      公開日: {new Date(video.published_at).toLocaleString('ja-JP')}
                    </p>
                    <p className="text-xs text-vspoLightPurple">
                      長さ: {video.duration ? `${video.duration}分` : '不明'}
                    </p>
                    <p className="text-xs text-vspoPurple font-medium mt-1">
                      視聴回数: {video.view_count.toLocaleString('ja-JP')}回
                    </p>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-vspoPurple hover:text-vspoLightPurple text-xs font-medium mt-1 inline-block transition-colors"
                    >
                      見る
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-vspoLightPurple col-span-4 text-lg">
                過去の配信はありません
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}