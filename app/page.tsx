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

export default function Home() {
  const [streams, setStreams] = useState<Stream[]>([]);
  useEffect(() => {
    fetch('/api/twitch-streams')
      .then((res) => res.json())
      .then((data) => setStreams(data.data || []));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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
    </div>
  );
}