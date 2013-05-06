define(
  ['backbone', 'tpl!../templates/overview-partial-tpl.html'],
  function(Backbone, OverviewPartialTpl)  {

    return Backbone.View.extend({

      tagName : 'li',

      code : null,

      template : OverviewPartialTpl,
      
      initialize : function(options) {
        this.code = options.id;
        this.selectors = {};
      },

      render : function() {
        this.$el.html(this.template({ id : this.code }));
        this._attachSelectors();
        return this;
      },

      _attachSelectors : function() {
        this.selectors.status = this.$el.find('.status');
        this.selectors.change = this.$el.find('.stock h1');
      },

      update : function(change) {
        if(change.match(/\+/g)) {
          this.selectors.status.removeClass('down-small');
          this.selectors.status.addClass('up-small');
        }else {
          this.selectors.status.removeClass('up-small');
          this.selectors.status.addClass('down-small');
        }

        this.selectors.change.html(change);
      }

    });

  }
);