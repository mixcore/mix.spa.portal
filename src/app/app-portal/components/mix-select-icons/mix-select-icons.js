modules.component("mixSelectIcons", {
  templateUrl:
    "/mix-app/views/app-portal/components/mix-select-icons/mix-select-icons.html",
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    "$element",
    function ($rootScope, $scope, $location, $element) {
      var ctrl = this;
      ctrl.limitTo = 20;
      ctrl.container = $element[0].querySelector(".list-icon");
      ctrl.translate = function (keyword) {
        return $rootScope.translate(keyword);
      };
      ctrl.showMore = () => {
        if (
          ctrl.container.scrollTop >= ctrl.container.scrollHeight - 200 &&
          ctrl.limitTo < ctrl.options.length
        ) {
          ctrl.limitTo *= 2;
        }
      };
      ctrl.select = function (ico) {
        ctrl.data = ico.class;
      };
    },
  ],
  bindings: {
    data: "=",
    prefix: "=",
    options: "=",
  },
});
