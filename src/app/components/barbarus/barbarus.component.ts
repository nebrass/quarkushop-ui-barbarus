import {Component, OnInit} from '@angular/core';
import {BarbarusService} from '../../services/barbarus/barbarus.service';
import {NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels} from '@techiediaries/ngx-qrcode';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {BarbarusLoginDto} from '../../models/barbarus/barbarus-login-dto';

@Component({
  selector: 'app-barbarus',
  templateUrl: './barbarus.component.html',
  styleUrls: ['./barbarus.component.css']
})
export class BarbarusComponent implements OnInit {
  barbarusLogin: BarbarusLoginDto;
  barbarusLoginJson = '';

  elementType = NgxQrcodeElementTypes.URL;
  errorCorrectionLevel = NgxQrcodeErrorCorrectionLevels.LOW;
  ready = false;
  authenticated = this.barbarusService.isConnected();
  myWebSocket: WebSocketSubject<any> = null;
  visible = false;

  constructor(private barbarusService: BarbarusService) {
  }

  ngOnInit(): void {

    if (!this.barbarusService.isConnected()) {
      this.barbarusService.getBarbarusLogin().subscribe(
        data => {
          this.barbarusLogin = data;
          this.barbarusLoginJson = JSON.stringify(data);
          this.ready = true;

          const url = 'ws://localhost:8080/websocket/' + this.barbarusLogin.viewId;
          this.myWebSocket = webSocket({
            url,
            deserializer: msg => JSON.parse(msg.data)
          });

          this.myWebSocket.subscribe(
            msg => this.handleReceivedMsg(msg),
            // Called whenever there is a message from the server
            err => console.log(err),
            // Called if WebSocket API signals some kind of error
            () => console.log('Communication with WS completed')
            // Called when connection is closed (for whatever reason)
          );
        },
        error => {
          console.log(error);
        });
    }
  }

  handleReceivedMsg(msg: any): void {
    const accessToken = msg.accessToken;
    localStorage.setItem('access_token', accessToken);
    const refreshToken = msg.refreshToken;
    localStorage.setItem('refresh_token', refreshToken);

    this.visible = true;
    this.authenticated = true;
    this.myWebSocket.complete();
  }

  logout(): void {
    this.barbarusService.logout();
  }

  refresh(): void {
    this.barbarusService.refreshToken().subscribe();
  }
}
