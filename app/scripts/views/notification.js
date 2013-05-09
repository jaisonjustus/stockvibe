/**
 * Module to manage notifications and its sub view.
 * @module Notification
 */
define(
  ['backbone', 'notification_partial', 'tpl!../templates/notification-tpl.html'],
  function(Backbone, NotificationPartial, NotificationTpl)  {

    return Backbone.View.extend({

      tagName : 'section',

      className : 'snapshot alert-tile',

      template : NotificationTpl,

      partial : null,

      selectors : {},

      initialize : function() {},

      render : function() {
        this.$el.html(this.template);
        this._attachSelector();
        return this;
      },

      /**
       * Method to attachment commonly used DOM selector to selectors object
       * @method _attachSelectors
       * @access private
       */
      _attachSelector : function()  {
        this.selectors.list = this.$el.find('#notification-list');
      },

      /**
       * Method to add notification to the tile. 
       * @method addNotification
       * @access public
       * @param string message
       */
      addNotification : function(message)  {
        this.partial = new NotificationPartial();
        
        if(this.selectors.list.children().length >= 8)  {
          this.selectors.list.find('li').last().hide().remove();
        }
        this.selectors.list.prepend(this.partial.render(message).$el);
      }

    });

  }
)