import axios from 'axios';

type CustomStatus = {
  text: string;
  expires_at: Date;
} | null;

let listeningToArtistTime = new Date();
let minutesCheck = 0;

function changeDcStatus(discord_token: string, dataRequest: CustomStatus) {
  return axios({
    method: 'patch',
    url: 'https://discord.com/api/v8/users/@me/settings',
    headers: {
      Authorization: discord_token,
      'Content-Type': 'application/json',
    },
    data: { custom_status: dataRequest },
  });
}

export default async function setStatus(
  spotify_token: string,
  discord_token: string,
  currentArtist: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const currentTime = new Date();
    const timeListeningToArtist =
      currentTime.getTime() - listeningToArtistTime.getTime();
    let diffMins = Math.round(timeListeningToArtist / 60000);

    (async () => {
      try {
        const spotifyResponse = await axios({
          method: 'get',
          url: 'https://api.spotify.com/v1/me/player/currently-playing',
          headers: {
            Authorization: `Bearer ${spotify_token}`,
          },
        });

        let toSetDcStatusString = '';
        let dataRequest: CustomStatus = null;

        if (spotifyResponse.status !== 204) {
          toSetDcStatusString = spotifyResponse.data.item.artists[0].name;
          if (diffMins <= 10) {
            dataRequest = {
              text: `Listening to ${toSetDcStatusString}`,
              expires_at: new Date(currentTime.getTime() + 1440 * 60 * 1000),
            };
          } else {
            dataRequest = {
              text: `Listening to ${toSetDcStatusString} for ${diffMins} minutes`,
              expires_at: new Date(currentTime.getTime() + 1440 * 60 * 1000),
            };
          }
        }

        if (currentArtist !== toSetDcStatusString) {
          listeningToArtistTime = new Date();
          minutesCheck = 0;
          diffMins = 0;
          dataRequest = {
            text: `Listening to ${toSetDcStatusString}`,
            expires_at: new Date(currentTime.getTime() + 1440 * 60 * 1000),
          };
          await changeDcStatus(discord_token, dataRequest);
          resolve(toSetDcStatusString);
        } else if (minutesCheck !== diffMins) {
          minutesCheck = diffMins;
          await changeDcStatus(discord_token, dataRequest);
        }
      } catch (error) {
        reject(error);
      }
    })();
  });
}
