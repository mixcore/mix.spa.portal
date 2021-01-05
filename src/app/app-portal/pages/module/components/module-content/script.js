
app.component('moduleContent', {
    templateUrl: '/app/app-portal/pages/module/components/module-content/view.html',
    bindings: {
        model: '=',
        addictionalData: "=",
    },
    controller: ['$rootScope', function ($rootScope) {
        var ctrl = this;
        ctrl.settings = $rootScope.globalSettings;
    }]
});