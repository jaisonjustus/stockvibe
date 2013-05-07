define(
  ['backbone'],
  function(Backbone)  {

    return Backbone.Model.extend({

      idAttribute : "_id",

      defaults : {
        "email" : 'user@stockvibe.com',
        "password" : "user",
        "avatar" : 'emailhash'
      },

      url : function()  {
        if(this.get('email') === undefined && this.get('password') === undefined) {
          return 'https://api.mongolab.com/api/1/databases/stockvibe/collections/user?'+((arguments) ? ('q=' + arguments[0] + '&') : '')+'apiKey=4f6acab2e4b019347c6711c7';
        }
      },

      save : function() {
        this.url = 'https://api.mongolab.com/api/1/databases/stockvibe/collections/user?apiKey=4f6acab2e4b019347c6711c7';

        Backbone.Model.prototype.save.call(this);
      },

      fetch : function()  {
          this.url = 'https://api.mongolab.com/api/1/databases/stockvibe/collections/user?fo=true&';
          this.url += 'q=' + JSON.stringify({
            email : this.get('email'),
            password : this.get('password')
          });
          this.url += '&apiKey=4f6acab2e4b019347c6711c7';  

        Backbone.Model.prototype.fetch.call(this);      
      }

    })

  }
)