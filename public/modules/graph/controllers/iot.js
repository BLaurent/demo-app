/**
 * Created by benoitlaurent on 20/09/16.
 */
import angular from 'angular';
import _ from 'lodash';

class controller {
  constructor($stateParams, $http, $interval, AppHubService) {
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$interval = $interval;
    this.apphubService = AppHubService;
    this.interval = 200;
    this.windowSize = 500;
    this.seriesData = [];
    this.translateAmt = [];
    this.range = {};
    let MAX_DATA_POINTS = 50;

    this.setUpdate = (interval) => {
      this.$interval(() => {
        this.seriesData.push({x: Date.now(), y: Math.random() * 100});

        if (this.seriesData.length > MAX_DATA_POINTS) {
          this.seriesData.splice(0, 1);
        }

        let maxTime = this.seriesData[this.seriesData.length - 1].x,
          deltaTime = this.seriesData[this.seriesData.length - 2].x;
        this.translateAmt = [-(maxTime - deltaTime), 0];
      }, interval);
    };

    this.setUpdate(this.interval);

    this.init();

  }

  init() {

    this.range = {
      from: new Date(Date.now()).toISOString(),
      to: new Date(Date.now() - this.windowSize).toISOString()
    };

    for (let ii = 0; ii < 10; ii++) {
      let now = new Date().getTime();
      while (new Date().getTime() < now + 20) { /* do nothing */
      }
      this.seriesData.push({x: Date.now(), y: Math.random() * 100});
    }

    this.options = JSON.stringify({
      xAxisConfig: {
        title: "Time",
        tickFormat: "%H:%M:%S"
      }
    });

    this.seriesConfig = {
      turbineVoltage: {
        x: "x",
        y: "y",
        yAxisUnit: "Volt",
        name: "Voltage",
      }
    };
  }
}

// Strict DI for minification (order is important)
controller.$inject = ['$stateParams', '$http', '$interval', 'AppHubService'];

export default controller;
