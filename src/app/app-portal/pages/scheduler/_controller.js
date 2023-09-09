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
    $scope.templates = {
      "Mix.Scheduler.Jobs.KeepPoolAliveJob": {
        domain: "https://example.com",
      },
      "Mix.Scheduler.Jobs.PublishScheduledPostsJob": {},
      "Mix.Scheduler.Jobs.SendMessageQueueJob": {
        data: {
          topic: "",
          action: "",
          data: {},
        },
      },
      "Mix.Scheduler.Jobs.SendPortalMessageJob": {
        data: {
          topic: "",
          action: "",
          data: "",
        },
      },
    };
    $scope.schedule = {
      jobData: {
        data: {
          type: "Info",
          from: {
            connectionId: "",
            userName: "",
            avatar: "",
          },
          title: "value",
          message: "content",
          data: {},
        },
      },
      cronExpression: null,
      name: null,
      groupName: null,
      jobName: null,
      description: null,
      startAt: null,
      isStartNow: true,
      interval: null,
      intervalType: "Second",
      repeatCount: null,
    };
    $scope.updateMessageTemplate = () => {
      $scope.schedule.jobData = null;
      setTimeout(() => {
        $scope.schedule.jobData = $scope.templates[$scope.schedule.jobName];
        $scope.$apply();
      }, 200);
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
          $scope.trigger = resp.data.trigger;
          //   $scope.schedule.trigger = $scope.trigger;
          $scope.schedule.name = $scope.trigger.name;
          $scope.schedule.jobName = $scope.trigger.jobName;
          $scope.schedule.groupName = $scope.trigger.group;
          //   $scope.schedule.interval = $scope.trigger.repeatInterval;
          $scope.schedule.repeatCount = $scope.trigger.repeatCount;
          if ($scope.trigger.jobDataMap) {
            if ($scope.trigger.jobDataMap.data) {
              $scope.schedule.jobData = {
                data: JSON.parse($scope.trigger.jobDataMap.data),
              };
            } else {
              $scope.schedule.jobData = $scope.trigger.jobDataMap;
            }
          }
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
        $location.url("/admin/scheduler");
        $scope.$apply();
      } else {
        if (resp) {
          $rootScope.showErrors(resp.errors || ["Failed"]);
        }
        $rootScope.isBusy = false;
        $scope.$apply();
      }
    };
    $scope.execute = async function (name) {
      try {
        $rootScope.isBusy = true;
        await service.execute(name);
        $rootScope.isBusy = false;
        $scope.$apply();
      } catch {}
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
    $scope.deleteJob = async function (name) {
      $rootScope.isBusy = true;
      var resp = await service.deleteJob(name);
      if (resp && resp.success) {
        $scope.getJobs();
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
