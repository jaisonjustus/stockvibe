/**
 * Module to manage the inactive page. when the stock market is closed.
 * @module Inactive
 */
define(
  ['backbone', 'utility', 'config', 'tpl!../templates/inactive-tpl.html'],
  function(Backbone, Utility, Config, InactiveTpl)  {

    return Backbone.View.extend({

      el : '#app-wrapper',

      template : InactiveTpl,

      selector : {},

      render : function() {
        this.$el.html(this.template({ avatar : localStorage.getItem('avatar') }));
        this._attachSelector();
        this._countDown();
      },

      /**
       * Method to attach selector.
       * @method _attachSelector
       * @access public
       */
      _attachSelector : function()  {
        this.selector.countDown = this.$el.find('#time');
      },

      /**
       * Method to handle the countdown timer.
       * @method _coutDown
       * @access private
       */
      _countDown : function() {
        window.inactiveTimer = window.setInterval(function()  {
          var time = Utility.calculateTimeAtNYSE('-4'),
              timeString = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' 24hrs (ETZ)';
          if(time.getHours() >= 9 && time.getMinutes() >= 41) {
            window.location.href = Config.App.url + "/#/dashboard";
          }
          this.selector.countDown.html(timeString);
        }.bind(this), 1000)
      }

    });

  }
)