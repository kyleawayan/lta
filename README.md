# lta
# WARNING: My Discord account has been disabled recently. This app may have caused this so please do not use this, only refer to this for educational purposes only.
Please check out lta's successor, [lta-fav](https://github.com/kyleawayan/lta-fav), that can only display one artist with Discord Rich Presence.

show currently playing artist as discord status

![](https://cdn.discordapp.com/attachments/766131619567632415/806805370697154570/unknown.png)

## disclaimer
this app is work in progress, and unfortunately you need to supply your discord token from the discord desktop app. there is no way (that I know about) to set your status through the rpc or web api with OAuth2. however, both your discord and spotify tokens will be encypted using your system's keychain. setting your custom status with your discord token takes place [here](https://github.com/kyleawayan/lta/blob/3c3b3ade0764c1078f37b2bb139cc779cef3b2a2/src/lta/setDcStatus.ts#L21-L36).

### how to find your discord token
1. inspect element in the discord desktop app
2. go to the network tab
3. on discord, set your custom status manually to something like "test"
4. once you change your custom status, you'll see a request called "settings" in the network tab. click on that
5. go to the headers on the sidebar that popped up, then scroll down to "request headers" and look for the "authorization" header. your token will be the value of the authorization header

## how to build
`yarn package`
