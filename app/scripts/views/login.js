/**
 * Module to manage the login view.
 * @module LoginView
 */
define(
  ['backbone', 'user','tpl!../templates/login-tpl.html', 'crypto'],
  function(Backbone, User, LoginTpl)  {

    return Backbone.View.extend({

      name : 'LoginView',

      el : '#app-wrapper',

      template : LoginTpl,

      /* Maintain the state of the page, because the same view handle user
         sign in and user sign up. */
      state : true,

      model : new User,

      events : {
        'click #sign-up-toggle' : '_onSignUpToggle',
        'click #login' : '_onButtonClick'
      },

      initialize : function() {
        this.selector = {};

        this.model.on('sync', function()  {
          if(this.state) {
            if(!this.model.get('_id')){
              this.selector.errorNotification.animate({opacity : 'show'}, "slow");
            }else {
              this._populateLocalStorageForDashboard();
              window.location.href = "/#/dashboard";
            }
          }else {
            if(this.model.get('_id')) {
              this._populateLocalStorageForDashboard();
              window.location.href = "/#/dashboard";
            }
          }
        }, this);
      },

      render : function() {
        this.$el.html(this.template());
        this._attachSelector();
        return this;
      },

      /**
       * Method to attach the dom selectors.
       * @method _attachSelector
       * @access private
       */
      _attachSelector : function()  {
        this.selector.button = this.$el.find('#login');
        this.selector.notification = this.$el.find('#notification');
        this.selector.errorNotification = this.$el.find('#error-notification');
        this.selector.message = this.$el.find('#message');
        this.selector.header = this.$el.find('#login-form-wrapper header h1');
        this.selector.name = this.$el.find('#name');
        this.selector.email = this.$el.find('#email');
        this.selector.password = this.$el.find('#password');
      },

      /**
       * Method to toggle between sign in template and sign up template.
       * @method _onSignUpToggle
       * @access private
       */
      _onSignUpToggle : function()  {
        if(this.state) {
          this.selector.name.animate({opacity : 'show'}, "slow");
          this.selector.notification.animate({opacity : 'show'}, "slow");
          this.selector.button.val('Sign Up');
          this.selector.message.html('Already a User, <span id="sign-up-toggle">Login Here.</span>');
          this.selector.header.html('Sign up');
        }else {
          this.selector.name.animate({opacity : 'hide'}, "slow");
          this.selector.notification.animate({opacity : 'hide'}, "slow");
          this.selector.button.val('Login');
          this.selector.message.html('New user, <span id="sign-up-toggle">Signup here.</span>');
          this.selector.header.html('Sign in');
        }

        this.state = !this.state;
      },

      /**
       * Method to handle the functionality when the button is clicked.
       * @method _onButtonClick
       * @access private
       */
      _onButtonClick : function() {
        if(!this.state) {
          this._userSignUp();
        }else {
          this._userlogin();
        }
      },

      /**
       * Method to persist newly signed in user to the mongodb.
       * @method _userSignUp
       * @access private
       */
      _userSignUp : function() {
        this.model.set({
          name : this.selector.name.val(),
          email : this.selector.email.val(),
          password : this.selector.password.val(),
          avatar : CryptoJS.MD5(this.selector.email.val()).toString()
        });

        this.model.save();
      },

      /**
       * Method to get the login user details.
       * @method _userLogin
       * @access private.
       */
      _userlogin : function() {
        this.model.set({
          email : this.selector.email.val(),
          password : this.selector.password.val()
        });

        this.model.fetch();
      },

      /**
       * Method to populate the localstorage with the user details.
       * @method_populateLocalStorageForDashboard
       * @access private
       * @param object data
       */
      _populateLocalStorageForDashboard : function(data)  {
        data = (data) ? data : this.model;

        localStorage.setItem('id', data.get('_id').$oid);
        localStorage.setItem('avatar', data.get('avatar'));
        localStorage.setItem('name', data.get('name'));
        localStorage.setItem('snapshots', JSON.stringify(data.get('snapshots')));
      }

    });

  }
);