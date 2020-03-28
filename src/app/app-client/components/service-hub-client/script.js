modules.component('serviceHubClient', {
    templateUrl: '/app/app-client/components/service-hub-client/view.html',
    bindings: {
        attrSetName: '=?'
    },
    controller: ['$rootScope', '$scope', 'AttributeSetDataRestService',
        function ($rootScope, $scope, service) {
            var ctrl = this;
            BaseHub.call(this, ctrl);
            ctrl.user = {
                loggedIn: false,
                connection: {}
            };
            
            ctrl.attrData = null;
            ctrl.isHide = true;
            ctrl.hideContact = true;
            ctrl.members = [];
            ctrl.messages = [];
            ctrl.message = { connection: {}, content: '' };
            ctrl.request = {
                uid: '',
                action: '',
                objectType: null,
                data: {},
                room: '',
                isMyself: false
            };
            ctrl.init = function () {
                ctrl.attrSetId = ctrl.attrSetId || 0;
                ctrl.request.room = ctrl.attrSetName;
                ctrl.startConnection('serviceHub', ctrl.checkLoginStatus);
                ctrl.loadData();
            };
            ctrl.loadData = async function () {

                /*
                    If input is data id => load ctrl.attrData from service and handle it independently
                    Else modify input ctrl.attrData
                */
                $rootScope.isBusy = true;
                var getDefault = await service.initData(ctrl.attrSetName);
                if(getDefault.isSucceed){
                    ctrl.defaultData = getDefault.data;
                    ctrl.attrData = angular.copy(ctrl.defaultData);
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            };
            ctrl.submit = async function(){
                ctrl.request.action = "send_message";
                ctrl.request.uid = ctrl.user.connection.id;
                ctrl.request.data = ctrl.attrData;
                ctrl.message.connection = ctrl.user.connection;
                ctrl.connection.invoke('HandleRequest', JSON.stringify(ctrl.request));
                ctrl.attrData = angular.copy(ctrl.defaultData);
            };
            ctrl.newMessage = function(msg){
                console.log(msg);
                ctrl.messages.push(msg.data);
                $scope.$apply();
            };
            ctrl.newMember = function (member) {
                var m = $rootScope.findObjectByKey(ctrl.members, 'id', member.id);
                if(!m){
                    ctrl.members.push(member);
                }
                $scope.$apply();
            };           
            ctrl.join = function () {
                // var obj = {name: 'tinku', message: 'test'};
                // ctrl.connection.invoke("SendMessage", JSON.stringify(obj) ).catch(err => console.error(err.toString()));
                ctrl.request.action = "join_group";
                ctrl.request.uid = ctrl.user.connection.id;
                ctrl.request.data = ctrl.user.connection;
                ctrl.message.connection = ctrl.user.connection;
                ctrl.connection.invoke('HandleRequest', JSON.stringify(ctrl.request));

            };
            ctrl.initListMember = function (data) {
                data.forEach(member => {
                    var index = ctrl.members.findIndex(x => x.id === member.id);
                    if (index < 0) {
                        ctrl.members.splice(0, 0, member);
                    }    
                });
                
                $scope.$apply();
            };
            ctrl.receiveMessage = function (msg) {
                switch (msg.responseKey) {
                    case 'NewMember':
                        ctrl.newMember(msg.data);
                        $('.widget-conversation').scrollTop = $('.widget-conversation')[0].scrollHeight;
                        break;

                    case 'NewMessage':
                        ctrl.newMessage(msg.data);
                        break;
                    case 'ConnectSuccess':
                        ctrl.user.loggedIn = true;
                        ctrl.initListMember(msg.data);
                        $scope.$apply();
                        break;

                    case 'MemberOffline':
                        ctrl.removeMember(msg.data);
                        break;
                    case 'Error':
                        console.error(msg.data)
                        break;

                }

            };
            ctrl.checkLoginStatus = function () {
                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        // The user is logged in and has authenticated your
                        // app, and response.authResponse supplies
                        // the user's ID, a valid access token, a signed
                        // request, and the time the access token 
                        // and signed request each expire.
                        FB.api('/me', function (response) {
                            ctrl.user.connection.name = response.name;
                            ctrl.user.connection.id = response.id;
                            ctrl.user.connection.avatar = '//graph.facebook.com/' + response.id + '/picture?width=32&height=32';
                            ctrl.loggedIn = true;
                            ctrl.join();
                            $scope.$apply();
                        });
                    } else if (response.status === 'authorization_expired') {
                        // The user has signed into your application with
                        // Facebook Login but must go through the login flow
                        // again to renew data authorization. You might remind
                        // the user they've used Facebook, or hide other options
                        // to avoid duplicate account creation, but you should
                        // collect a user gesture (e.g. click/touch) to launch the
                        // login dialog so popup blocking is not triggered.
                    } else if (response.status === 'not_authorized') {
                        // The user hasn't authorized your application.  They
                        // must click the Login button, or you must call FB.login
                        // in response to a user gesture, to launch a login dialog.
                    } else {
                        // The user isn't logged in to Facebook. You can launch a
                        // login dialog with a user gesture, but the user may have
                        // to log in to Facebook before authorizing your application.
                    }
                });
            };
            ctrl.logout = function () {
                FB.logout(function (response) {
                    // user is now logged out
                    ctrl.user.loggedIn = false;
                });
            };
            ctrl.login = function () {
                FB.login(function (response) {
                    if (response.authResponse) {
                        FB.api('/me', function (response) {

                            ctrl.user.info.name = response.name;
                            ctrl.user.info.id = response.id;
                            ctrl.user.info.avatar = '//graph.facebook.com/' + response.id + '/picture?width=32&height=32';
                            ctrl.join();
                            $scope.$apply();
                        });
                    } else {
                        console.log('User cancelled login or did not fully authorize.');
                    }
                });
            };
        }]
});