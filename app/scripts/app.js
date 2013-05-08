define(
  ['backbone', 'dashboard', 'login', 'inactive', 'user', 'utility'],
  function(Backbone, DashboardView, LoginView, Inactive, User, Utility)  {

    return Backbone.Router.extend({

      views : {},

      models : {},

      routes : {
        '' : '_login',
        'dashboard' : '_dashboard',
        'inactive' : '_inactive',
      },

      initialize : function() {
        this.models.user = new User();

        this.views.dashboard = new DashboardView({ model : this.models.user });
        this.views.login = new LoginView({ model : this.models.user });
        this.views.inactive = new Inactive();
      },

      /**
       * Route handler for login page.
       * @method _login
       * @access private
       */
      _login : function() {
        if(localStorage.getItem('id') !== null)  {
          this.models.user.set({
            _id : { $oid : localStorage.getItem('id')},
          });

          this.models.user.fetch({ 
            sucess : function()  {
              if(this.models.user.get('email') === ''){
                this.views.login.render();
              }else {
                this.views.login._populateLocalStorageForDashboard(this.models.user);
                window.location.href = "/#/dashboard";
              }
            }
          });

        }else {
          this.views.login.render();
        }
      },

      /**
       * Route handler for dashboard page.
       * @method _dashboard
       * @access private
       */
      _dashboard : function() {
        console.log(Utility.calculateTimeAtNYSE('-4').getHours());
        if((Utility.calculateTimeAtNYSE('-4').getHours() <= 9 && 
            Utility.calculateTimeAtNYSE('-4').getMinutes() <= 40) ||
           Utility.calculateTimeAtNYSE('-4').getHours() >= 16) {
        // if(Utility.calculateTimeAtNYSE('-4').getMinutes() < 09) {
          
          window.location.href = '/#/inactive';
        }else {
          window.clearInterval(window.inactiveTimer);

          this.views.dashboard.render();
        }
      },

      _inactive : function()  {
        this.views.inactive.render();
      }

    });

  }
);