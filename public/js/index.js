let socket = io()
socket.on("connect", function() {
	console.log("connected to server");
});

socket.on("disconnect", function() {
	console.log("disconnected from server");
});

socket.on("newMessage", function(message) {
	const formattedTime = moment(message.createdAt).format('LT');
	console.log("newMessage", message);
	let li = document.createElement('li');
	li.innerText = message.from + formattedTime + " : " + message.text;
	document.querySelector('body').appendChild(li);
	
});


socket.on("newLocationMessage", function(message) {
	console.log("newLocation", message);
	const formattedTime = moment(message.createdAt).format('LT');
	let li = document.createElement('li');
	let a = document.createElement("a");
	li.innerText = message.from + formattedTime + " : ";
	a.setAttribute("target","_blank");
	a.setAttribute("href", message.url);
	a.innerText= "My Current Location";	
	li.appendChild(a);

	document.querySelector('body').appendChild(li);
});

document.querySelector("#submit-btn").addEventListener('click', function(e) {
	e.preventDefault();

	socket.emit("createMessage", {
			from:"User",
			text: document.querySelector("input[name = 'message']").value
		}, function() {
	});
});

document.querySelector("#send-location").addEventListener('click', function(e) {
	e.preventDefault();
	if(!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}
	else {
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log(position);
			socket.emit('createLocationMessage', {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			})
		}, function() {
			alert("Unable To Fetch Position");
		});
	};
});
