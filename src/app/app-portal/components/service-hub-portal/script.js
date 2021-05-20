modules.component("serviceHubPortal", {
  templateUrl:
    "/mix-app/views/app-portal/components/service-hub-portal/view.html",
  bindings: {
    mixDatabaseName: "=",
    isSave: "=?",
  },
  controller: [
    "$rootScope",
    "$scope",
    "RestMixDatabaseColumnPortalService",
    "RestMixDatabaseDataClientService",
    "UserServices",
    function ($rootScope, $scope, columnService, service, userServices) {
      var ctrl = this;
      BaseHub.call(this, ctrl);
      ctrl.localizeSettings = $rootScope.globalSettings;
      ctrl.user = {
        loggedIn: false,
        connection: {},
      };
      ctrl.mixDatabaseData = null;
      ctrl.isHide = true;
      ctrl.hideContact = true;
      ctrl.columns = [];
      ctrl.members = [];
      ctrl.errors = [];
      ctrl.messages = {
        items: [],
      };
      ctrl.message = { connection: {}, content: "" };
      ctrl.request = {
        uid: "",
        specificulture: "",
        action: "",
        objectType: null,
        data: {},
        room: "",
        isMyself: true,
        isSave: false,
      };
      ctrl.init = function () {
        ctrl.mixDatabaseId = ctrl.mixDatabaseId || 0;
        ctrl.request.specificulture = service.lang;
        ctrl.request.room = ctrl.mixDatabaseName;
        ctrl.request.isSave = ctrl.isSave == "true" || false;
        ctrl.startConnection("serviceHub", ctrl.checkLoginStatus);
      };
      ctrl.loadData = async function () {
        /*
                    If input is data id => load ctrl.mixDatabaseData from service and handle it independently
                    Else modify input ctrl.mixDatabaseData
                */
        $rootScope.isBusy = true;
        var getDefault = await service.initData(ctrl.mixDatabaseName);
        if (getDefault.isSucceed) {
          ctrl.defaultData = getDefault.data;
          ctrl.defaultData.data.user_name = ctrl.user.connection.name;
          ctrl.defaultData.data.user_id = ctrl.user.connection.id;
          ctrl.defaultData.data.user_avatar = ctrl.user.connection.avatar;
          ctrl.defaultData.data.data_type = 9;
          ctrl.mixDatabaseData = angular.copy(ctrl.defaultData);
          $rootScope.isBusy = false;
        }
        var getFields = await columnService.initData(ctrl.mixDatabaseName);
        if (getFields.isSucceed) {
          ctrl.columns = getFields.data;
        }
      };
      ctrl.submit = async function () {
        if (ctrl.validate()) {
          ctrl.request.action = "send_group_message";
          ctrl.request.uid = ctrl.user.connection.id;
          ctrl.request.data = ctrl.mixDatabaseData.data;
          ctrl.request.connection = ctrl.user.connection;
          ctrl.connection.invoke("HandleRequest", JSON.stringify(ctrl.request));
          ctrl.mixDatabaseData = angular.copy(ctrl.defaultData);
        }
      };
      ctrl.validate = function () {
        var isValid = true;
        ctrl.errors = [];
        angular.forEach(ctrl.columns, function (column) {
          if (column.regex) {
            var regex = RegExp(column.regex, "g");
            isValid = regex.test(ctrl.mixDatabaseData.data[column.name]);
            if (!isValid) {
              ctrl.errors.push(`${column.name} is not match Regex`);
            }
          }
          if (isValid && column.isEncrypt) {
            ctrl.mixDatabaseData.data[column.name] = $rootScope.encrypt(
              ctrl.mixDatabaseData.data[column.name]
            );
          }
        });
        return isValid;
      };
      ctrl.receiveMessage = function (msg) {
        switch (msg.responseKey) {
          case "NewMember":
            ctrl.newMember(msg.data);
            // $('.widget-conversation').scrollTop = $('.widget-conversation')[0].scrollHeight;
            break;
          case "NewMessage":
            ctrl.newMessage(msg.data);
            break;
          case "ConnectSuccess":
            ctrl.user.loggedIn = true;
            ctrl.initListMember(msg.data);
            $scope.$apply();
            break;
          case "PreviousMessages":
            ctrl.messages = msg.data;
            $scope.$apply();
            break;
          case "MemberOffline":
            ctrl.removeMember(msg.data);
            break;
          case "Error":
            console.error(msg.data);
            break;
        }
      };
      ctrl.newMessage = function (msg) {
        ctrl.messages.items.push(msg);
        $scope.$apply();
      };
      ctrl.newMember = function (member) {
        var m = $rootScope.findObjectByKey(ctrl.members, "id", member.id);
        if (!m) {
          ctrl.members.push(member);
        }
        $scope.$apply();
      };
      ctrl.join = async function () {
        ctrl.request.action = "join_group";
        ctrl.request.uid = ctrl.user.connection.id;
        ctrl.request.data = ctrl.user.connection;
        ctrl.message.connection = ctrl.user.connection;
        ctrl.connection.invoke("HandleRequest", JSON.stringify(ctrl.request));
        await ctrl.loadData();
        $scope.$apply();
      };
      ctrl.initListMember = function (data) {
        data.forEach((member) => {
          var index = ctrl.members.findIndex((x) => x.id === member.id);
          if (index < 0) {
            ctrl.members.splice(0, 0, member);
          }
        });

        $scope.$apply();
      };

      ctrl.checkLoginStatus = async function () {
        var response = await userServices.getMyProfile();
        ctrl.user.connection.name = response.data.username;
        ctrl.user.connection.id = response.data.id;
        ctrl.user.connection.connectionId = ctrl.connection.connectionId;
        ctrl.user.connection.avatar = response.data.avatar;
        ctrl.user.loggedIn = true;
        ctrl.join();
      };
    },
  ],
});
