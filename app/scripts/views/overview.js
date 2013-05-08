define(
  ['backbone', 'overview_partial',
   'tpl!../templates/overview-tpl.html'],
  function(Backbone, OverviewPartial, OverviewTpl)  {

    return Backbone.View.extend({

      tagName : 'section',

      className : 'snapshot note',

      template : OverviewTpl,

      views : {},

      initialize : function() {
        this.selectors = {}
      },

      render : function() {
        this.$el.html(this.template());
        this._attachSelectors();
        return this;
      },

      _attachSelectors : function() {
        this.selectors.list = this.$el.find('#overview-list');
      },

      renderPartial : function(id)  {
        this.views[id] = new OverviewPartial({ id : id });
        this.selectors.list.append(this.views[id].render().$el);
      },

      updateOverview : function(id, change) {
        this.views[id].update(change);
      },

      removeCompany : function(id)  {
        console.log(id);
        this.selectors.list.find('#'+id).remove();
      }

    });

  }
)