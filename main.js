const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: 'wnyiHvwuGLqP7dRzETQQmVYLuJCja7bLoqsa91QefHU3LTkFjyws0TxmIo1GsOin',
  APISECRET: 'RL6tdabBjxqBebMuBRKJA8lbWhVvzX9WiSMChd06Rw7ZquMkcXGjTRnVQl8Q3xhA',
  'family': 4,
  'tld':'us',
  useServerTime: true,
  recvWindow: 60000, // Set a higher recvWindow to increase response timeout
  verbose: true, // Add extra output when subscribing to WebSockets, etc
  log: log => {
    console.log(log); // You can create your own logger here, or disable console output
  }
});


async function main() {
  const time = await binance.useServerTime();
  console.log(time.serverTime)
  binance.balance((error, balances) => {
    if ( error ) return console.error(error);
    console.info("ETH balance: ", balances);
  });

  /* //console.log(await binance.account())*/
  //console.info( await binance.futuresAccount() ); 

  /* binance.mgAccount((error, response) => {
    if ( error ) return console.warn(error);
    console.info("Account details response:", response)
 }) */
}


main()