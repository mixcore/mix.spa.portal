modules.component("mixDatabaseDataValuePreview", {
  templateUrl: "/mix-app/views/app-shared/components/mix-database-data-value-preview/view.html",
  controller: [
    "$rootScope",
    function ($rootScope) {
      var ctrl = this;
      ctrl.$onInit = function () {
        if (ctrl.data.field && ctrl.data.field.isEncrypt) {
          var encryptedData = {
            key: ctrl.data.encryptKey,
            data: ctrl.data.encryptValue,
          };
          ctrl.data.stringValue = $rootScope.decrypt(encryptedData);
        }
      };
    },
  ],
  bindings: {
    data: "=",
    width: "=",
  },
});
