import { ipcMain } from 'electron';
import * as keytar from 'keytar';
import setDcStatus from './setDcStatus';
import refreshToToken from '../spotify/refreshToToken';

export default function ipcStuff(clientId: string) {
  let refreshToken = '';
  let accessToken: string;

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

  (async () => {
    refreshToken = (await keytar.getPassword('lta', 'refresh_token')) ?? '';
    getToken(refreshToken);
  })();

  // ipcMain.on('discord-token-status', (event) => {
  //   if (store.get('discord-token')) {
  //     event.reply('discord-token-status', '1');
  //   } else {
  //     event.reply('discord-token-status', '0');
  //   }
  // });

  ipcMain.on('discord-token-save', async (_, args) => {
    await keytar.setPassword('lta', 'discord-token', args);
  });

  ipcMain.on('toggle-status', async (_, args) => {
    let timer;
    const discordToken =
      (await keytar.getPassword('lta', 'discord-token')) ?? '';
    let currentArtist = '';
    if (args === 'start') {
      timer = setInterval(() => {
        setDcStatus(accessToken, discordToken, currentArtist)
          .then((data) => {
            currentArtist = data;
            return 0;
          })
          .catch((error) => console.error(error));
      }, 1000);
    } else {
      clearInterval(timer); // have to make a class for this
    }
  });
}
