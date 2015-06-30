
var conn = new WebSocket('ws://localhost:8080/?username=' + encodeURIComponent(prompt('Username')));

conn.onopen = function(e) {
    console.log("Connection established!");
};

conn.onmessage = function(e) {
	var data = JSON.parse(e.data);
	
    if (data.type == 'clientList') {
		$('.active-connections').empty();
		data.clients.forEach(function(client) {
			$('.active-connections').append('<li>' + client + '</li>');
		});
	}
	
	console.log(e.data);
	
	if (data.type == 'message') {
		$('.chat-history').append('<li>' + data.msg + '</li>');
	}
	
};