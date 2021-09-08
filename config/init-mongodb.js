const mongoose = require('mongoose')
const server = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017'
const database =  process.env.MONGODB_DATABASE || 'crypto'
console.log(server)
mongoose
  .connect(server, {
    dbname: database,
    useNewUrlParser: true,  
    useUnifiedTopology: true,  
  })
  .then(() => {
    console.log('mongodb connected.......')
  })
  .catch((err) => {
    console.log(err.message)
  })

mongoose.connection.on('connected', () => {
  console.log('mongodb connected to db')
})

mongoose.connection.on('error', (err) => {
  console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('mongodb connection is disconnected.')
})

module.exports = mongoose.connection