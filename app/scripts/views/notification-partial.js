define(
  ['backbone', 'tpl!../templates/notification-partial-tpl.html'],
  function(Backbone, NotificationPartialTpl)  {

    return Backbone.View.extend({

      tagName : 'li',

      template : NotificationPartialTpl,

      render : function(message) {
        var dateObject = new Date(),
            dateString = '';

        dateString = dateObject.getHours() + ':' + dateObject.getMinutes() + ':' + dateObject.getSeconds();
        this.$el.html(this.template({ message : message, date : dateString }));
        return this;
    }

    })

  }
)