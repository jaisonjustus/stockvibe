/**
 * Application dashboard view controller. 
 * @module Dashboard
 */
define(
  ['backbone', 'stock', 'company', 'snapshot',
   'overview', 'notification', 'data_fetcher', 'tpl!../templates/dashboard-tpl.html'],
  function(Backbone, Stock, Company, Snapshot, Overview, Notification,
    DataFetcher, DashboardTpl)  {

    return Backbone.View.extend({

      name : 'DashboardView',

      el : '#app-wrapper',

      user : null,

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

      notificationMessages : {
        stockDown : 'Stock Alert - %code stock fall below your cutoff. Current: %current , Change: %change',
        stockUp : 'Stock Alert - %code stock rise above your cutoff. Current: %current , Change: %change'
      },

      events : {
        'click #add-code' : '_onAddCode',
        'click #code' : '_onCodeTxtClick',
        'click #header-logout' : '_onLogout'
      },

      initialize : function(options) {
        this.user = options.model;
      },

      render : function() {

        this.$el.html(this.template({
          avatar : localStorage.getItem('avatar'),
          name : localStorage.getItem('name')
        }));

        this._attachSelectors();

        this.extraViews.overview = new Overview();
        this.extraViews.notification = new Notification();

        this.selectors.snapshotWrapper.append(this.extraViews.overview.render().$el);
        this.selectors.snapshotWrapper.append(this.extraViews.notification.render().$el);

        if(localStorage.getItem('snapshots') !== null)  {
          this.companies = JSON.parse(localStorage.getItem('snapshots'));  

          this.companies.forEach(function(snaps)  {
            this._addSnapshot(snaps);
            this.extraViews.overview.renderPartial(snaps);
          }, this);

        }
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
      _addCompany : function()  {
        var details = this.company.toJSON();

        if(this.companies.indexOf(details.id) <= -1)  {
          if(details.price !== '0') {
            this.companies.push(details.id);

            this._updateUserSnapshots();

            this._addSnapshot(details.id);
            this.extraViews.overview.renderPartial(details.id);
          }else {
            this.selectors.statusLabel.html('Invalid company!');
          }
        }else {
          this.selectors.statusLabel.html('Already in dashboard!');
        }
      },

      _updateUserSnapshots : function() {
        this.user.set({ snapshots : this.companies });
        this.user.save();
      },

      /**
       * Method to add a snapshot to the snapshot wrapper.
       * @method _addSnapshot
       * @access private
       * @param string id
       */
      _addSnapshot : function(id) {
        this.snapshots[id] = new Snapshot({ id : id });

        /* Attaching snapshot listeners. */
        this.snapshots[id].on('updateOverview', this._callOverview, this);
        this.snapshots[id].on('removeSnapshot', this._removeSnapshot, this);
        this.snapshots[id].on('stockAlertUp', this._setNotification, this);
        this.snapshots[id].on('stockAlertDown', this._setNotification, this);

        // this.DataFetcherPorts[id] = new DataFetcher(id);
        this.selectors.snapshotWrapper.append(this.snapshots[id].render().$el);
        this.snapshots[id].renderChart();
      },

      _removeSnapshot : function(id)  {
        window.clearInterval(window[id]);
        this.companies = this.companies.splice(this.companies.indexOf(id), 1);
        this._updateUserSnapshots();
        this.snapshots[id].remove();
        this._removeCompanyFromOverview(id);
      },

      _removeCompanyFromOverview : function(id) {
        this.extraViews.overview.removeCompany(id);
      },

      /**
       * Method to update overview tile when there is a change in the
       * stock snapshot.
       * @method _callOverview
       * @access private
       */
      _callOverview : function(data)  {
        this.extraViews.overview.updateOverview(data.id, data.Change);
      },

      _onCodeTxtClick : function()  {
        this.selectors.statusLabel.html('Enter company code');
      },

      _setNotification : function(type, data) {
        var message = this.notificationMessages[type],
            replaceString = '%'+attr;

        for(var attr in data) {
          replaceString = '%' + attr;
          message = message.replace(replaceString, data[attr]);
        }

        this.extraViews.notification.addNotification(message);
      },

      _onLogout : function()  {
        window.location.href = '/#/logout';
      }

    });

  }
);