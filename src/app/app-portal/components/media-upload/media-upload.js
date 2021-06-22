modules.component("mediaUpload", {
  templateUrl:
    "/mix-app/views/app-portal/components/media-upload/media-upload.html",
  controller: [
    "$scope",
    "$rootScope",
    "MediaService",
    "ApiService",
    "CommonService",
    function ($scope, $rootScope, service, apiService, commonService) {
      var ctrl = this;
      ctrl.viewmodel = {
        title: "",
        description: "",
        status: "Published",
        fileFolder: "Medias",
        mediaFile: {
          file: null,
          fullPath: "",
          folderName: "Media",
          fileFolder: "",
          fileName: "",
          extension: "",
          content: "",
          fileStream: "",
        },
      };
      ctrl.save = async function (data) {
        $rootScope.isBusy = true;
        var resp = await service.save(data);
        if (resp && resp.isSucceed) {
          $scope.viewmodel = resp.data;
          $rootScope.showMessage("success", "success");
          $rootScope.isBusy = false;
          if (ctrl.onUpdate) {
            ctrl.onUpdate();
          }
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
    },
  ],
  bindings: {
    onUpdate: "&",
  },
});
