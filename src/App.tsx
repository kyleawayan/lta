/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import './App.global.css';

export default function App() {
  // const [discordTokenStatus, setDiscordTokenStatus] = useState(true);
  const [discordToken, setDiscordToken] = useState('');

  // useEffect(() => {
  //   ipcRenderer.send('discord-token-status');
  //
  //   ipcRenderer.on('discord-token-status', (_, arg) => {
  //     console.log(arg);
  //   });
  //
  //   return () => {
  //     ipcRenderer.removeAllListeners('discord-token-status');
  //   };
  // }, []);

  const changeToken = () => {
    ipcRenderer.send('discord-token-save', discordToken);
  };

  const start = () => {
    ipcRenderer.send('toggle-status', 'start');
  };

  const stop = () => {
    ipcRenderer.send('toggle-status', 'stop');
  };

  const signOut = () => {
    ipcRenderer.send('sign-out');
  };

  return (
    <div>
      <h1>lta</h1>
      <form onSubmit={changeToken}>
        <label>
          discord token:
          <input
            type="password"
            value={discordToken}
            onChange={(data) => setDiscordToken(data.target.value)}
          />
        </label>
      </form>
      <button onClick={changeToken} type="button">
        change token
      </button>
      <button onClick={start} type="button">
        start
      </button>
      <button onClick={stop} type="button">
        stop
      </button>
      <button onClick={signOut} type="button">
        sign out
      </button>
    </div>
  );
}
