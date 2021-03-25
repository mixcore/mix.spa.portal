function BaseHub(scope) {
  scope.isLog = true;
  scope.connection = null;
  scope.host = "/";
  scope.responses = [];
  scope.requests = [];
  scope.rooms = [];
  scope.others = [];
  scope.totalReconnect = 10;
  scope.timeDelay = 1000;

  scope.joinRoom = function (room) {
    scope.connection.invoke("JoinRoom", room);
  };

  scope.connect = function () {
    scope.connection.invoke("join", scope.player);
  };
  scope.sendMessage = function () {
    scope.connection.invoke("SendMessage", scope.request);
  };
  scope.receiveMessage = function (msg) {
    console.log(msg);
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
  scope.startConnection = async function (hubName, callback) {
    scope.connection = new signalR.HubConnectionBuilder()
      .withUrl(scope.host + hubName)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    // Create a function that the hub can call to broadcast messages.

    // https://docs.microsoft.com/en-us/aspnet/core/signalr/configuration?view=aspnetcore-3.1&tabs=dotnet
    //It's not possible to configure JSON serialization in the JavaScript client at this time.
    scope.connection.on("receive_message", (resp) => {
      console.log(resp);
      scope.receiveMessage(JSON.parse(resp));
    });
    scope.connection
      .start()
      .then(function () {
        console.log("connection started", scope.connection);
        if (callback) {
          callback();
        }
        //scope.$apply();
      })
      .catch(function (error) {
        console.log(`Cannot start the connection use transport.`, error);
        return Promise.reject(error);
      });
    // scope.connection.onclose(function (e) {
    //     var count = 0;
    //     setTimeout(function () {

    //         while (count < scope.totalReconnect) {
    //             if (scope.reconnect()) {
    //                 count = scope.totalReconnect;
    //             } else {
    //                 count++;
    //             }
    //         }
    //     }, scope.timeDelay);
    // });

    // scope.reconnect = function () {
    //     scope.connection.start()
    //         .then(function () {
    //             console.log('connection started', scope.connection);
    //             return true;
    //             //scope.$apply();
    //         })
    //         .catch(function (error) {
    //             console.log(`Cannot start the connection use transport.`, error);
    //             return false;
    //         });
    // };
  };

  scope.$onDestroy = function () {
    scope.connection.stop();
  };
}
