modules.component("mediumNews", {
  templateUrl: "/mix-app/views/app-portal/components/medium-news/view.html",
  controller: [
    "$rootScope",
    "$http",
    function ($rootScope, $http) {
      var ctrl = this;
      ctrl.items = [];
      ctrl.init = function () {
        var req = {
          method: "GET",
          url:
            "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/mixcore&api_key=qww481wpgat3g4iqvqss7spzrilkbekpxpjgrbof&t=" +
            Math.floor(Date.now() / 1000),
        };
        ctrl.getMediumApiResult(req);
      };

      ctrl.getMediumApiResult = async function (req) {
        return $http(req).then(
          function (resp) {
            if (resp.status == "200") {
              ctrl.items = resp.data.items;
            }
          },
          function (error) {
            return {
              isSucceed: false,
              errors: [error.statusText || error.status],
            };
          }
        );
      };
    },
  ],
  bindings: {},
});
