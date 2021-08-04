modules.component("videoChatHub", {
  templateUrl: "/mix-app/views/app-client/components/video-chat-hub/view.html",
  bindings: {
    mixDatabaseName: "=",
    isSave: "=?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "VideoChatService",
    "ViewModel",
    "ConnectionManager",
    function ($rootScope, $scope, service, viewmodel, connectionManager) {
      var ctrl = this;
      BaseHub.call(this, ctrl);
      ctrl.localizeSettings = $rootScope.globalSettings;
      ctrl.webrtcDetectedBrowser = null;
      ctrl.init = function () {
        ctrl.viewmodel = viewmodel;
        _start();
      };
      ctrl.toogleMute = function () {
        if (
          ctrl._mediaStream != null &&
          ctrl._mediaStream.getAudioTracks().length > 0
        ) {
          ctrl.viewmodel.muted = !ctrl.viewmodel.muted;
          ctrl._mediaStream.getAudioTracks()[0].enabled = ctrl.viewmodel.muted;
        }
      };
      ctrl.toogleVideo = function () {
        if (
          ctrl._mediaStream != null &&
          ctrl._mediaStream.getVideoTracks().length > 0
        ) {
          ctrl.viewmodel.video = !ctrl.viewmodel.video;
          ctrl._mediaStream.getVideoTracks()[0].enabled = ctrl.viewmodel.video;
        }
      };

      ctrl._mediaStream = null;

      var _hub,
        _connect = function (username, onSuccess, onFailure) {
          var hub = new signalR.HubConnectionBuilder()
            .withUrl("/videoChatHub")
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();
          // Setup client SignalR operations
          _setupHubCallbacks(hub);
          hub
            .start()
            .then(function () {
              console.log(
                "connected to SignalR hub... connection id: " + hub.connectionId
              );

              // Tell the hub what our username is
              hub.invoke("Join", username);

              if (onSuccess) {
                onSuccess(hub);
              }
              //scope.$apply();
            })
            .catch(function (error) {
              console.log(`Cannot start the connection use transport.`, error);
              if (onFailure) {
                onFailure(event);
              }
              return Promise.reject(error);
            });

          _hub = hub;
        },
        _start = function () {
          // Show warning if WebRTC support is not detected
          if (ctrl.webrtcDetectedBrowser == null) {
            console.log("Your browser doesnt appear to support WebRTC.");
            $(".browser-warning").show();
          }

          // Then proceed to the next step, gathering username
          _getUsername();
        },
        _getUsername = function () {
          alertify.prompt(
            "What is your name?",
            function (e, username) {
              if (e == false || username == "") {
                username = "User " + Math.floor(Math.random() * 10000 + 1);
                alertify.success(
                  "You really need a username, so we will call you... " +
                    username
                );
              }

              // proceed to next step, get media access and start up our connection
              _startSession(username);
            },
            ""
          );
        },
        _startSession = function (username) {
          ctrl.viewmodel.Username = username; // Set the selected username in the UI
          ctrl.viewmodel.Loading = true; // Turn on the loading indicator
          $scope.$apply();
          // Ask the user for permissions to access the webcam and mic
          getUserMedia(
            {
              // Permissions to request
              video: true,
              audio: true,
            },
            function (stream) {
              // succcess callback gives us a media stream
              $(".instructions").hide();

              // Now we have everything we need for interaction, so fire up SignalR
              _connect(
                username,
                function (hub) {
                  // tell the viewmodel our conn id, so we can be treated like the special person we are.
                  ctrl.viewmodel.MyConnectionId = hub.connectionId;

                  // Initialize our client signal manager, giving it a signaler (the SignalR hub) and some callbacks
                  console.log("initializing connection manager");
                  connectionManager.initialize(
                    hub,
                    _callbacks.onReadyForStream,
                    _callbacks.onStreamAdded,
                    _callbacks.onStreamRemoved
                  );

                  // Store off the stream reference so we can share it later
                  ctrl._mediaStream = stream;
                  ctrl._mediaStream.getAudioTracks()[0].enabled = true;
                  ctrl._mediaStream.getVideoTracks()[0].enabled = false;
                  // Load the stream into a video element so it starts playing in the UI
                  //console.log('playing my local video feed');
                  var videoElement = document.querySelector(".video.mine");
                  videoElement.volume = 0;
                  setTimeout(() => {
                    videoElement.volume = 0.5;
                  }, 2000);
                  attachMediaStream(videoElement, ctrl._mediaStream);

                  // Hook up the UI
                  ctrl.viewmodel.Loading = false;
                },
                function (event) {
                  alertify.alert(
                    "<h4>Failed SignalR Connection</h4> We were not able to connect you to the signaling server.<br/><br/>Error: " +
                      JSON.stringify(event)
                  );
                  ctrl.viewmodel.Loading = false;
                }
              );
            },
            function (error) {
              // error callback
              alertify.alert(
                "<h4>Failed to get hardware access!</h4> Do you have another browser type open and using your cam/mic?<br/><br/>You were not connected to the server, because I didn't code to make browsers without media access work well. <br/><br/>Actual Error: " +
                  JSON.stringify(error)
              );
              ctrl.viewmodel.Loading = false;
            }
          );
        },
        _setupHubCallbacks = function (hub) {
          // Hub Callback: Incoming Call
          hub.on("incomingCall", (callingUser) => {
            console.log("incoming call from: " + callingUser);
            callingUser = JSON.parse(callingUser);
            // Ask if we want to talk
            alertify.confirm(
              callingUser.Username + " is calling.  Do you want to chat?",
              function (e) {
                if (e) {
                  // I want to chat
                  hub.invoke("answerCall", true, callingUser.ConnectionId);

                  // So lets go into call mode on the UI
                  ctrl.viewmodel.Mode = "incall";
                } else {
                  // Go away, I don't want to chat with you
                  hub.invoke("answerCall", false, callingUser.ConnectionId);
                }
              }
            );
          });

          // Hub Callback: Call Accepted
          hub.on("callAccepted", (acceptingUser) => {
            console.log(
              "call accepted from: " +
                acceptingUser +
                ".  Initiating WebRTC call and offering my stream up..."
            );
            acceptingUser = JSON.parse(acceptingUser);
            // Callee accepted our call, let's send them an offer with our video stream
            connectionManager.initiateOffer(
              acceptingUser.ConnectionId,
              ctrl._mediaStream
            );

            // Set UI into call mode
            ctrl.viewmodel.Mode = "incall";
          });

          // Hub Callback: Call Declined
          hub.on("callDeclined", (decliningConnectionId, reason) => {
            console.log("call declined from: " + decliningConnectionId);

            // Let the user know that the callee declined to talk
            alertify.error(reason);

            // Back to an idle UI
            ctrl.viewmodel.Mode = "idle";
          });

          // Hub Callback: Call Ended
          hub.on("callEnded", (connectionId, reason) => {
            console.log("call with " + connectionId + " has ended: " + reason);

            // Let the user know why the server says the call is over
            alertify.error(reason);

            // Close the WebRTC connection
            connectionManager.closeConnection(connectionId);

            // Set the UI back into idle mode
            ctrl.viewmodel.Mode = "idle";
          });
          // Hub Callback: Update User List
          hub.on("updateUserList", (userList) => {
            ctrl.viewmodel.Users = JSON.parse(userList);
            $scope.$apply();
          });
          // Hub Callback: WebRTC Signal Received
          hub.on("receiveSignal", (callingUser, data) => {
            callingUser = JSON.parse(callingUser);
            connectionManager.newSignal(callingUser.ConnectionId, data);
          });
        },
        // Connection Manager Callbacks
        _callbacks = {
          onReadyForStream: function (connection) {
            // The connection manager needs our stream
            // todo: not sure I like this
            connection.addStream(ctrl._mediaStream);
          },
          onStreamAdded: function (connection, event) {
            console.log("binding remote stream to the partner window");

            // Bind the remote stream to the partner window
            var otherVideo = document.querySelector(".video.partner");
            attachMediaStream(otherVideo, event.stream); // from adapter.js
          },
          onStreamRemoved: function (connection, streamId) {
            // todo: proper stream removal.  right now we are only set up for one-on-one which is why this works.
            console.log("removing remote stream from partner window");

            // Clear out the partner window
            var otherVideo = document.querySelector(".video.partner");
            otherVideo.srcObject = null;
          },
        };
      ctrl.callUser = function (targetConnectionId) {
        // Make sure we are in a state where we can make a call
        if (ctrl.viewmodel.Mode !== "idle") {
          alertify.error(
            "Sorry, you are already in a call.  Conferencing is not yet implemented."
          );
          return;
        }
        // Then make sure we aren't calling ourselves.
        if (targetConnectionId != ctrl.viewmodel.MyConnectionId) {
          // Initiate a call
          _hub.invoke("callUser", targetConnectionId);

          // UI in calling mode
          ctrl.viewmodel.Mode = "calling";
        } else {
          alertify.error("Ah, nope.  Can't call yourself.");
        }
      };
      ctrl.hangup = function () {
        // Only allow hangup if we are not idle
        if (ctrl.viewmodel.Mode != "idle") {
          _hub.invoke("hangUp");
          connectionManager.closeAllConnections();
          ctrl.viewmodel.Mode = "idle";
        }
      };
    },
  ],
});
