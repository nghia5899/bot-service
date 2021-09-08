function ResponseData(status, msg, data) {
  if (!new.target) {
    return new ResponseData(status || '', msg || '', data || []);
  }
  this.toJson = function() {
    return {
      status: status,
      message: msg,
      data: data
    }
  }
}

function ResponseDataWithPagination(status, msg, data, pagination) {
  if (!new.target) {
    return new ResponseData(status || '', msg || '', data || [], pagination || []);
  }
  this.toJson = function() {
    return {
      status: status,
      message: msg,
      data: data ,
      pagination: pagination
    }
  }
}

module.exports = { ResponseData , ResponseDataWithPagination}