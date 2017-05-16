const Mastodon = require('mastodon-api')
const mastodon = new Mastodon({
  access_token: settings.token,
  timeout_ms: 30*1000,
  api_url: settings.api_url
})
const stream = mastodon.stream('streaming/public')
stream.on('message', (msg)=> {
  postMessage(msg)
})
