modules.component("jsonBuilder", {
  templateUrl: "/mix-app/views/app-portal/components/json-builder/view.html",
  bindings: {
    data: "=?", // json obj (ex: { column1: 'some val' })
    strData: "=?", // json obj (ex: { column1: 'some val' })
    folder: "=?", // filepath (ex: 'data/jsonfile.json')
    filename: "=?", // filepath (ex: 'data/jsonfile.json')
    allowedTypes: "=?", // string array ( ex: [ 'type1', 'type2' ] )
    backUrl: "=?", // string array ( ex: [ 'type1', 'type2' ] )
    showPreview: "=?",
    type: "=?", // array / obj
    save: "&",
    onUpdate: "&",
  },
  controller: [
    "$rootScope",
    "$scope",
    "$location",
    "FileServices",
    "ngAppSettings",
    function ($rootScope, $scope, $location, fileService, ngAppSettings) {
      var ctrl = this;
      ctrl.editMode = "text";
      ctrl.file = null;
      ctrl.translate = $rootScope.translate;
      ctrl.mixConfigurations = $rootScope.globalSettings;
      ctrl.timestamp = Math.random();
      ctrl.templates = [
        {
          type: "item",
          name: "",
          dataType: "Text",
          value: "",
          columns: [{ allowedTypes: ["item"], items: [] }],
        },
        {
          type: "string",
          dataType: "Text",
          value: "",
          columns: [{ allowedTypes: ["item"], items: [] }],
        },
        {
          type: "object",
          name: "o1",
          columns: [{ allowedTypes: ["array", "object", "item"], items: [] }],
        },
        {
          type: "array",
          name: "a1",
          columns: [{ allowedTypes: ["object"], items: [] }],
        },
      ];
      ctrl.draft = [];
      ctrl.model = {};
      ctrl.dropzones = {
        root: [],
      };
      ctrl.selected = null;
      ctrl.selectedModel = {};
      ctrl.strModel = null;
      ctrl.init = async function () {
        var arr = [];
        if (!ctrl.data && ctrl.filename) {
          await ctrl.loadFile();
          ctrl.parseObjToList(ctrl.data, arr);
          ctrl.dropzones.root = arr;
        } else {
          if (!ctrl.data) {
            if (ctrl.strData) {
              ctrl.data = JSON.parse(ctrl.strData);
            }
            if (!ctrl.data && ctrl.type) {
              ctrl.data = ctrl.type == "array" ? [] : {};
            }
          }
          ctrl.rootType = Array.isArray(ctrl.data) ? "array" : "object";
          ctrl.parseObjToList(ctrl.data, arr);
          ctrl.strData = JSON.stringify(ctrl.data);
          ctrl.dropzones.root = arr;
          ctrl.preview = angular.copy(ctrl.data);
        }
      };
      ctrl.loadFile = async function () {
        $rootScope.isBusy = true;
        $scope.listUrl = "/admin/json-data/list?folder=" + ctrl.folder;

        var response = await fileService.getFile(ctrl.folder, ctrl.filename);
        if (response.success) {
          ctrl.file = response.data;
          ctrl.data = JSON.parse(response.data.content);
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          $rootScope.showErrors(response.errors);
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      };
      ctrl.saveFile = async function () {
        $rootScope.isBusy = true;
        ctrl.model = {};
        ctrl.update();
        if (ctrl.save) {
          ctrl.save({ data: ctrl.model });
        } else {
          // ctrl.parseObj(ctrl.dropzones.root, ctrl.model);
          ctrl.file.content = JSON.stringify(ctrl.model);
          var resp = await fileService.saveFile(ctrl.file);
          if (resp && resp.success) {
            $scope.activedFile = resp.data;
            $rootScope.showMessage("Update successfully!", "success");
            $rootScope.isBusy = false;
            $scope.$apply();
          } else {
            if (resp) {
              $rootScope.showErrors(resp.errors);
            }
            $rootScope.isBusy = false;
            $scope.$apply();
          }
        }
        ctrl.select(ctrl.selected);
      };
      ctrl.update = function () {
        ctrl.model = {};
        var obj = {
          type: "object",
          name: "data",
          columns: [
            {
              items: ctrl.dropzones.root,
            },
          ],
        };
        ctrl.parseObj(obj, ctrl.model);
        ctrl.strData = JSON.stringify(ctrl.model);
        ctrl.onUpdate({ data: ctrl.model });
      };
      ctrl.updateJsonContent = function (strData) {
        if (strData) {
          ctrl.model = JSON.parse(strData);
          ctrl.strData = strData;
          ctrl.onUpdate({ data: ctrl.model });
        }
      };
      ctrl.parseObjToList = function (item, items) {
        // key: the name of the object key
        // index: the ordinal position of the key within the object
        if (Array.isArray(item)) {
          angular.forEach(item, (e) => {
            var obj = angular.copy(ctrl.templates[1]);
            obj.value = e;
            // ctrl.parseObjToList(e, obj.columns[0].items);
            items.push(obj);
          });
        } else {
          Object.keys(item).forEach(function (key) {
            var obj = {};
            if (item[key]) {
              var objType = typeof item[key];
              switch (objType) {
                case "object":
                  if (Array.isArray(item[key])) {
                    obj = angular.copy(ctrl.templates[2]);
                    obj.name = key;
                    ctrl.parseObjToList(item[key], obj.columns[0].items);
                    items.push(obj);
                  } else {
                    obj = angular.copy(ctrl.templates[1]);
                    obj.name = key;
                    ctrl.parseObjToList(item[key], obj.columns[0].items);
                    items.push(obj);
                  }
                  break;
                default:
                  obj = angular.copy(ctrl.templates[0]);
                  obj.name = key;
                  obj.value = item[key];
                  items.push(obj);
                  break;
              }
            }
          });
        }
      };
      ctrl.parseObj = function (item, obj, name) {
        switch (item.type) {
          case "array":
            obj[item.name] = [];
            angular.forEach(item.columns[0].items, (sub) => {
              var o = {};
              ctrl.parseObj(sub, o);
              obj[item.name].push(o);
            });
            break;
          case "object":
            angular.forEach(item.columns[0].items, (sub) => {
              if (sub.type == "object") {
                var o = {};
                ctrl.parseObj(sub, o);
                obj[item.name] = o;
              } else {
                ctrl.parseObj(sub, obj, item.name);
              }
            });
            break;
          case "item":
            obj[item.name] = item.value;
            break;
        }
      };
      ctrl.parseJsonObject = function () {
        if (ctrl.rootType == "object") {
          ctrl.data = {};
          angular.forEach(ctrl.dropzones.root, (sub) => {
            if (sub.type == "object") {
              var o = {};
              ctrl.parseObj(sub, o);
              ctrl.data[sub.name] = o;
            } else {
              ctrl.data[sub.name] = sub.value;
            }
          });
        } else {
          ctrl.data = [];
          if (ctrl.rootType == "array") {
            angular.forEach(ctrl.dropzones.root, (sub) => {
              ctrl.data.push(sub.value);
            });
          }
        }
        ctrl.strData = JSON.stringify(ctrl.data);
        ctrl.onUpdate({ data: JSON.stringify(ctrl.data) });
      };
      ctrl.select = function (item) {
        if (ctrl.selected == item) {
          ctrl.parseObj(item, ctrl.selectedModel);
        } else {
          ctrl.selected = item;
          ctrl.selectedModel = {};
          ctrl.parseObj(item, ctrl.selectedModel);
        }
        ctrl.timestamp = Math.random();
      };
      ctrl.addField = function () {
        var column = angular.copy(ctrl.templates[0]);
        ctrl.dropzones.root.push(column);
        ctrl.parseJsonObject();
      };
      ctrl.addString = function () {
        var column = angular.copy(ctrl.templates[1]);
        ctrl.dropzones.root.push(column);
        ctrl.parseJsonObject();
      };
      ctrl.addObj = function (item) {
        var obj = angular.copy(ctrl.templates[1]);
        obj.name = "o" + (item.columns[0].items.length + 1);
        item.columns[0].items.push(obj);
        item.showMenu = false;
        ctrl.parseJsonObject();
      };
      ctrl.addArray = function (item) {
        var obj = angular.copy(ctrl.templates[2]);
        obj.name = "a" + (item.columns[0].items.length + 1);
        item.columns[0].items.push(obj);
        item.showMenu = false;
        ctrl.parseJsonObject();
      };
      ctrl.clone = function (item, list) {
        var obj = angular.copy(item);
        obj.name = item.name + "_copy";
        item.showMenu = false;
        obj.showMenu = false;
        list.items.push(obj);
        ctrl.parseJsonObject();
      };

      ctrl.remove = function (index, list) {
        if (confirm("Remove this")) {
          list.splice(index, 1);
          ctrl.parseJsonObject();
        }
      };
    },
  ],
});
