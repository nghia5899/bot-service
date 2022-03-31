module.exports = function createLog(name) {
  function logger(messgae) {
    return ` -- ${name} -- \n ${messgae}`
  }
  return logger
}