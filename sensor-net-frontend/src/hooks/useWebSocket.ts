import { useEffect, useState } from 'react';
import * as SockJS_ from 'sockjs-client';
const SockJS = (SockJS_ as any).default || SockJS_;
import * as Stomp from 'stompjs';

export const useWebSocket = (topic: string) => {
  const [data, setData] = useState<any[]>([]);
  const [latestData, setLatestData] = useState<any>(null);

  useEffect(() => {
    const socket = new SockJS(import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws-sensor-net');
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe(topic, (message) => {
        const payload = JSON.parse(message.body);
        setLatestData(payload);
        setData((prev: any[]) => [...prev.slice(-49), payload]); // Keep last 50 points
      });
    });

    return () => {
      if (client.connected) {
        client.disconnect(() => {});
      }
    };
  }, [topic]);

  return { data, latestData };
};
