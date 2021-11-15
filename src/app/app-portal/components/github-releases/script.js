﻿modules.component("githubReleases", {
  templateUrl: "/mix-app/views/app-portal/components/github-releases/view.html",
  controller: [
    "$rootScope",
    "$http",
    function ($rootScope, $http) {
      var ctrl = this;
      ctrl.items = [];
      ctrl.init = function () {
        var req = {
          method: "GET",
          url: "https://api.github.com/repos/mixcore/mix.core/releases",
        };
        ctrl.getGithubApiResult(req);
      };

      ctrl.getGithubApiResult = async function (req) {
        return $http(req).then(
          function (resp) {
            if (resp.status == "200") {
              ctrl.items = resp.data;
            } else {
            }
          },
          function (error) {
            return {
              success: false,
              errors: [error.statusText || error.status],
            };
          }
        );
      };
    },
  ],
  bindings: {},
});
