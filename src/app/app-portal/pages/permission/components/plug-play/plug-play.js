app.component('permissionPlugPlay', {
    templateUrl: '/app/app-portal/pages/permission/components/plug-play/plug-play.html',
    bindings: {
        page: '=',
        pages: '=',
        prefixParent: '=',
        prefixChild: '=',
        searchText: '=',
        onDelete: '&',
        onUpdate: '&'
    },
    controller: ['$rootScope', '$scope', '$location', '$element',
        function ($rootScope, $scope, $location, $element) {
            var ctrl = this;
            ctrl.selectCallback = (pane) =>{
                console.log(pane);
            };
            ctrl.selectItem = (nav, type) => {
                if (type == 'parent') {
                    if (!$rootScope.findObjectByKey(ctrl.page.parentNavs, 'pageId', nav.id)) {
                        ctrl.page.parentNavs.push({
                            isActived: true,
                            pageId: ctrl.page.id,
                            parentId: nav.id,
                            description: nav.textDefault,
                            status: 'Published',
                            page: nav
                        });
                    }
                } else {
                    if (!$rootScope.findObjectByKey(ctrl.page.childNavs, 'pageId', nav.id)) {
                        ctrl.page.childNavs.push({
                            isActived: true,
                            pageId: nav.id,
                            parentId: ctrl.page.id,
                            description: nav.textDefault,
                            status: 'Published',
                            page: nav
                        });
                    }
                }

            }
        }
    ]
});