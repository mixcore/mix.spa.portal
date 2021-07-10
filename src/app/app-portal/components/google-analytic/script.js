﻿modules.component("googleAnalytic", {
  templateUrl: "/mix-app/views/app-portal/components/google-analytic/view.html",
  bindings: {
    Google_Client_Id: "=?",
    Google_Client_Ids: "=?",
    Google_Analytic_Ids: "=?",
  },
  controller: [
    "$rootScope",
    "ApiService",
    "CommonService",
    function ($rootScope, apiService, commonService) {
      var ctrl = this;
      ctrl.init = function () {
        if (gapi) {
          gapi.analytics.ready(function () {
            if (ctrl.Google_Client_Id) {
              /**
               * Authorize the user immediately if the user has already granted access.
               * If no access has been created, render an authorize button inside the
               * element with the ID "embed-api-auth-container".
               */
              gapi.analytics.auth.authorize({
                container: "embed-api-auth-container",
                //REPLACE WITH YOUR CLIENT ID
                clientid: ctrl.Google_Client_Id,
              });

              /**
               * Create a ViewSelector for the first view to be rendered inside of an
               * element with the id "view-selector-1-container".
               */
              var viewSelector1 = new gapi.analytics.ViewSelector({
                container: "view-selector-1-container",
              });

              /**
               * Create a ViewSelector for the second view to be rendered inside of an
               * element with the id "view-selector-2-container".
               */
              var viewSelector2 = new gapi.analytics.ViewSelector({
                container: "view-selector-2-container",
              });

              /**
               * Create a new ActiveUsers instance to be rendered inside of an
               * element with the id "active-users-container" and poll for changes every
               * five seconds.
               */
              var activeUsers = new gapi.analytics.ext.ActiveUsers({
                container: "active-users-container",
                pollingInterval: 5,
              });
              /**
               * Add CSS animation to visually show the when users come and go.
               */
              activeUsers.once("success", function () {
                var element = this.container.firstChild;
                var timeout;

                this.on("change", function (data) {
                  var element = this.container.firstChild;
                  var animationClass =
                    data.delta > 0 ? "is-increasing" : "is-decreasing";
                  element.className += " " + animationClass;

                  clearTimeout(timeout);
                  timeout = setTimeout(function () {
                    element.className = element.className.replace(
                      / is-(increasing|decreasing)/g,
                      ""
                    );
                  }, 3000);
                });
              });

              /**
               * Create a ViewSelector for the second view to be rendered inside of an
               * element with the id "view-selector-2-container".
               */
              var viewSelector2 = new gapi.analytics.ViewSelector({
                container: "view-selector-2-container",
              });

              // Render both view selectors to the page.
              // viewSelector1.execute();
              // viewSelector2.execute();

              /**
               * Create the first DataChart for top countries over the past 30 days.
               * It will be rendered inside an element with the id "chart-1-container".
               */
              var dataChart1 = new gapi.analytics.googleCharts.DataChart({
                query: {
                  // ids: ctrl.Google_Client_Ids,
                  metrics: "ga:sessions",
                  dimensions: "ga:date",
                  "start-date": "30daysAgo",
                  "end-date": "yesterday",
                },
                chart: {
                  container: "chart-1-container",
                  type: "LINE",
                  options: {
                    width: "95%",
                    legendTextStyle: { color: "#333" },
                    titleTextStyle: { color: "#333" },
                    backgroundColor: { fill: "transparent" },
                    hAxis: {
                      textStyle: { color: "#333" },
                    },
                    vAxis: {
                      textStyle: { color: "#333" },
                    },
                    series: {
                      0: {
                        color:
                          $rootScope.appSettings.portalThemeSettings
                            .primaryColor,
                      },
                      1: { color: "#e7711b" },
                      2: { color: "#f1ca3a" },
                      3: { color: "#6f9654" },
                      4: { color: "#1c91c0" },
                      5: { color: "#43459d" },
                    },
                  },
                },
              });

              /**
               * Create the second DataChart for top countries over the past 30 days.
               * It will be rendered inside an element with the id "chart-2-container".
               */
              var dataChart2 = new gapi.analytics.googleCharts.DataChart({
                query: {
                  // ids: ctrl.Google_Analytic_Ids,
                  metrics: "ga:sessions",
                  dimensions: "ga:country",
                  "start-date": "90daysAgo",
                  "end-date": "yesterday",
                  "max-results": 6,
                  sort: "-ga:sessions",
                },
                chart: {
                  container: "chart-2-container",
                  type: "GEO",
                  options: {
                    width: "95%",
                    pieHole: 4 / 9,
                  },
                },
              });

              dataChart1
                .set({
                  query: {
                    ids: ctrl.Google_Analytic_Ids,
                  },
                })
                .execute();
              dataChart2
                .set({
                  query: {
                    ids: ctrl.Google_Analytic_Ids,
                  },
                })
                .execute();
              activeUsers
                .set({
                  ids: ctrl.Google_Analytic_Ids,
                })
                .execute();

              // /**
              //  * Update the first dataChart when the first view selecter is changed.
              //  */
              // viewSelector1.on('change', function (ids) {
              //   dataChart1.set({ query: { ids: ids } }).execute();
              //   // Start tracking active users for this view.
              //   activeUsers.set({ ids: ids }).execute();
              // });

              // /**
              //  * Update the first dataChart when the first view selecter is changed.
              //  */
              // viewSelector2.on('change', function (ids) {
              //   dataChart2.set({ query: { ids: ids } }).execute();
              //   // Start tracking active users for this view.
              //   activeUsers.set({ ids: ids }).execute();
              // });

              // /**
              //  * Update the second dataChart when the second view selecter is changed.
              //  */
              // viewSelector2.on('change', function (ids) {
              //   dataChart2.set({ query: { ids: ids } }).execute();
              // });
            }
          });
        }
      };
    },
  ],
});
