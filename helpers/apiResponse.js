exports.successResponse = function (res, msg) {
	var data = {
		status: "Success",
		message: msg
	};
	return res.status(200).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
	var resData = {
		status: "Success",
		message: msg,
		data: data
	};
	return res.status(200).json(resData);
};

exports.successResponseWithPagination = function (res, msg, data, pagination) {
	var resData = {
		status: "Success",
		message: msg,
		data: data,
		pagination: pagination
	};
	return res.status(200).json(resData);
};

exports.ErrorResponse = function (res, msg) {
	var data = {
		status: "Error",
		message: msg,
	};
	return res.status(500).json(data);
};

exports.notFoundResponse = function (res, msg) {
	var data = {
		status: "Error",
		message: msg,
	};
	return res.status(404).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
	var resData = {
		status: "Error",
		message: msg,
		data: data
	};
	return res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
	var data = {
		status: "Error",
		message: msg,
	};
	return res.status(401).json(data);
};