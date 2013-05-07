define(
  ['backbone', 'dashboard', 'login'],
  function(Backbone, DashboardView, LoginView)  {

    return Backbone.Router.extend({

      views : {},

      routes : {
        '' : '_login',
        'dashboard' : '_dashboard'
      },

      initialize : function() {
        this.views.dashboard = new DashboardView();
        this.views.login = new LoginView();
      },

      /**
       * Route handler for login page.
       * @method _login
       * @access private
       */
      _login : function() {
        this.views.login.render();
        // console.log('login page');
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