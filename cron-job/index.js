import cron from 'node-cron'
import { ethers } from 'ethers';
import { pollNotices } from './notice.poller.js'
import { sendPush } from './notification.sender.js';

function strToJson(payload) {
	return JSON.parse(payload);
}

function jsonToStr(jsonString) {
	return JSON.stringify(jsonString);
}

function hex2str(hex) {
	return ethers.toUtf8String(hex);
}

function str2hex(str) {
	return ethers.hexlify(ethers.toUtf8Bytes(str));
}

// Run every X seconds
cron.schedule('*/3 * * * * *', async () => {
  console.log('Running the cron job every 30 seconds')
  let notices = await pollNotices()
	
  for (let notice of notices) {
		console.log(notice)
		console.log(notice.node.payload)
		let body = strToJson(hex2str(notice.node.payload))
    await sendPush(body.target, body.message)
  }
});

setInterval(() => {}, 1000) // keep main "process"