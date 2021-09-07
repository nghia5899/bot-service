var ConvertUtil = {
  convertoToMilliseconds(time) {
    return parseInt(time.toString().substring(0, time.toString().length - 3))
  }

}

module.exports = ConvertUtil