import cron from 'node-cron'
import { poolNotices } from './notice.pooler.js'

// Run every X seconds
cron.schedule('*/30 * * * * *', () => {
  console.log('Running the cron job every 30 seconds')
  poolNotices()
});

setInterval(() => {}, 1000) // keep main "process"