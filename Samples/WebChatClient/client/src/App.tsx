import * as React from 'react';
import './App.css';
import { Chat } from 'botframework-webchat';

interface DirectLineConfig {
  token: string;
  domain: string;
}

class App extends React.Component<{}, {
  isLoaded: boolean
}> {
  private _userId: string;
  private _domain: string;
  private _token: string;

  constructor() {
    super();
    this._userId = this.r4() + this.r4() + this.r4();
  }

  componentWillMount() {
    this.setState({ isLoaded: false });

    fetch(
      'api/config',
      {
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
      } 
    ).then((response: Response) => {
      if (response.status >= 200 && response.status < 300) {
        response.json().then((body: DirectLineConfig) => {
          this._domain = body.domain;
          this._token = body.token;
          this.setState({ isLoaded: true });
        });
      }
    });
  }

  public r4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16).substring(1);
  }

  render() {
    var chat = undefined;
    if (this.state.isLoaded) {
      chat = (
        <Chat 
            directLine={{ 
              secret: this._token,
              domain: this._domain
            }}

            bot={{ id: 'bot', name: '' }}
            user={{ id: this._userId, name: this._userId }}
        />
      );
    } else {
      chat = (<div>Loading...</div>);
    }

    return (
      <div className="app">
        <div className="cover-container">
          <div className="botfx-label">Azure Bot Service</div>
          <div className="botfx-preview-label">WebChat Sample</div>
        </div>
        <div className="bot-container">
          {chat}
        </div>
      </div>
    );
  }
}

export default App;
