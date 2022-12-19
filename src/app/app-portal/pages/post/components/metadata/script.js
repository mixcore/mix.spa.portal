app.component("mixMetadata", {
  templateUrl:
    "/mix-app/views/app-portal/pages/post/components/metadata/view.html",
  bindings: {
    title: "=",
    parentId: "=",
    parentType: "=",
    description: "=?",
    image: "=?",
    type: "=",
    metadataType: "=",
    onDelete: "&",
    onUpdate: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    "ngAppSettings",
    "RestMixDatabasePortalService",
    "MetadataService",
    function (
      $rootScope,
      $scope,
      ngAppSettings,
      databaseService,
      metadataService
    ) {
      var ctrl = this;
      ctrl.data = { items: [] };
      ctrl.selectedValues = [];
      ctrl.$onInit = async () => {
        ctrl.request = angular.copy(ngAppSettings.request);
        ctrl.request.searchColumns = "Content,SeoContent";
        ctrl.requestAssociation = angular.copy(ngAppSettings.request);
        ctrl.requestAssociation.contentType = ctrl.parentType;
        ctrl.requestAssociation.contentId = ctrl.parentId;
        ctrl.requestAssociation.metadataType = ctrl.metadataType;
        await ctrl.loadSuggestions();
        await ctrl.loadMetadata();
        $scope.$apply();
      };
      ctrl.loadMetadata = async function () {
        let resp = await metadataService.getMetadataByContent(
          ctrl.parentType,
          ctrl.parentId,
          ctrl.requestAssociation
        );
        if (resp && resp.success) {
          ctrl.data = resp.data;
        }
      };

      ctrl.loadDatabase = async function () {
        var getMixDatabase = await databaseService.getByName(["Metadata"]);
        ctrl.columns = getMixDatabase.data.columns;
      };

      ctrl.loadSuggestions = async () => {
        ctrl.request.keyword = ctrl.keyword;
        ctrl.request.metadataType = ctrl.metadataType;
        let getSuggestions = await metadataService.getList(ctrl.request);
        if (getSuggestions.success) {
          ctrl.suggestions = getSuggestions.data;
        }
        $scope.$apply();
      };
      ctrl.addLink = async (metadata) => {
        var tmp = ctrl.data.items.find(
          (m) => m.metadata.content == metadata.content
        );
        if (!tmp) {
          if (metadata) {
            let dto = {
              metadataId: metadata.id,
              contentId: ctrl.parentId,
              contentType: ctrl.parentType,
              description: ctrl.description,
              image: ctrl.image,
            };
            var resp = await metadataService.createMetadataContentAssociation(
              dto
            );
            if (resp.success) {
              $rootScope.showMessage("Success", "success");
              await ctrl.loadMetadata();
              ctrl.reset();
              $rootScope.isBusy = false;
              $scope.$apply();
            } else {
              $rootScope.showErrors(resp.errors);
              $rootScope.isBusy = false;
              $scope.$apply();
            }
          }
        } else {
          $rootScope.showMessage(`${metadata.content} is existed`, "warning");
        }
      };
      ctrl.isActive = (metadata) => {
        return (
          ctrl.data.items.find((m) => m.metadata.content == metadata.content) !=
          undefined
        );
      };
      ctrl.addMetadata = async () => {
        if (ctrl.keyword) {
          var tmp = ctrl.data.items.find(
            (m) => m.metadata.content == ctrl.keyword
          );
          if (!tmp) {
            let metadata = await ctrl.getOrCreateMetadata();
            if (metadata) {
              let dto = {
                metadataId: metadata.id,
                contentId: ctrl.parentId,
                contentType: ctrl.parentType,
                description: ctrl.description,
                image: ctrl.image,
              };
              var resp = await metadataService.createMetadataContentAssociation(
                dto
              );
              if (resp.success) {
                $rootScope.showMessage("Success", "success");
                await ctrl.loadMetadata();
                ctrl.reset();
                $rootScope.isBusy = false;
                $scope.$apply();
              } else {
                $rootScope.showErrors(resp.errors);
                $rootScope.isBusy = false;
                $scope.$apply();
              }
            }
          } else {
            tmp.isActived = true;
            ctrl.select(tmp);
          }
        }
      };

      ctrl.reset = () => {
        ctrl.keyword = "";
        ctrl.suggestions = [];
      };

      ctrl.getOrCreateMetadata = async () => {
        $rootScope.isBusy = true;
        let dto = {
          content: ctrl.keyword,
          type: ctrl.metadataType,
        };
        var resp = await metadataService.getOrCreateMetadata(dto);
        if (resp.success) {
          $rootScope.isBusy = false;
          return resp.data;
        } else {
          $rootScope.showErrors(resp.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };

      ctrl.remove = function (id) {
        if (
          confirm(
            "Deleted data will not able to recover, are you sure you want to delete this item?"
          )
        ) {
          ctrl.removeConfirmed(id);
        }
      };

      ctrl.removeConfirmed = async function (id) {
        $rootScope.isBusy = true;
        var result = await metadataService.deleteMetadataContentAssociation(id);
        if (result.success) {
          await ctrl.loadMetadata();
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(result.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
    },
  ],
});
