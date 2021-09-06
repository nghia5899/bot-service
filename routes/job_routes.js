const express = require('express')
const router = express.Router()

const jobController = require('../job/job')

router.use('/startJob', jobController.startJob)

router.use('/stopJob', jobController.stopJob)

router.use('/', (req, res) => {
  res.sendStatus(404).send('Not found')
})

module.exports = router