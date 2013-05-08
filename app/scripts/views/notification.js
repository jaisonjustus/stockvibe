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

      _attachSelector : function()  {
        this.selectors.list = this.$el.find('#notification-list');
      },

      addNotification : function(message)  {
        this.partial = new NotificationPartial();
        
        if(this.selectors.list.children().length >= 5)  {
          this.selectors.list.find('li').last().hide().remove();
        }
        this.selectors.list.prepend(this.partial.render(message).$el);
      }

    });

  }
)