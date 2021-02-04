import { ipcMain } from 'electron';
import * as keytar from 'keytar';
import setDcStatus from './setDcStatus';
import refreshToToken from '../spotify/refreshToToken';

export default function ipcStuff(clientId: string) {
  let refreshToken = '';
  let accessToken: string;
  let discordToken: string;
  let currentArtist = '';
  let running = false;

  async function getToken(refresh_token: string) {
    try {
      const accessTokenResponse = await refreshToToken(refresh_token, clientId);
      await keytar.setPassword(
        'lta',
        'refresh_token',
        accessTokenResponse.refresh_token
      );
      accessToken = accessTokenResponse.access_token;
    } catch (error) {
      console.error(error);
      return;
    }
    setTimeout(() => {
      getToken(refreshToken);
    }, 3550 * 1000);
  }

  // ipcMain.on('discord-token-status', (event) => {
  //   if (store.get('discord-token')) {
  //     event.reply('discord-token-status', '1');
  //   } else {
  //     event.reply('discord-token-status', '0');
  //   }
  // });

  ipcMain.handle('discord-token-save', async (_, args) => {
    await keytar.setPassword('lta', 'discord-token', args);
    discordToken = (await keytar.getPassword('lta', 'discord-token')) ?? '';
  });

  ipcMain.handle('check-for-spotify-token', async () => {
    refreshToken = (await keytar.getPassword('lta', 'refresh_token')) ?? '';
    getToken(refreshToken);
  });

  ipcMain.handle('check-current-artist', () => {
    return currentArtist;
  });

  ipcMain.handle('check-if-running', () => {
    return running;
  });

  function setStatus() {
    setDcStatus(accessToken, discordToken, currentArtist)
      .then((data) => {
        currentArtist = data;
        return 0;
      })
      .catch((error) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        timer.stop();
        running = false;
        console.error(error);
      });
  }

  class Timer {
    timer: number;

    constructor() {
      this.timer = 0;
    }

    start() {
      running = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.timer = <any>setInterval(() => {
        setStatus();
      }, 1000);
    }

    stop() {
      clearInterval(this.timer);
      running = false;
    }
  }

  const timer = new Timer();

  ipcMain.handle('toggle-status', async (_, args) => {
    discordToken = (await keytar.getPassword('lta', 'discord-token')) ?? '';
    if (args === 'start') {
      timer.start();
    } else {
      timer.stop();
    }
  });
}
