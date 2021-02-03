import axios from 'axios';

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
          // eslint-disable-next-line promise/always-return
          if (currentArtist !== spotifyResponse.data.item.artists[0].name) {
            axios({
              method: 'patch',
              url: 'https://discord.com/api/v8/users/@me/settings',
              headers: {
                Authorization: discord_token,
                'Content-Type': 'application/json',
              },
              data: {
                custom_status: {
                  text: `Listening to ${spotifyResponse.data.item.artists[0].name}`,
                  expires_at: new Date(currentTime.getTime() + 5 * 60 * 1000),
                },
              },
            });
          }
          resolve(spotifyResponse.data.item.artists[0].name);
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}
