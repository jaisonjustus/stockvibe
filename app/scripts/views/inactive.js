define(
  ['backbone', 'utility','tpl!../templates/inactive-tpl.html'],
  function(Backbone, Utility, InactiveTpl)  {

    return Backbone.View.extend({

      el : '#app-wrapper',

      template : InactiveTpl,

      selector : {},

      render : function() {
        this.$el.html(this.template({ avatar : localStorage.getItem('avatar') }));
        this._attachSelector();
        this._countDown();
      },

      _attachSelector : function()  {
        this.selector.countDown = this.$el.find('#time');
      },

      _countDown : function() {
        window.inactiveTimer = window.setInterval(function()  {
          var time = Utility.calculateTimeAtNYSE('-4'),
              timeString = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' 24hrs (ETZ)';
          if(time.getHours() >= 9 && time.getMinutes() >= 41) {
            window.location.href = '/#/dashboard';
          }
          this.selector.countDown.html(timeString);
        }.bind(this), 1000)
      }

    });

  }
)