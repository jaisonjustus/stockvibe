define(
  ['backbone', 'dashboard'],
  function(Backbone, DashboardView)  {

    return Backbone.Router.extend({

      views : {},

      routes : {
        '' : '_login',
        'dashboard' : '_dashboard'
      },

      initialize : function() {
        this.views.dashboard = new DashboardView();
      },

      /**
       * Route handler for login page.
       * @method _login
       * @access private
       */
      _login : function() {
        console.log('login page');
      },

      /**
       * Route handler for dashboard page.
       * @method _dashboard
       * @access private
       */
      _dashboard : function() {
        this.views.dashboard.render();
        console.log('dashboard page');
      }

    });

  }
);