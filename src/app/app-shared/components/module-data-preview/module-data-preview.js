
modules.component('moduleDataPreview', {
    templateUrl: '/app/app-shared/components/module-data-preview/module-data-preview.html',
    controller: ['$rootScope', function ($rootScope) {
        var ctrl = this;
    }
    ],
    bindings: {
        data: '=',
        width: '=',
        header: '='
    }
});