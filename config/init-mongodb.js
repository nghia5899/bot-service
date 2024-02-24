const mongoose = require('mongoose')
const server = process.env.MONGODB_DATABASE_URL || 'mongodb://127.0.0.1:27017'
const database =  process.env.MONGODB_DATABASE || 'bot-binance'


console.log(server)
mongoose
  .connect(server + '/' + database, {
    useNewUrlParser: true,  
    useUnifiedTopology: true,  
    useFindAndModify: false,
    // useCreateIndex: true,
  })
  .catch((e) => {
    console.log(e.message)
  })

mongoose.connection.on('connected', () => {
  console.log('mongodb connected.......')
})

mongoose.connection.on('error', (e) => {
  console.log(e.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('mongodb connection is disconnected.')
})

module.exports = mongoose.connection
