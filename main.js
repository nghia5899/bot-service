
const bip39 = require('bip39');
const {TronWeb} = require('tronweb');
const { hdkey } = require('ethereumjs-wallet');
const axios = require('axios');
const cronJob = require('cron')
const bot = require('./bot');

const privateKeys = [
  '6fa304826c84df7d43de5b585fe38737d8c1ae1c86981cf382f945a2ae538867', // Replace with actual private key 1
  'fdd979e103450b93908c9780dfe66713e3113c91df08bb2535bc4a5d728cf64d', // Replace with actual private key 2
  // Add more private keys as required
];

let jobGetBalance = new cronJob.CronJob({
  cronTime: '*/10 * * * * *', 
  onTick: async function() {
    console.log(`Time - ${getTime().toLocaleLowerCase()}`)
    const balanceTrx = await getTrxBalance('TPvSKhp21CWB8oEZeeTB9KJEUbmvQ7LAg7')
    if (balanceTrx > 1.35) {
      const amount = balanceTrx - 1.35
      console.log(amount)
      const result = await sendMultiSignTrx(privateKeys, 'TUgbEe82vCpujD9hSJRuuHv2NaP6rdHxzZ', amount)
      if (result) {
        bot.sendMessage(amount + ' trx')
      }
    }
  },
  timeZone: 'Asia/Ho_Chi_Minh'
})

function main() {
  console.log("Start........")
  jobGetBalance.start()
}
main()

function getTime() {
  let today = new Date();
  return `${today.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })} ${Date.now()}`
}

async function sendMultiSignTrx(privateKeys, toAddress, amount) {
  if (!Array.isArray(privateKeys) || privateKeys.length < 2) {
      throw new Error('Provide at least two private keys for multisignature.');
  }

  // Initialize TronWeb (Mainnet)
  const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io', // Change to Testnet if needed
      privateKey: 'fdd979e103450b93908c9780dfe66713e3113c91df08bb2535bc4a5d728cf64d'
  });

  try {
      const fromAddress = tronWeb.address.fromPrivateKey('6fa304826c84df7d43de5b585fe38737d8c1ae1c86981cf382f945a2ae538867');
      console.log('From address: ', fromAddress);
      // Convert amount to SUN (1 TRX = 1,000,000 SUN)
      const amountInSun = tronWeb.toSun(amount);
      console.log('Amount: ', amountInSun, ' sun')

      const isValid = tronWeb.isAddress(toAddress);
      console.log(isValid ? "Địa chỉ hợp lệ" : "Địa chỉ không hợp lệ");
      // Create an unsigned transaction
      const unsignedTx = await tronWeb.transactionBuilder.sendTrx(toAddress, amountInSun, fromAddress, {permissionId: 2});

      var signedTransaction = await tronWeb.trx.multiSign(unsignedTx, '6fa304826c84df7d43de5b585fe38737d8c1ae1c86981cf382f945a2ae538867');

      signedTransaction = await tronWeb.trx.multiSign(signedTransaction, 'fdd979e103450b93908c9780dfe66713e3113c91df08bb2535bc4a5d728cf64d');

      // Broadcast the transaction

      const result = await tronWeb.trx.sendRawTransaction(signedTransaction);

      if (result.result) {
          console.log('Transaction successful!');
          console.log('Transaction ID:', result.txid);
          return true
      } else {
          console.error('Transaction failed:', result);
          return false
      }
  } catch (error) {
      console.error('Error sending multisignature transaction:', error);
      return false
  }
}

async function sendTrx(privateKey, toAddress, amount) {
  // Connect to TronGrid (Mainnet). For Testnet, use 'https://nile.trongrid.io'.
  const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io', // Change to Testnet if needed
      privateKey: privateKey,
  });

  try {
      // Convert the amount to SUN (1 TRX = 1,000,000 SUN)
      const amountInSun = tronWeb.toSun(amount);

      // Create an unsigned transaction
      const tx = await tronWeb.transactionBuilder.sendTrx(toAddress, amountInSun);

      // Sign the transaction
      const signedTx = await tronWeb.trx.sign(tx);

      // Broadcast the transaction
      const receipt = await tronWeb.trx.sendRawTransaction(signedTx);

      if (receipt.result) {
          console.log('Transaction successful!');
          console.log('Transaction ID:', receipt.txid);
      } else {
          console.log('Transaction failed:', receipt);
      }
  } catch (error) {
      console.error('Error sending transaction:', error);
  }
}

async function getTrxBalance(address) {
  // Connect to TronGrid (Mainnet). For Testnet, use 'https://nile.trongrid.io'.
  const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io', // Change to Testnet if needed
  });

  try {
      // Get the balance in SUN (smallest unit)
      const balanceInSun = await tronWeb.trx.getBalance(address);

      // Convert balance from SUN to TRX
      const balanceInTrx = tronWeb.fromSun(balanceInSun);

      console.log(`Balance of ${address}: ${balanceInTrx} TRX`);
      return balanceInTrx;
  } catch (error) {
      console.error('Error fetching balance:', error);
  }
}

function getBalanceTrx1(address) {
  return new Promise((resolve, reject) => {
    const instance = axios.create()
    instance.get('https://apilist.tronscan.org/api/account/tokens?address=' + address)
      .then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
  })
}