app.factory("ViewModel", [
  "$rootScope",
  function ($rootScope) {
    var viewmodel = {
      Users: [], // List of users that are logged in and ready for connections
      Username: "not logged in.", // My username, to be reflected in UI
      MyConnectionId: "", // My connection Id, so I can tell who I am
      Mode: "idle", // UI mode ['idle', 'calling', 'incall']
      Loading: false, // Loading indicator control
      muted: "muted", // Loading indicator control
    };

    // The user that represents me
    viewmodel.Me = function () {
      return $rootScope.findObjectByKey(
        this.Users,
        "MyConnectionId",
        viewmodel.MyConnectionId
      );
    };

    // The readable status of the UI
    viewmodel.CallStatus = function () {
      var callStatus;

      if (this.Mode == "idle") {
        callStatus = "Idle";
      } else if (this.Mode == "calling") {
        callStatus = "Calling...";
      } else {
        callStatus = "In Call";
      }

      return callStatus;
    };

    // Set a new array of users.  We could simply do viewmodel.Users([array]),
    // but the mapping plugin converts all the user props to observables for us.
    viewmodel.setUsers = function (userArray) {
      viewmodel.Users = userArray;
    };

    // Retreives the css class that should be used to represent the user status.
    // I can't get this to work as just a dynamic class property for some reason.
    viewmodel.getUserStatus = function (user) {
      var css;

      if (user == viewmodel.Me()) {
        css = "icon-user";
      } else if (user.InCall()) {
        css = "icon-phone-3";
      } else {
        css = "icon-phone-4";
      }

      return css;
    };

    // Return the viewmodel so that we can change props later
    return viewmodel;
  },
]);
