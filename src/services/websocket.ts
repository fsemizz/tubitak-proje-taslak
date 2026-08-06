/**
 * WebSocket Abstraction Layer
 * 
 * İleride Spring Boot STOMP WebSocket sunucusu aktifleştiğinde
 * canlı skor takibi, eş zamanlı sınıf etkinlikleri veya düello modu için kullanılacaktır.
 */
export type WSMessageCallback = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, WSMessageCallback[]> = new Map();
  private isConnected: boolean = false;

  public connect(url: string = 'ws://localhost:8080/ws-codekids'): void {
    try {
      console.log(`[WebSocket] Sunucuya bağlanılıyor: ${url} (Mock Modu - Sunucu olmadığı için simüle ediliyor)`);
      // Sunucu henüz olmadığı için simüle ediyoruz
      this.isConnected = true;
    } catch (e) {
      console.warn('[WebSocket] Bağlantı kurulamadı:', e);
    }
  }

  public subscribe(channel: string, callback: WSMessageCallback): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, []);
    }
    this.listeners.get(channel)?.push(callback);

    return () => {
      const callbacks = this.listeners.get(channel) || [];
      this.listeners.set(
        channel,
        callbacks.filter((cb) => cb !== callback)
      );
    };
  }

  public send(destination: string, payload: any): void {
    console.log(`[WebSocket Send -> ${destination}]`, payload);
    // İleride WebSocket.send() yapılacaktır
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    console.log('[WebSocket] Bağlantı kapatıldı');
  }
}

export const wsService = new WebSocketService();
