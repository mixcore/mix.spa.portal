appShared.constant("AppSettings", {
  serviceBase: "",
  apiVersion: "v1",
});
appShared.constant("ngAppSettings", {
  serviceBase: "",
  encryptKey: "MbQeThWmZq4t7w!z$C&F)J@NcRfUjXn2",
  encryptIV: "3s6v9y$B&E)H@McQ",
  clientId: "ngAuthApp",
  facebookAppId: "",
  request: {
    pageSize: "20",
    pageIndex: 0,
    status: "Published",
    orderBy: "CreatedDateTime",
    direction: "Desc",
    fromDate: null,
    toDate: null,
    keyword: "",
    key: "",
    query: {},
  },
  restRequest: {
    pageSize: "20",
    pageIndex: 0,
    status: "Published",
    orderBy: "CreatedDateTime",
    direction: "Desc",
    fromDate: null,
    toDate: null,
    keyword: "",
    query: {},
  },
  privacies: ["VND", "USD"],
  pageSizes: ["", "5", "10", "15", "20"],
  directions: [
    {
      value: "Asc",
      title: "Asc",
    },
    {
      value: "Desc",
      title: "Desc",
    },
  ],
  orders: [
    {
      value: "CreatedDateTime",
      title: "Created Date",
    },
    {
      value: "Priority",
      title: "Priority",
    },

    {
      value: "Title",
      title: "Title",
    },
  ],
  contentStatuses: ["Deleted", "Preview", "Published", "Draft", "Schedule"],
  dataTypes: [
    {
      title: "Custom",
      value: "Custom",
    },
    {
      title: "DateTime",
      value: "DateTime",
    },
    {
      title: "Date",
      value: "Date",
    },
    {
      title: "Time",
      value: "Time",
    },
    {
      title: "Duration",
      value: "Duration",
    },
    {
      title: "Phone Number",
      value: "PhoneNumber",
    },
    {
      title: "Currency",
      value: "Currency",
    },
    {
      title: "Text",
      value: "Text",
    },
    {
      title: "Html",
      value: "Html",
    },
    {
      title: "Multiline Text",
      value: "MultilineText",
    },
    {
      title: "Email Address",
      value: "EmailAddress",
    },
    {
      title: "Password",
      value: "Password",
    },
    {
      title: "Url",
      value: "Url",
    },
    {
      title: "Image Url",
      value: "ImageUrl",
    },
    {
      title: "Credit Card",
      value: "CreditCard",
    },
    {
      title: "PostalCode",
      value: "PostalCode",
    },
    {
      title: "Upload",
      value: "Upload",
    },
    {
      title: "Color",
      value: "Color",
    },
    {
      title: "Boolean",
      value: "Boolean",
    },
    {
      title: "Icon",
      value: "Icon",
    },
    {
      title: "Video Youtube",
      value: "VideoYoutube",
    },
    {
      title: "Tui Editor",
      value: "TuiEditor",
    },
    {
      title: "Integer",
      value: "Integer",
    },
    {
      title: "QR Code",
      value: "QRCode",
    },
    {
      title: "Reference",
      value: "Reference",
    },
  ],
  icons: [],
});
appShared.run([
  "$http",
  "$rootScope",
  "ngAppSettings",
  "$location",
  "BaseRestService",
  "ApiService",
  "CommonService",
  "AuthService",
  "TranslatorService",
  function (
    $http,
    $rootScope,
    ngAppSettings,
    $location,
    baseRestService,
    apiService,
    commonService,
    authService,
    translatorService
  ) {
    $rootScope.currentContext = $rootScope;
    $rootScope.isBusy = false;
    $rootScope.translator = translatorService;
    $rootScope.errors = [];
    $rootScope.breadCrumbs = [];
    $rootScope.message = {
      title: "",
      content: "",
      errors: [],
      okFuncName: null,
      okArgs: [],
      cancelFuncName: null,
      cancelArgs: [],
      lblOK: "OK",
      lblCancel: "Cancel",
      context: $rootScope,
    };

    $rootScope.isBusy = false;
    $rootScope.translator = translatorService;
    $rootScope.message = {
      title: "test",
      content: "",
      errors: [],
      okFuncName: null,
      okArgs: [],
      cancelFuncName: null,
      cancelArgs: [],
      lblOK: "OK",
      lblCancel: "Cancel",
      context: $rootScope,
    };
    $rootScope.range = function (max) {
      var input = [];
      for (var i = 1; i <= max; i += 1) input.push(i);
      return input;
    };

    $rootScope.generateKeyword = function (
      src,
      character,
      isCamelCase = false,
      isLowerFirst = false
    ) {
      if (src) {
        src = $rootScope.parseUnsignString(src);

        if (isCamelCase) {
          src = src
            .replace(/\w\S*/g, function (txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
            .replace(/[^a-zA-Z0-9]+/g, "");

          if (isLowerFirst) {
            src = src.replace(/^./, (str) => str.toLowerCase()); // first to lowercase
          }
        } else {
          src = src
            .replace(/[^a-zA-Z0-9]+/g, character)
            .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
            .replace(/([a-z])([A-Z])/g, "$1-$2")
            // .replace(/([0-9])([^0-9])/g, "$1-$2")
            // .replace(/([^0-9])([0-9])/g, "$1-$2")
            .replace(/-+/g, character)
            .toLowerCase();
        }

        return src;
      }
    };

    $rootScope.generatePhone = function (src) {
      return src.replace(/^([0-9]{3})([0-9]{3})([0-9]{4})$/, "($1) $2-$3");
    };
    $rootScope.parseUnsignString = function (str) {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/Đ/g, "D");
      return str;
    };
    $rootScope.logOut = function () {
      authService.logOut();
    };

    $rootScope.updateSettings = function () {
      commonService.removeSettings();
      commonService
        .fillSettings($rootScope.globalSettings.lang)
        .then(function (response) {
          $rootScope.globalSettings = response;
        });
      $rootScope.isBusy = false;
    };
    $rootScope.executeFunctionByName = async function (
      functionName,
      args,
      context = window
    ) {
      if (functionName !== null) {
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
          context = context[namespaces[i]];
        }
        functionName = null;
        return context[func].apply(this, args);
      }
    };

    $rootScope.showConfirm = function (
      context,
      okFuncName,
      okArgs,
      cancelFuncName,
      title,
      msg,
      cancelArgs,
      lblOK,
      lblCancel
    ) {
      $rootScope.confirmMessage = {
        title: title,
        content: msg,
        context: context,
        okFuncName: okFuncName,
        okArgs: okArgs,
        cancelFuncName: cancelFuncName,
        cancelArgs: cancelArgs,
        lblOK: lblOK ? lblOK : "OK",
        lblCancel: lblCancel ? lblCancel : "Cancel",
      };

      $("#dlg-confirm-msg").modal("show");
    };

    $rootScope.preview = function (type, data, title, size, objClass) {
      $rootScope.previewObject = {
        title: title || "Preview",
        size: size || "modal-md",
        objClass: objClass,
        type: type,
        data: data,
      };
      $("#dlg-preview-popup").modal("show");
    };

    $rootScope.initEditors = function () {
      setTimeout(function () {
        $.each($(".code-editor"), function (i, e) {
          var container = $(this);
          var editor = ace.edit(e);
          if (container.hasClass("json")) {
            editor.session.setMode("ace/mode/json");
          } else {
            editor.session.setMode("ace/mode/razor");
          }
          editor.setTheme("ace/theme/chrome");
          //editor.setReadOnly(true);
          editor.$blockScrolling = Infinity;
          editor.session.setUseWrapMode(true);
          editor.setOptions({
            maxLines: Infinity,
          });
          editor.getSession().on("change", function (e) {
            // e.type, etc
            $(container).parent().find(".code-content").val(editor.getValue());
          });
        });
      }, 200);
    };

    $rootScope.showErrors = function (errors) {
      if (errors.length) {
        $.each(errors, function (i, e) {
          $rootScope.showMessage(e, "danger");
        });
      } else {
        $rootScope.showMessage("Server Errors", "danger");
      }
    };
    $rootScope.shortString = function (msg, max) {
      var data = decodeURIComponent(msg);
      if (data) {
        if (max < data.length) {
          return data.replace(/[+]/g, " ").substr(0, max) + " ...";
        } else {
          return data.replace(/[+]/g, " ");
        }
      }
    };
    $rootScope.showMessage = function (content, type) {
      // $rootScope.toast = new  bootstrap.Toast(document.getElementById('toast-msg'));
      // $rootScope.toastMsg= content;
      // $rootScope.toast.show();
      var from = "bottom";
      var align = "right";
      if ($ && $.notify) {
        $.notify(
          {
            icon: "fas fa-bell",
            message: $rootScope.translate(content),
          },
          {
            type: type,
            timer: 2000,
            placement: {
              from: from,
              align: align,
            },
          }
        );
      } else {
        console.log(content);
      }
    };
    $rootScope.encrypt = function (message) {
      var keySize = 256;
      var ivSize = 128;
      var iterations = 100;
      var salt = CryptoJS.lib.WordArray.random(128 / 8);
      var pass = "secret-key";
      var key = CryptoJS.PBKDF2(pass, salt, {
        keySize: keySize / 32,
        iterations: iterations,
      });

      var iv = CryptoJS.lib.WordArray.random(ivSize / 8);

      var options = {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: iv,
      };
      var encrypted = CryptoJS.AES.encrypt(message, key, options);
      return {
        key: key.toString(CryptoJS.enc.Base64),
        iv: iv.toString(CryptoJS.enc.Base64),
        data: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      };
    };
    $rootScope.decrypt = function (encryptedData) {
      var ivSize = 128;
      var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(encryptedData.data),
      });
      var key = CryptoJS.enc.Base64.parse(encryptedData.key);
      var iv = CryptoJS.lib.WordArray.random(ivSize / 8);
      var options = {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: iv,
      };

      var decrypted = CryptoJS.AES.decrypt(cipherParams, key, options);
      return decrypted.toString(CryptoJS.enc.Utf8);
    };

    $rootScope.ajaxSubmitForm = async function (form, url) {
      var req = {
        serviceBase: this.serviceBase,
        method: "POST",
        url: url,
        headers: {
          "Content-Type": undefined,
        },
        contentType: false, // Not to set any content header
        processData: false, // Not to process data
        data: form,
      };
      return await apiService.getApiResult(req);
    };

    $rootScope.translate = function (keyword, isWrap, defaultText) {
      if ($rootScope.globalSettings && $rootScope.translator) {
        return (
          $rootScope.translator.get(keyword, isWrap, defaultText) || keyword
        );
      } else {
        return keyword || defaultText;
      }
    };

    $rootScope.getConfiguration = function (keyword, isWrap, defaultText) {
      if (
        $rootScope.globalSettings &&
        ($rootScope.globalSettingsService || $rootScope.isBusy)
      ) {
        return $rootScope.globalSettingsService.get(
          keyword,
          isWrap,
          defaultText
        );
      } else {
        return keyword || defaultText;
      }
    };

    $rootScope.waitForInit = async function (functionName, args, scope) {
      if (!$rootScope.isInit) {
        () => {
          setTimeout(() => {
            $rootScope.waitForInit(functionName, args, scope);
          }, 200);
        };
      } else {
        $rootScope.executeFunctionByName(functionName, args, scope);
      }
    };

    $rootScope.$watch("isBusy", function (newValue, oldValue) {
      if (newValue) {
        $rootScope.message.content = "";
        $rootScope.errors = [];
      }
    });
    $rootScope.generateUUID = function () {
      // Public Domain/MIT
      var d = new Date().getTime();
      if (
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
      ) {
        d += performance.now(); //use high-precision timer if available
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
    };
    $rootScope.filterArray = function (array, keys, values) {
      var result = [];
      if (array) {
        for (var i = 0; i < array.length; i++) {
          var matched = true;
          for (var j = 0; j < keys.length; j++) {
            if (array[i][keys[j]] !== values[j]) {
              matched = false;
              break;
            }
          }
          if (matched) {
            result.push(array[i]);
          }
        }
      }
      return result;
    };
    $rootScope.findObjectByKey = function (array, key, value) {
      if (array) {
        if (Array.isArray(key)) {
          for (var i = 0; i < array.length; i++) {
            var isMatch = true;
            angular.forEach(key, function (e, j) {
              isMatch = array[i][key[j]] == value[j];
            });
            if (isMatch) {
              return array[i];
            }
          }
        } else {
          for (var i = 0; i < array.length; i++) {
            if (array[i][key] == value) {
              return array[i];
            }
          }
        }
      }
      return null;
    };
    $rootScope.removeObjectByKey = function (array, key, value) {
      if (Array.isArray(key)) {
        for (var i = 0; i < array.length; i++) {
          var isMatch = true;
          angular.forEach(key, function (e, j) {
            isMatch = array[i][key[j]] == value[j];
          });
          if (isMatch) {
            array.splice(i, 1);
            break;
          }
        }
      } else {
        for (var i = 0; i < array.length; i++) {
          if (array[i][key] == value) {
            array.splice(i, 1);
            break;
          }
        }
      }
      for (var i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
          array.splice(i, 1);
          break;
        }
      }
    };

    $rootScope.changeLang = async function (lang) {
      var url = await translatorService.translateUrl(lang);
      translatorService.translateUrl(lang);
      window.top.location = url;
    };
    // upload on file select or drop
    $rootScope.upload = function (file, url) {
      Upload.upload({
        url: "upload/url",
        data: {
          file: file,
          username: $scope.username,
        },
      }).then(
        function (resp) {
          console.log(
            "Success " +
              resp.config.data.file.name +
              "uploaded. Response: " +
              resp.data
          );
        },
        function (resp) {
          console.log("Error status: " + resp.status);
        },
        function (evt) {
          var progressPercentage = parseInt((100.0 * evt.loaded) / evt.total);
          console.log(
            "progress: " + progressPercentage + "% " + evt.config.data.file.name
          );
        }
      );
    };
    $rootScope.goToSiteUrl = function (url) {
      window.top.location = url;
    };
    $rootScope.goToPath = function (url) {
      $location.url(url.trim());
    };
    $rootScope.encryptMixDatabase = function (attributes, data) {
      angular.forEach(attributes, function (attr) {
        if (attr.isEncrypt) {
          angular.forEach(data, function (item) {
            var columnData = $rootScope.findObjectByKey(
              item.data,
              "attributeName",
              attr.name
            );
            if (columnData) {
              var encryptedData = $rootScope.encrypt(columnData.stringValue);
              columnData.encryptValue = encryptedData.data;
              columnData.encryptKey = encryptedData.key;
              columnData.stringValue = "";
            }
          });
        }
      });
    };
    $rootScope.decryptMixDatabase = function (attributes, data) {
      angular.forEach(attributes, function (attr) {
        if (attr.isEncrypt) {
          angular.forEach(data, function (item) {
            var columnData = $rootScope.findObjectByKey(
              item.data,
              "attributeName",
              attr.name
            );
            if (columnData) {
              var encryptedData = {
                key: columnData.encryptKey,
                data: columnData.encryptValue,
              };
              columnData.stringValue = $rootScope.decrypt(encryptedData);
            }
          });
        }
      });
    };
    $rootScope.testJSON = function (obj) {
      if (typeof obj === "object" && obj !== null) {
        return obj;
      }
      if (typeof obj !== "string") {
        return false;
      }
      try {
        return JSON.parse(obj);
      } catch (error) {
        return false;
      }
    };
    $rootScope.getRestService = function (modelName, isGlobal, lang) {
      var serviceFactory = angular.copy(baseRestService);
      serviceFactory.init(modelName, isGlobal, lang);
      return serviceFactory;
    };
    $rootScope.showLogin = function (req, type = null) {
      $rootScope.isBusy = false;
      $rootScope.loginCallbackRequest = req;
      $rootScope.loginCallbackType = type;

      // window.top.location.href = "/security/login";
      $("#login-popup").modal("show");
    };
    $rootScope.isInRoles = function (roleNames) {
      for (let index = 0; index < roleNames.length; index++) {
        const roleName = roleNames[index];
        if (authService.isInRole(roleName)) {
          return true;
        }
      }
      return false;
    };

    $rootScope.isInRole = function (roleName) {
      return authService.isInRole(roleName);
    };
    $rootScope.showContentFilter = function (callback) {
      $rootScope.contentFilterCallback = callback;
      $("#modal-content-filter").modal("show");
    };

    $rootScope.updateOrders = function (index, minIndex, items) {
      items.splice(index, 1);
      for (var i = 0; i < items.length; i++) {
        items[i].priority = minIndex + i;
      }
    };

    $rootScope.showHelper = function (url) {
      $rootScope.helperUrl = url;
      $("#dev-helper-modal").modal("show");
    };

    $rootScope.openModal = function (
      templateUrl,
      controllerName,
      resolve,
      size = "lg",
      successCallback = null,
      failCallback = null
    ) {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: "show",
        templateUrl: templateUrl,
        controller: controllerName,
        controllerAs: "$ctrl",
        size: size,
        resolve: resolve,
      });

      modalInstance.result.then(
        function (result) {
          successCallback(result);
        },
        function (error) {
          failCallback(error);
        }
      );
    };

    $rootScope.isImage = function (file) {
      let ext = file.name.substring(file.name.lastIndexOf("."));
      return ext
        .toLowerCase()
        .match(/([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|svg)/g);
    };
  },
]);
