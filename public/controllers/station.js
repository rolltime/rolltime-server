//
// Service status.
//
app.controller('WatchStationController', ['$http', '$window', function ($http, $window) {
  self.watch = function (station_id) {
    //
    // Watches a station.
    //
  }

  self.unwatch = function (station_id) {
    //
    // Unwatches a station.
    //
  }

}])

app.controller('FetchHistoricData', ['$http', function ($http) {
  //
  // Fetches the historic time
  // series from the historic API.
  //
  self.fetch = function (station_id) {}
}])
