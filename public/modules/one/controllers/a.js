import angular from 'angular';
import _ from 'lodash';

class controller {

  constructor($stateParams, $http, $interval, AppHubService) {
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$interval = $interval;
    this.apphubService = AppHubService;


    //this.url = window.nav.paths['analytics'] +"/#";
    this.analyticsUrl = this.apphubService.getPath(APPID_ANALYTICS) +"/#";
    this.analyticsUnavailable = !this.apphubService.appAvailable(APPID_ANALYTICS);
    this.bogusUrl = this.apphubService.getPath(APPID_BOGUS) +"/#";
    this.bogusUnavailable = !this.apphubService.appAvailable(APPID_BOGUS);
    this.chromelessAnalyticsUrl = this.apphubService.getPath(APPID_ANALYTICS) +"/?chromeless=true";

    this.thresholds={'ll':20,'l':35,'h':70,'hh':85};
    this.dynamicThresholds={'h':60,'hh':80};

    // DYNAMICALLY UPDATING CHARTS
    let numCols = 30;
    let numCharts = 1;
    this.interval = 1000;

    // This function generates a value between 0-100 which is a random distance
    // above or below the last value for oldValue. It then updates oldValue with
    // this new value.
    let getNewValue = function(oldValue) {
      let diff;
      if(oldValue < 5){ diff = _.sample([2,4,6,8,10]); }
      else if(oldValue > 95){ diff = _.sample([-10,-8,-6,-4,-2]); }
      else { diff = _.sample([-10,-8,-6,-4,-2,2,4,6,8,10]); }
      let v = oldValue + diff;
      if(v < 0){v = 0;}
      if(v > 100){v = 100;}
      return v;
    };

    // Update the chart at intervals
    this.setUpdate = (interval) => {
      this.$interval(() => {
        for(let i=0;i<numCharts;i++){
          let value =  getNewValue(this['dynamic'+i][numCols].value);
          this['dynamic'+i].splice(0,1);
          this['dynamic'+i].push({name:'now', value:value});
        }
      }, interval);
    };

    // Initialize the charts with zero values;
    for(let i=0;i<numCharts;i++){
      let colNames = [];
      for(let i=numCols;i>=0;i--){ colNames.push(i); }
      let arr = [];
      // Initial values are zero
      for(let i=0;i<colNames.length - 1;i++){
        arr.push({
          name: colNames[i],
          value: 0
        });
      }
      arr.push({name:'now',value:0});
      this['dynamic'+i] = arr;
    }

    this.setUpdate(300);


    this.init();
  }

  openMymodal() {
    // This is ugly. Is there another way to handle polymer dom stuff?
    Polymer.dom(document).querySelector('#mymodal').modalButtonClicked();
  }

  init() {

    // Populate the gauges
    this.$http.get('service/api/').then((response) => {
      console.log('headers received by stub service:', response.data.headers);
      this.data = response.data;
    });

    // TEST GET
    this.$http.get('querytest/', {
      params: {
        baz: 'wibble'
      }
    }).then((response) => {
      console.log('querytest response', response);
    });

    // TEST POST
    this.$http({
      method: 'POST',
      url: 'posttest',
      data: {
        baz: 'wibble'
      },
      headers: {'Content-Type': 'application/json'}
    }).then((response) => {
      console.log('posttest response', response);
    });

    // Timeout test
    this.$http.get('service/delay/10', {
      headers: {
        timeout: 2000
      }
    }).then((response) => {
      console.log('data received by delay service: "'+response.data+'"');
      this.timeoutdata = response.data;
    }).catch((err) => {
      console.log('delay service request timed out:');
      this.timeoutdata = 'timed out';
    });


    console.log('a initialized with stateParams', this.$stateParams);
  }

}

const APPID_ANALYTICS = 'analytics';
const APPID_BOGUS = 'bogus';

// Strict DI for minification (order is important)
controller.$inject = ['$stateParams', '$http', '$interval', 'AppHubService'];

export default controller;
