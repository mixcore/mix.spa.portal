modules.component("listMixColumn", {
  templateUrl: "/mix-app/views/app-portal/components/list-mix-column/view.html",
  controller: [
    "$rootScope",
    "$scope",
    "RestMixDatabaseColumnPortalService",
    function ($rootScope, $scope, service) {
      var ctrl = this;
      ctrl.selectedCol = null;
      ctrl.localizeSettings = $rootScope.globalSettings;
      ctrl.$onInit = async function () {
        var getDefaultAttr = await service.getDefault();
        if (getDefaultAttr.isSucceed) {
          ctrl.defaultAttr = getDefaultAttr.data;
          ctrl.defaultAttr.options = [];
        }
      };
      ctrl.addAttr = function () {
        if (ctrl.columns) {
          var t = angular.copy(ctrl.defaultAttr);
          t.priority = ctrl.columns.length + 1;
          ctrl.columns.push(t);
        }
      };
      ctrl.removeAttribute = async function (attr, index) {
        if (confirm("Remove this column ?")) {
          if (attr.id) {
            $rootScope.isBusy = true;
            var remove = await service.delete([attr.id]);
            if (remove.isSucceed) {
              ctrl.columns.splice(index, 1);
            }
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            ctrl.columns.splice(index, 1);
          }
        }
      };
      ctrl.addOption = function (col, index) {
        var val = $("#option_" + index).val();
        col.options = col.options || [];
        var opt = {
          value: val,
          dataType: 7,
        };
        col.options.push(opt);
        $("#option_" + index).val("");
      };
      ctrl.generateForm = function () {
        var formHtml = document.createElement("module-form");
        formHtml.setAttribute("class", "row");
        angular.forEach(ctrl.viewmodel.attributes, function (e, i) {
          var el;
          var label = document.createElement("label");
          label.setAttribute("class", "form-label");
          label.setAttribute("ng-bind", "{{data.title}}");

          switch (e.dataType) {
            case "datetime":
              el = document.createElement("input");
              el.setAttribute("type", "datetime-local");
              break;

            case "date":
              el = document.createElement("input");
              el.setAttribute("type", "date");
              break;

            case "time":
              el = document.createElement("input");
              el.setAttribute("type", "time");
              break;

            case "phonenumber":
              el = document.createElement("input");
              el.setAttribute("type", "tel");
              break;

            case "number":
              el = document.createElement("input");
              el.setAttribute("type", "number");
              break;

            case "html":
              el = document.createElement("trumbowyg");
              el.setAttribute("options", "{}");
              el.setAttribute("type", "number");
              break;

            case "textarea":
              el = document.createElement("textarea");
              break;

            default:
              el = document.createElement("input");
              el.setAttribute("type", "text");
              formHtml.appendChild(el);
              break;
          }
          el.setAttribute("ng-model", "data.jItem[" + e.name + "].value");
          el.setAttribute("placeholder", "{{$ctrl.title}}");
          formHtml.appendChild(label);
          formHtml.appendChild(el);
        });
        ctrl.viewmodel.formView.content = formHtml.innerHTML;
      };

      ctrl.generateName = function (col, isForce = false) {
        if (isForce || !col.name) {
          col.name = $rootScope.generateKeyword(col.title, "_", true, true);
        }
      };
      ctrl.removeAttr = function (index) {
        if (ctrl.columns) {
          ctrl.columns.splice(index, 1);
        }
      };
      ctrl.updateOrders = function (index) {
        if (index > ctrl.dragStartIndex) {
          ctrl.columns.splice(ctrl.dragStartIndex, 1);
        } else {
          ctrl.columns.splice(ctrl.dragStartIndex + 1, 1);
        }
        angular.forEach(ctrl.columns, function (e, i) {
          e.priority = i;
        });
      };
      ctrl.dragStart = function (index) {
        ctrl.dragStartIndex = index;
      };
      ctrl.showReferences = function (col) {
        ctrl.colRef = col;
        $("#modal-navs").modal("show");
      };
      ctrl.referenceCallback = function (selected) {
        if (selected && selected.length) {
          ctrl.colRef.reference = selected;
          ctrl.colRef.referenceId = selected[0].id;
        }
        $("#modal-navs").modal("hide");
      };
    },
  ],
  bindings: {
    header: "=",
    columns: "=",
    removeAttributes: "=",
  },
});
