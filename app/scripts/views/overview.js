/**
 * Module to handle render functionality for stock overview.
 * @module Overview
 */
define(
  ['backbone', 'overview_partial',
   'tpl!../templates/overview-tpl.html'],
  function(Backbone, OverviewPartial, OverviewTpl)  {

    return Backbone.View.extend({

      tagName : 'section',

      className : 'snapshot note',

      template : OverviewTpl,

      /* Object to maintain the sub views. */
      views : {},

      initialize : function() {
        this.selectors = {};
      },

      render : function() {
        this.$el.html(this.template());
        this._attachSelectors();
        return this;
      },

      /**
       * Method to attachment commonly used DOM selector to selectors object
       * @method _attachSelectors
       * @access private
       */
      _attachSelectors : function() {
        this.selectors.list = this.$el.find('#overview-list');
      },

      /**
       * Method to render the overview list items.
       * @method renderPartial
       * @access public
       * @param string id
       */
      renderPartial : function(id)  {
        this.views[id] = new OverviewPartial({ id : id });
        this.selectors.list.append(this.views[id].render().$el);
      },

      /**
       * Method to change the overview data of a stock when its values changes.
       * @method updateoverview
       * @access public
       * @param string id
       * @param string change
       */
      updateOverview : function(id, change) {
        this.views[id].update(change);
      },

      /**
       * Method to remove a compnay from the overview when its snapshot id deleted
       * from the dashboard.
       * @method removeCompany
       * @access public
       * @param string id
       */
      removeCompany : function(id)  {
        console.log(id);
        this.selectors.list.find('#'+id).remove();
      }

    });

  }
)