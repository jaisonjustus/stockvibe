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
    },
  },

  /* Application Dependencies. */
  paths: {

  	/* Third party vendor libraries. */
    jquery : '../components/jquery/jquery',
    backbone : '../components/backbone-amd/backbone',
    underscore : '../components/underscore-amd/underscore',
    tpl : '../components/requirejs-tpl/tpl',

    /* Custom Modules. */
    yql_finance_model : 'modules/yql_finance_model',
    utility : 'modules/utility',

    /* Backbone Models. */
    stock : 'models/stock',
    company : 'models/company',
    d3dm : 'models/D3DataModel',

    /* Backbone Collections. */
    d3dc : 'collections/D3DataCollection',

    /* Backbone Views. */
    dashboard : 'views/dashboard'  
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