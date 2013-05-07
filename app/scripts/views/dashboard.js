/**
 * Application dashboard view controller. 
 * @module Dashboard
 */
define(
  ['backbone', 'stock', 'company', 'snapshot',
   'overview', 'data_fetcher', 'tpl!../templates/dashboard-tpl.html'],
  function(Backbone, Stock, Company, Snapshot, Overview, 
    DataFetcher, DashboardTpl)  {

    return Backbone.View.extend({

      name : 'DashboardView',

      el : '#app-wrapper',

      template : DashboardTpl,

      /* DOM Selectors. */
      selectors : {},

      /* list of companies in the dashboard. */
      companies : [],

      /* used to save company instance while adding. */
      company : {},

      /* Object to keep track of other views other than snapshots under
         this view. */
      extraViews : {},

      /* Object to keep track of snapshots created under this view. */
      snapshots : {},

      DataFetcherPorts : {},

      events : {
        'click #add-code' : '_onAddCode'
      },

      initialize : function() {

        // this.updateModel = function(id, response, context)  {
        //   context.snapshots[id].model.set(response);
        //   context.snapshots[id]._updateView();
        // }

        // this.text = function()  {
        //   console.log(this);
        // }

      },

      render : function() {
        this.$el.html(this.template({avatar : localStorage.getItem('avatar')}));
        this._attachSelectors();

        this.extraViews.overview = new Overview();
        this.selectors.snapshotWrapper.append(this.extraViews.overview.render().$el);
      },

      /**
       * Method to attached useful DOM selector to selector object for ease of
       * access and manipulation.
       * @method _attachSelectors
       * @access private
       */
      _attachSelectors : function() {
        this.selectors.codeTxtBox = this.$el.find('#code');
        this.selectors.statusLabel = this.$el.find('#add-code-status');

        this.selectors.snapshotWrapper = this.$el.find('#stock-snapshots-wrapper');
      },

      /**
       * Event handler for add code, when user try get a snapshot of stock
       * of a company by adding company code.
       * @method _onAddCode
       * @access private
       */
      _onAddCode : function() {
        var code = this.selectors.codeTxtBox.val().toUpperCase();

        if(code !== '') {
          this.company = new Company();

          this.company.set({ id : code });
          this.company.fetch();
          this.company.on('yqlFetchSuccess', this._addCompany, this);
        }
      },

      /**
       * Method to search company if valid add stock snapshot of the stock.
       * @method _addCompany
       * @access private
       * @param object company
       */
      _addCompany : function(company)  {
        var details = this.company.toJSON();

        if(details.price !== '0') {
          this.companies.push(company);
          this._addSnapshot(details.id);
          this.extraViews.overview.renderPartial(details.id);
        }else {
          this.selectors.statusLabel.html('Invalid company!!!');
        }
      },

      /**
       * Method to add a snapshot to the snapshot wrapper.
       * @method _addSnapshot
       * @access private
       * @param string id
       */
      _addSnapshot : function(id) {
        this.snapshots[id] = new Snapshot({ id : id });
        this.snapshots[id].on('updateOverview', this._callOverview, this);
        this.DataFetcherPorts[id] = new DataFetcher(id);
        this.selectors.snapshotWrapper.append(this.snapshots[id].render().$el);
        this.snapshots[id].renderChart();
      },

      /**
       * Method to update overview tile when there is a change in the
       * stock snapshot.
       * @method _callOverview
       * @access private
       */
      _callOverview : function(data)  {
        this.extraViews.overview.updateOverview(data.id, data.change);
      }

    });

  }
);