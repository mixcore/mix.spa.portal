"use strict";
app.controller("SchedulerController", [
  "$scope",
  "$rootScope",
  "$routeParams",
  "$location",
  "SchedulerService",
  function ($scope, $rootScope, $routeParams, $location, service) {
    $scope.jobs = [];
    $scope.intervalTypes = [
      "Second",
      "Minute",
      "Hour",
      "Day",
      "Week",
      "Month",
      "Year",
    ];
    $scope.schedule = {
      jobData: {},
      cronExpression: null,
      name: null,
      groupName: null,
      jobName: null,
      description: null,
      startAt: null,
      isStartNow: false,
      interval: null,
      intervalType: "Second",
      repeatCount: null,
    };
    $scope.init = function () {
      $scope.getTriggers();
      $scope.getJobs();
    };

    $scope.getSingle = async function () {
      $scope.getJobs();
      $scope.getTrigger();
    };

    $scope.getTrigger = async function () {
      if ($routeParams.name) {
        $rootScope.isBusy = true;
        $scope.isReschedule = true;
        var resp = await service.getTrigger($routeParams.name);
        if (resp && resp.success) {
          $scope.trigger = resp.data;
          //   $scope.schedule.trigger = $scope.trigger;
          $scope.schedule.name = $scope.trigger.name;
          $scope.schedule.jobName = $scope.trigger.jobName;
          $scope.schedule.groupName = $scope.trigger.group;
          $scope.schedule.interval = $scope.trigger.repeatInterval;
          $scope.schedule.repeatCount = $scope.trigger.repeatCount;
          $rootScope.isBusy = false;
          $scope.$apply();
        } else {
          if (resp) {
            $rootScope.showErrors(resp.errors || ["Failed"]);
          }
          $rootScope.isBusy = false;
          $scope.$apply();
        }
      }
    };

    $scope.createSchedule = async function () {
      $rootScope.isBusy = true;
      var resp = $scope.isReschedule
        ? await service.reschedule($scope.schedule)
        : await service.createSchedule($scope.schedule);
      if (resp && resp.success) {
        $rootScope.isBusy = true;
        $location.url("/portal/scheduler");
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors || ["Failed"]);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.updateJobData = function (content) {
      try {
        $scope.schedule.jobData = JSON.parse(content);
        $scope.$apply();
      } catch {}
    };
    $scope.pauseTrigger = async function (name) {
      $rootScope.isBusy = true;
      var resp = await service.pauseTrigger(name);
      if (resp && resp.success) {
        $scope.schedule = resp.data;
        await $scope.getTriggers();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors || ["Failed"]);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.resumeTrigger = async function (name) {
      $rootScope.isBusy = true;
      var resp = await service.resumeTrigger(name);
      if (resp && resp.success) {
        $scope.schedule = resp.data;
        await $scope.getTriggers();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors || ["Failed"]);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };

    $scope.getTriggers = async function () {
      $rootScope.isBusy = true;
      var resp = await service.getTriggers();
      if (resp && resp.success) {
        $scope.data = resp.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors || ["Failed"]);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.getJobs = async function () {
      $rootScope.isBusy = true;
      var resp = await service.getJobs();
      if (resp && resp.success) {
        $scope.jobs = resp.data;
        $rootScope.isBusy = false;
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors || ["Failed"]);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
  },
]);
