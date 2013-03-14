  var iAm, pc, localStream;
  var socket = io.connect('http://192.168.10.142:3000');

function createRTCPeerConnection()
{
  pc = new webkitRTCPeerConnection(null);
  pc.onicecandidate = function (event){
    socket.emit("iceChannel",JSON.stringify({"candidate":event.candidate}));
  };
  pc.onaddstream = function (evt) {
    vid1.src = URL.createObjectURL(evt.stream);
  };
}

function getLocalStream(isCaller)
{
  navigator.webkitGetUserMedia({ audio: false, video: true }, function (stream) {
      selfView.src = URL.createObjectURL(stream);
      localStream = stream;
  });
}

function gotDescription(desc) {
  pc.setLocalDescription(desc);
  socket.emit("sdpChannel",JSON.stringify({ "sdp": desc }));
}

function createOffer()
{
  pc.createOffer(gotDescription);
}

function createAnswer()
{
  pc.createAnswer(gotDescription);
}

function sendStream()
{
  pc.addStream(localStream);
}

function start(isCaller)
{
	createRTCPeerConnection();
  getLocalStream(false);
}

socket.on('sdpChannel', function (evt) {
    console.log("received message from sdpChannel");
    var signal = JSON.parse(evt);
    var remoteSD;
    if((remoteSD = new RTCSessionDescription(signal.sdp)))
    {
      pc.setRemoteDescription(remoteSD);
    }
});

socket.on('iceChannel', function (evt) {
    console.log("received message from iceChannel");
    var signal = JSON.parse(evt);
    if(signal.candidate)
      pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
});

pressIdentifyButton = function (client)
{
  console.log("Identifiyng as " + client);
  socket.emit("huevapiChannel",JSON.stringify({ iAm:client }));
};
