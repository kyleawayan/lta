import axios from 'axios';

type CustomStatus = {
  text: string;
  expires_at: Date;
} | null;
export default async function setStatus(
  spotify_token: string,
  discord_token: string,
  currentArtist: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const currentTime = new Date();
    try {
      axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: {
          Authorization: `Bearer ${spotify_token}`,
        },
      })
        .then((spotifyResponse) => {
          let toSetDcStatusString = '';
          let dataRequest: CustomStatus = null;
          if (spotifyResponse.status !== 204) {
            toSetDcStatusString = spotifyResponse.data.item.artists[0].name;
            dataRequest = {
              text: `Listening to ${toSetDcStatusString}`,
              expires_at: new Date(currentTime.getTime() + 1440 * 60 * 1000),
            };
          }
          // eslint-disable-next-line promise/always-return
          if (currentArtist !== toSetDcStatusString) {
            axios({
              method: 'patch',
              url: 'https://discord.com/api/v8/users/@me/settings',
              headers: {
                Authorization: discord_token,
                'Content-Type': 'application/json',
              },
              data: { custom_status: dataRequest },
            });
            console.log('[🟢 lta] request made to discord');
          }
          resolve(toSetDcStatusString);
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}
