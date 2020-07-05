const moment = require("moment");

let generateMessage = function(from, text) {
	return {
		from,
		text,
	};
};

let generateLocationMessage = function(from, lat, lng) {
	return {
		from,
		url :"https://www.google.com/maps?q="+ lat + ","+ lng,
	}
}

module.exports = {generateMessage, generateLocationMessage};