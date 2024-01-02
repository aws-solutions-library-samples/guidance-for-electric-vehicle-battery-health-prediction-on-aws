// websocket.service.ts

import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root",
})
export class WebsocketService {
  constructor(private socket: Socket) {}

  connect() {
    // Connect to your WebSocket server
    this.socket.connect();
  }

  sendMessage(message: string) {
    // Send a message to the WebSocket server
    this.socket.emit("message", message);
  }

  receiveMessage() {
    console.log("receiveMessage");
    // Listen for incoming messages from the WebSocket server
    return this.socket.fromEvent("modelResults");
  }
}
