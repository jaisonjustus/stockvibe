define(
  ['backbone'
   'tpl!../templates/overview-tpl.html'],
  function(Backbone, OverviewTpl)  {

    return Backbone.View.extend({

      tagName : 'section',

      className : 'snapshot note',

      template : OverviewTpl,

      render : function() {
        
      }  

    });

  }
)