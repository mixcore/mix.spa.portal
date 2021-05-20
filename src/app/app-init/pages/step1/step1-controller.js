"use strict";
app.controller("Step1Controller", [
  "$scope",
  "$rootScope",
  "ngAppSettings",
  "$timeout",
  "$location",
  "$http",
  "ApiService",
  "CommonService",
  "Step1Services",
  function (
    $scope,
    $rootScope,
    ngAppSettings,
    $timeout,
    $location,
    $http,
    apiService,
    commonService,
    step1Services
  ) {
    var rand = Math.floor(Math.random() * 10000) + 1;
    $scope.settings = {
      providers: [
        {
          text: "MySQL Database",
          value: "MySQL",
          port: "3306",
          img: "/mix-app/assets/img/mysql.jpg",
        },
        {
          text: "Microsoft SQL Server Database",
          value: "MSSQL",
          port: null,
          img: "/mix-app/assets/img/mssql.jpg",
        },
        {
          text: "PostgreSQL Database",
          value: "PostgreSQL",
          port: "5432",
          img: "/mix-app/assets/img/postgresql.jpg",
        },
        {
          text: "SQLite Database",
          value: "SQLITE",
          port: null,
          img: "/mix-app/assets/img/sqlite.jpg",
        },
      ],
      cultures: [],
    };
    $scope.loadSettings = async function () {
      step1Services.saveDefaultSettings();
      var getCultures = await commonService.loadJArrayData("cultures.json");
      if (getCultures.isSucceed) {
        $scope.settings.cultures = getCultures.data;
        $scope.initCmsModel.culture = $scope.settings.cultures[0];
        $scope.dbProvider = $scope.settings.providers[0];
        $scope.initCmsModel.databaseProvider = $scope.dbProvider.value;
        $scope.initCmsModel.databasePort = $scope.dbProvider.port;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (getCultures) {
          $rootScope.showErrors(getCultures.errors);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.changeTypeDB = async function (type) {
      $scope.initCmsModel.isUseLocal = type;
    };

    $scope.canConnect = function () {
      return (
        ($scope.initCmsModel.databaseServer &&
          $scope.initCmsModel.databaseName &&
          $scope.initCmsModel.databaseUser &&
          $scope.initCmsModel.culture) ||
        ($scope.initCmsModel.databaseProvider == "SQLITE" &&
          $scope.initCmsModel.sqliteDbConnectionString)
      );
    };
    $scope.initCmsModel = {
      isUseLocal: false,
      localDbConnectionString:
        "Server=(localdb)\\MSSQLLocalDB;Initial Catalog=" +
        rand +
        "-mix-cms.db;Integrated Security=True;Persist Security Info=False;Pooling=False;MultipleActiveResultSets=False;Encrypt=False;TrustServerCertificate=True",
      sqliteDbConnectionString: "Data Source=MixContent\\mix-cms.db",
      localDbName: rand + "-mix-cms",
      databaseServer: "",
      databasePort: "",
      databaseName: "",
      databaseUser: "",
      databasePassword: "",
      adminPassword: "",
      lang: "en-us",
      isMysql: false,
      databaseProvider: "",
      culture: $scope.settings.cultures[0],
    };

    $scope.updateLocalDbName = function () {
      $scope.initCmsModel.localDbName = $scope.initCmsModel.localDbName + ".db";
      $scope.initCmsModel.localDbConnectionString =
        "Server=(localdb)\\mssqllocaldb;Database=" +
        $scope.initCmsModel.localDbName +
        ";Trusted_Connection=True;MultipleActiveResultSets=true";
      $scope.initCmsModel.sqliteDbConnectionString =
        "Data Source=" + $scope.initCmsModel.localDbName;
    };
    $scope.updateDbProvider = function () {
      $scope.initCmsModel.databaseProvider = $scope.dbProvider.value;
      $scope.initCmsModel.databasePort = $scope.dbProvider.port;
    };
    $scope.initCms = async function () {
      if (!$scope.canConnect()) {
        $rootScope.showErrors(["Please check your connection info"]);
        return;
      }
      $rootScope.isBusy = true;
      if ($scope.initCmsModel.siteName && $scope.initCmsModel.siteName != "") {
        var result = await step1Services.initCms($scope.initCmsModel);
        if (result.isSucceed) {
          $rootScope.isBusy = false;
          $rootScope.goToPath("/init/step2");
          $scope.$apply();
        } else {
          if (result) {
            $rootScope.showErrors(result.errors);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      } else {
        $rootScope.showErrors(["Site name is required"]);
        $rootScope.isBusy = false;
      }
    };
  },
]);
