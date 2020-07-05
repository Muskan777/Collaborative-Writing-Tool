let expect = require("expect");

var {generateMessage, generateLocationMessage} = require("./message");

describe("Generate Message", function() {
	it("should generate correct message object", function() {
		let from = "WDJ";
		let	text = "Some Random text";
		let	message = generateMessage(from, text);

		expect(typeof message.createdAt).toBe('number');
		expect(message).toMatchObject({from, text});
	})
})

describe("Generate Location Message", function() {
	it("should generate correct message object", function() {
		let from = "Clair";
		let lat = 15;
		let lng = 56;
		let url = "https://www.google.com/maps?q="+ lat + ","+ lng;
		let message = generateLocationMessage(from, lat, lng);

	expect(typeof message.createdAt).toBe('number');
	expect(message).toMatchObject({from, url});
	})
})