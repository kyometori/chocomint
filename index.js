const { ShardingManager } = require('discord.js');
require('dotenv').config();

/********** Constant **********/
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
/**/

const manager = new ShardingManager('./app.js', {
  token: process.env.TOKEN
});

manager.on('shardCreate', shard => console.log(`${GREEN}[SHARD#${shard.id}]${RESET} 開始中......`));

manager.spawn({ timeout: -1, amount: 3 }).then(() => {
  console.log(`${YELLOW}[MANAGER]${RESET} 載入完畢`);
});

['SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM', 'exit'].forEach(eventName => {
  process.on(eventName, cleanShards);
});

function cleanShards() {
  try {
    console.log(`${YELLOW}[MANAGER]${RESET} 開始結束程式`);
    manager.shards.each(shard => {
      shard.kill();
      console.log(`${GREEN}[SHARD#${shard.id}]${RESET} 結束運行`);
    })
    console.log(`${YELLOW}[MANAGER]${RESET} ${GREEN}確實結束${RESET}`);
  } catch {
    console.log(`${YELLOW}[MANAGER]${RESET} ${RED}出現異常${RESET}：如果你在這條訊息前有看到「確實結束」，就代表這條訊息是多餘的，並無異常`);
  }
}
