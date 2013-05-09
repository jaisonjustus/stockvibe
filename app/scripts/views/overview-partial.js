/**
 * Sub view module of overview.
 * @module OverviewPartial
 */
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

      /**
       * Method to attachment commonly used DOM selector to selectors object
       * @method _attachSelectors
       * @access private
       */
      _attachSelectors : function() {
        this.selectors.status = this.$el.find('.status');
        this.selectors.change = this.$el.find('.stock h1');
      },

      /**
       * Method to update the overview details.
       * @method update
       * @access public
       * @param string change
       */
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