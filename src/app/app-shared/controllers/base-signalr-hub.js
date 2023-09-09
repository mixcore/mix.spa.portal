//https://docs.microsoft.com/en-us/aspnet/core/signalr/javascript-client?view=aspnetcore-6.0&tabs=visual-studio
function BaseHub(scope) {
  scope.isLog = true;
  scope.connection = null;
  scope.host = "/hub/";
  scope.responses = [];
  scope.hubRequests = [];
  scope.rooms = [];
  scope.others = [];
  scope.totalReconnect = 10;
  scope.timeDelay = 1000;
  scope.hubRequest = {
    action: "NewMessage",
    title: "New Message",
    message: "",
    data: {},
  };
  scope.joinRoom = function (room) {
    scope.connection.invoke("JoinRoom", room);
    scope.room = room;
  };

  scope.connect = function () {
    scope.connection.invoke("join", scope.player);
  };
  scope.sendGroupMessage = function () {
    scope.connection.invoke(
      "SendGroupMessage",
      scope.hubRequest,
      scope.room,
      false
    );
    scope.hubRequest.message = "";
    scope.hubRequest.data = {};
  };
  scope.sendPrivateMessage = function (connectionId, selfReceive = true) {
    scope.connection.invoke(
      "SendPrivateMessage",
      scope.hubRequest,
      connectionId,
      selfReceive
    );
    scope.hubRequest.message = "";
    scope.hubRequest.data = {};
  };
  scope.receiveMessage = function (msg) {
    scope.responses.splice(0, 0, msg);
    scope.$applyAsync();
  };
  scope.prettyJsonObj = function (obj) {
    return JSON.stringify(obj, null, "\t");
  };
  // Starts a connection with transport fallback - if the connection cannot be started using
  // the webSockets transport the function will fallback to the serverSentEvents transport and
  // if this does not work it will try longPolling. If the connection cannot be started using
  // any of the available transports the function will return a rejected Promise.
  scope.startConnection = async function (hubName, token, errorCallback) {
    scope.connection = new signalR.HubConnectionBuilder()
      .withUrl(scope.host + hubName, {
        accessTokenFactory: () => token,
      })
      //   .withHubProtocol(new signalR.protocols.msgpack.MessagePackHubProtocol())
      .withAutomaticReconnect()
      //   .configureLogging(signalR.LogLevel.Trace)
      .build();
    // Create a function that the hub can call to broadcast messages.

    scope.connection.on("receive_message", (msg) => {
      if (msg && !angular.isObject(msg) && msg.indexOf("{") == 0) {
        msg = JSON.parse(msg);
      }
      scope.receiveMessage(msg);
    });
    scope.connection.onreconnected((connectionId) => {
      if (scope.onConnected) {
        scope.onConnected();
      }
    });
    scope.connection
      .start()
      .then(function () {
        console.log("connection started", scope.connection);
        if (scope.onConnected) {
          scope.onConnected();
        }
      })
      .catch(function (error) {
        if (errorCallback) {
          errorCallback(error);
        }
        return Promise.reject(error);
      });
    scope.connection.onclose((error) => {
      console.assert(
        scope.connection.state === signalR.HubConnectionState.Disconnected
      );

      let textContent = `Connection closed due to error "${error}". Try refreshing this page to restart the connection.`;
      console.error(textContent);
    });

    scope.reconnect = function () {
      scope.connection
        .start()
        .then(function () {
          if (scope.onConnected) {
            scope.onConnected();
          }
          return true;
        })
        .catch(function (error) {
          console.log(`Cannot start the connection use transport.`, error);
          return false;
        });
    };
  };
  if (scope.$on) {
    scope.$on("$destroy", function () {
      if (scope.onLeave) {
        scope.onLeave();
      }
      if (scope.connection) {
        scope.connection.stop();
      }
    });
  }
}
