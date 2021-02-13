
modules.component('checkboxSwitch', {
    templateUrl: '/mix-app/views/app-shared/components/checkbox-switch/view.html',
    controller: ['$rootScope', '$location', function ($rootScope, $location) {
        var ctrl = this;
        ctrl.guid = $rootScope.generateUUID();
        ctrl.$onInit = function () {
        };
        ctrl.limString = function (str, max) {
            if (str) {
                return (str.length > max) ? str.substring(0, max) + ' ...' : str;
            }
        };
    }],

    bindings: {
        data: '=',
        detailsUrl: '=',
        callback: '&',
        description: '='
    }
});