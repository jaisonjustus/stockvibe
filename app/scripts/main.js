/*global require*/
'use strict';

require.config({
  shim: {
    underscore: {
        exports: '_'
    },
    backbone: {
        deps: [
            'underscore',
            'jquery'
        ],
        exports: 'Backbone'
    }
  },

  /* Application Dependencies. */
  paths: {

  	/* Third party vendor libraries. */
    jquery : '../components/jquery/jquery',
    backbone : '../components/backbone-amd/backbone',
    underscore : '../components/underscore-amd/underscore',
    tpl : '../components/requirejs-tpl/tpl',
    d3 : 'http://d3js.org/d3.v3.min',
    crypto : 'vendor/md5',

    /* Custom Modules. */
    yql_finance_model : 'modules/yql_finance_model',
    utility : 'modules/utility',
    data_fetcher : 'modules/data_fetcher',
    d3_helper : 'modules/d3_helper',

    /* Backbone Models. */
    stock : 'models/stock',
    company : 'models/company',
    d3dm : 'models/D3DataModel',
    user : 'models/user',

    /* Backbone Collections. */
    d3dc : 'collections/D3DataCollection',

    /* Backbone Views. */
    dashboard : 'views/dashboard',
    snapshot : 'views/snapshot',
    overview : 'views/overview',
    overview_partial : 'views/overview-partial',
    login : 'views/login',
    inactive : 'views/inactive',
    notification : 'views/notification',
    notification_partial : 'views/notification-partial',
  }
});

require(
	['backbone', 'app'], 
	function (Backbone, App) {

		/* Booting Application. */
		new App();

    /* Make correct url root. Backbone only creates the history when 
       at least one route is specified. */
    Backbone.history.start({root:'/'+window.location.pathname});
	}
);