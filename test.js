const Binance = require('node-binance-api');
const crypto = require('crypto');
const binance = new Binance().options({
  APIKEY: 'suITJRCwQpPrn7OJWdnOgqPGMyV9GD3yhnJq5NaqYHSIXPlRUwczYUW8z3WC1BVl',
  APISECRET:'aec3ykaRSrNzUyWun0pE5pZEWXX52dbUKahj1O38zZ7ZIsYNwHLmPsAJinp5x69d',
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
  console.log(time)
  /* binance.balance((error, balances) => {
    if ( error ) return console.error(error);
    console.info("ETH balance: ", balances);
  }); */

  /* //console.log(await binance.account())*/
  //console.info( await binance.futuresAccount() ); 

  /* binance.mgAccount((error, response) => {
    if ( error ) return console.warn(error);
    console.info("Account details response:", response)
 }) */

    const timeOffset = 123 - new Date().getTime()

    const query_string = `timestamp=${time.serverTime}&recvWindow=60000`;
    const apiSecret = 'aec3ykaRSrNzUyWun0pE5pZEWXX52dbUKahj1O38zZ7ZIsYNwHLmPsAJinp5x69d';
    
    function signature(query_string) {
        return crypto
            .createHmac('sha256', 'aec3ykaRSrNzUyWun0pE5pZEWXX52dbUKahj1O38zZ7ZIsYNwHLmPsAJinp5x69d')
            .update(query_string)
            .digest('hex');
    }
    
    console.log("hashing the string: ");
    console.log(query_string);
    console.log("and return:");
    console.log(signature(query_string));
    
    console.log("\n");
    
    const another_query = 'symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559';
    console.log("hashing the string: ");
    console.log(another_query);
    console.log("and return:");
    console.log(signature(another_query));
}


main()