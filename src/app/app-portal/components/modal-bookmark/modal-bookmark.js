modules.component("modalBookmark", {
  templateUrl:
    "/mix-app/views/app-portal/components/modal-bookmark/modal-bookmark.html",
  controller: [
    "$rootScope",
    "$scope",
    "localStorageService",
    "$routeParams",
    "$location",
    function (
      $rootScope,
      $scope,
      localStorageService,
      $routeParams,
      $location
    ) {
      var ctrl = this;
      ctrl.searchText = "";
      ctrl.defaultModel = {
        url: "",
        title: "",
      };
      ctrl.bookmarks = [];
      ctrl.model = null;
      ctrl.$onInit = function () {
        ctrl.model = angular.copy(ctrl.defaultModel);
        ctrl.getCurrentUrl();
        ctrl.bookmarks = localStorageService.get("bookmarks") || [];
      };
      ctrl.goToPath = function (url) {
        $rootScope.goToPath(url);
        $("#dlg-bookmark").modal("hide");
      };
      ctrl.getCurrentUrl = function (url) {
        url = url || $location.url();
        ctrl.model.url = url;
        ctrl.model.title = url;
      };
      ctrl.removeBookmark = function (url) {
        $rootScope.removeObjectByKey(ctrl.bookmarks, "url", url);
        localStorageService.set("bookmarks", ctrl.bookmarks);
      };
      ctrl.addBookmark = function () {
        var current = $rootScope.findObjectByKey(
          ctrl.bookmarks,
          "url",
          ctrl.model.url
        );
        if (current) {
          current.title = ctrl.model.title;
        } else {
          ctrl.bookmarks.push(ctrl.model);
        }
        localStorageService.set("bookmarks", ctrl.bookmarks);
        ctrl.model = angular.copy(ctrl.defaultModel);
      };
    },
  ],
});
