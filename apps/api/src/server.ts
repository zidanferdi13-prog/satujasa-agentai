import 'dotenv/config'

import { createApp } from './app.js'
import { loadConfig } from './config.js'

const config = loadConfig()
const app = createApp(config)

app.listen(config.PORT, config.HOST, () => {
  console.log(`STNK Jasa API listening on http://${config.HOST}:${config.PORT}`)
})
