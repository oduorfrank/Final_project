
var clientId = 'apiyo-web';

/*********** public broker ************/
// var host = 'broker.mqttdashboard.com';
var host = 'broker.hivemq.com'; // https://www.hivemq.com/public-mqtt-broker/
var port = 8000;
/*************************************** */

var subTopic = 'apiyo/web';
var pubTopic = 'apiyo/arduino';
var client = new Paho.MQTT.Client(host, port, clientId);

var st1Elem = document.getElementById('st1');
var st2Elem = document.getElementById('st2');
var st3Elem = document.getElementById('st3');
var st4Elem = document.getElementById('st4');
var st5Elem = document.getElementById('st5');

var stations = {
	'12 14 B1 2F': st1Elem,
	'F6 34 F9 25': st2Elem,
	'ED B9 E0 2B': st3Elem,
	'83 87 3B 2E': st4Elem,
	'F6 34 F9 27': st5Elem,
}
var connStatElem = document.getElementById('conn-stat');

function startSession(){
	client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ 
        onSuccess: onConnect,
        onFailure: onFailure
	});
	// reset the colors
	// resetColors();
}

function onConnect(){
	client.subscribe(subTopic);
	// sendMessage('start:'+teams);
	connStatElem.innerText = 'Status: Connected';
	console.log('MQTT', 'connected');
}

function onMessageArrived(message){
	var payload = message.payloadString;
	// document.getElementById('sq'+payload).style.backgroundColor = "green";	
	stations[payload].style.backgroundColor = "green";	
	console.log("onMessageArrived: "+ payload);
}

function resetColors(){
	// sendMessage('reset');
	// for(var i = 0; i < stationList.length; i++){
	// 	var station = stationList[i];
	// 	document.getElementById('sq'+station).style.backgroundColor = "rosybrown";		
	// }
	for (var key in stations) {
		stations[key].style.backgroundColor = "rosybrown";
	}
}

function onConnectionLost(response){
	connStatElem.innerText = 'Status: Connection Lost';
	console.log('MQTT', 'connection lost');
	if (response.errorCode !== 0) {
		console.log("onConnectionLost: "+response.errorMessage);
	}
}

function stopSession() {
	// sendMessage('stop');
	client.disconnect();
	resetColors();
	connStatElem.innerText = 'Status: Disonnected';
	console.log('MQTT', 'disconnected successfully');
}

function onFailure(){
	connStatElem.innerText = 'Status: Connection Failed';
	console.log('MQTT', 'failure');
}

function sendMessage(value){
	var message = new Paho.MQTT.Message(value);
	message.destinationName = pubTopic;
	client.send(message);
}

function clickELem(elem) {
	var val = elem.innerText;
	sendMessage(val);
	elem.style.backgroundColor = "red";
}