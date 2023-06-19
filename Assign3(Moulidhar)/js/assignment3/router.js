var routes = Backbone.Router.extend({
    routes:{
         '':'showview1',
         'view1':'showview2',
         'view2':'showview3',
    },
    showview1:function(){
        var exvew = new MyView();
        // var exvew = new exView2();
        console.log("hello view 1")
    },
    showview2:function(){
        var exvew2 = new exView2();
        console.log("hello view 2")
    },
    showview3:function(){
        var exvew2 = new exView3();
        console.log("hello view 3")
    },
});
var routers = new routes();
Backbone.history.start();