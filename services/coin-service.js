const { Wallet } = require('ethers');

const coinService = {
   async calculate(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = req.body
        console.log(req.body)
        const time = data.time
        const id = data.id
        const result = (id * time) % id
        return resolve(result)
      } catch (e) {
        return resolve({status: false, message: 'Error'})
      }
    })
  },
  async sign(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = req.body
        console.log(req.body)
        const message = data.message;
        const privateKey = data.privateKey;

        const signature = await signMessageWithEthers(privateKey, message)
        return resolve({status: true, data: signature})

      } catch (e) {
        return resolve({status: false, message: 'Error'})
      }
    })
  },
}

async function signMessageWithEthers(privateKey, message) {
  const wallet = new Wallet(privateKey);
  const signature = await wallet.signMessage(message);
  return signature;
}

module.exports = coinService
