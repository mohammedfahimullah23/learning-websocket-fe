
import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private rxStomp: RxStomp;

  constructor() {
    this.rxStomp = new RxStomp();
    this.configureWebSocket();
  }

  private configureWebSocket() {
    this.rxStomp.configure({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {},
      debug: (msg) => {
        console.log(msg);
      },
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 200,
    });

    this.rxStomp.activate();

    // Log connection status
    this.rxStomp.connected$.subscribe(() => {
      console.log('Connected to WebSocket');
    });
  }

  public sendMessage(destination: string, body: any) {
    this.rxStomp.publish({ destination, body });
  }

  public subscribeToTopic(topic: string, callback: (message: any) => void) {
    return this.rxStomp.watch(topic).subscribe(callback);
  }
}
