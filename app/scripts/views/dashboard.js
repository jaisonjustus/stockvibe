define(
  ['jquery', 'backbone', 'stock', 'utility', 'd3dc', 'company', 'snapshot',
  'tpl!../templates/dashboard-tpl.html'],
  function($, _, Stock, Utility, D3DC, Company, Snapshot, DashboardTpl)  {

    return Backbone.View.extend({

      name : 'DashboardView',

      el : '#app-wrapper',

      template : DashboardTpl,

      model : new Stock,

      selectors : {},

      companies : [],

      company : {},

      snapshots : {},

      events : {
        'click #add-code' : '_onAddCode'
      },

      initialize : function() {

        // this.model.set({ id : 'MSFT' })

        // this.model.on('reset', function() {
        //  console.log(Utility.YQLtoD3DCMapper(this.model));
        // }, this);
      },

      render : function() {
        // this.on('addSnapshot', this._addSnapshot);

        this.$el.html(this.template());
        this._attachSelectors();
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
          this.company.on('yqlFetchSuccess', this._addCompany, this)  
        }
      },

      /**
       * Method to search company if valid add stock snapshot of the stock.
       * @method _addCompany
       * @access private
       */
      _addCompany : function(company)  {
        var details = this.company.toJSON();

        if(details.price !== '0') {
          this.companies.push(company);
          // this.trigger('addSnapshot', details.id);
          this._addSnapshot(details.id);
        }else {
          this.selectors.statusLabel.html('Invalid company!!!');
        }
      },

      _addSnapshot : function(id) {
        this.snapshots[id] = new Snapshot({ id : id });
        this.selectors.snapshotWrapper.append(this.snapshots[id].render().$el);
      }

    });

  }
);