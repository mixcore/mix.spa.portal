// sharedComponents.component('modalConfirm', {
//     templateUrl: '/mix-app/views/app-shared/components/modal-confirm/modal-confirm.html',
//     controller: ModalConfirmController,
//     bindings: {
//         message: '='
//     }
// });
function ModalConfirmController($rootScope, $scope, $mdDialog, message) {
  $scope.message = message;
  $scope.executeFunctionByName = async function (functionName, args, context) {
    var result = await $rootScope.executeFunctionByName(
      functionName,
      args,
      context
    );
    if (result) {
      $scope.$apply();
    }
    $mdDialog.hide();
  };
  $scope.closeDialog = function () {
    $mdDialog.hide();
  };
}
