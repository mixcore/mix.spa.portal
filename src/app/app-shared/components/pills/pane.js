'use trick';
modules.directive('pill', function () {
    return {
        require: '^pills',
        restrict: 'E',
        transclude: true,
        scope: { header: '@', id: '@' },
        link: function (scope, element, attrs, tabsController) {
            tabsController.addPane(scope);
        },
        template:
            '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
            '</div>',
        replace: true
    };
})