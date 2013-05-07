define(
  ['backbone', 'user','tpl!../templates/login-tpl.html', 'crypto'],
  function(Backbone, User, LoginTpl)  {

    return Backbone.View.extend({

      name : 'LoginView',

      el : '#app-wrapper',

      template : LoginTpl,

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
              localStorage.setItem('id', this.model.get('_id').$oid);
              localStorage.setItem('avatar', this.model.get('avatar'));
              window.location.href = "/#/dashboard";
            }
          }else {
            if(this.model.get('_id')) {
              localStorage.setItem('id', this.model.get('_id').$oid);
              localStorage.setItem('avatar', this.model.get('avatar'));
            }
          }
        }, this);
      },

      render : function() {
        this.$el.html(this.template());
        this._attachSelector();
        return this;
      },

      _attachSelector : function()  {
        this.selector.button = this.$el.find('#login');
        this.selector.notification = this.$el.find('#notification');
        this.selector.errorNotification = this.$el.find('#error-notification');
        this.selector.message = this.$el.find('#message');
        this.selector.header = this.$el.find('#login-form-wrapper header h1');
        this.selector.email = this.$el.find('#email');
        this.selector.password = this.$el.find('#password');
      },

      _onSignUpToggle : function()  {
        if(this.state) {
          this.selector.notification.animate({opacity : 'show'}, "slow");
          this.selector.button.val('Sign Up');
          this.selector.message.html('Already a User, <span id="sign-up-toggle">Login Here.</span>');
          this.selector.header.html('Sign up');
        }else {
          this.selector.notification.animate({opacity : 'hide'}, "slow");
          this.selector.button.val('Login');
          this.selector.message.html('New user, <span id="sign-up-toggle">Signup here.</span>');
          this.selector.header.html('Sign in');
        }

        this.state = !this.state;
      },

      _onButtonClick : function() {
        if(!this.state) {
          this._userSignUp();
        }else {
          this._userlogin();
        }
      },

      _userSignUp : function() {
        this.model.set({
          email : this.selector.email.val(),
          password : this.selector.password.val(),
          avatar : CryptoJS.MD5(this.selector.email.val()).toString()
        });

        this.model.save();
      },

      _userlogin : function() {
        this.model.set({
          email : this.selector.email.val(),
          password : this.selector.password.val()
        });

        this.model.fetch();
      }

    });

  }
);