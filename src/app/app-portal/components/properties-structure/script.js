modules.component("propertiesStructure", {
  templateUrl:
    "/mix-app/views/app-portal/components/properties-structure/view.html",
  controller: [
    "$rootScope",
    "$scope",
    function ($rootScope, $scope) {
      var ctrl = this;
      ctrl.selectedCol = null;
      ctrl.localizeSettings = $rootScope.globalSettings;
      ctrl.defaultAttr = {
        title: "",
        name: "",
        defaultValue: null,
        options: [],
        priority: 0,
        dataType: "Text",
        isGroupBy: false,
        isSelect: false,
        isDisplay: true,
        width: 3,
        columnConfigurations: {
          upload: {
            isCrop: false,
            width: null,
            height: null,
          },
        },
      };

      ctrl.addAttr = function () {
        if (ctrl.columns) {
          var t = angular.copy(ctrl.defaultAttr);
          ctrl.columns.push(t);
        }
      };

      ctrl.addOption = function (col, index) {
        var val = $("#option_" + index).val();
        col.options.push(val);
        $("#option_" + index).val("");
      };
      ctrl.generateForm = function () {
        var formHtml = document.createElement("module-form");
        formHtml.setAttribute("class", "row");
        angular.forEach(ctrl.viewmodel.columns, function (e, i) {
          var el;
          var label = document.createElement("label");
          label.setAttribute("class", "control-label");
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

            case "integer":
              el = document.createElement("input");
              el.setAttribute("type", "number");
              break;

            case "html":
              el = document.createElement("quill");
              el.setAttribute("options", "{}");
              el.setAttribute("type", "number");
              break;

            case "multilinetext":
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

      ctrl.generateName = function (col) {
        col.name = $rootScope.generateKeyword(col.title, "_");
      };
      ctrl.removeAttr = function (index) {
        if (ctrl.columns) {
          ctrl.columns.splice(index, 1);
        }
      };
      ctrl.dragStart = function (index) {
        ctrl.dragStartIndex = index;
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
    },
  ],
  bindings: {
    header: "=",
    columns: "=",
  },
});
