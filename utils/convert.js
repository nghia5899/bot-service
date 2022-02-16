var ConvertUtil = {
  convertoToMilliseconds(time) {
    return parseInt(time.toString().substring(0, time.toString().length - 3))
  },
  checkAdmin(role) {
    return role && role.toLowerCase() === 'admin'
  }
}

module.exports = ConvertUtil