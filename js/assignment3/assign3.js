    
            var MyModel = Backbone.Model.extend({
                validate:function(attribute){

                    let emailpat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                    
                    if(!attribute.name){
                        return 'Please Enter your Name!';
                    }
                    else if(!attribute.address){
                        return 'Please Enter your Address!';
                    }
                    else if(attribute.empId<1){
                        return 'Please Enter your Employee ID!';
                    }
                    else if(attribute.age<1){
                        return 'Please Enter your Age!';
                    }
                    else if(attribute.age<10 || !attribute.age){ 
                        return 'please enter proper age'
                    }
                    // else if(emailpat.test(attribute.place)){
                    //     return 'please enter a valid email id'
                    // }
                    
                }
            });

            var modelMy = new MyModel();
            // modelMy.set({
            //         name: '',
            //         address:'',
            //         empId:0,
            //         age:0,
            //         place:''
            //     })

                var Email = Backbone.Model.extend({
                        defaults: {
                                from: '',
                                to: '',
                                subject: '',
                                body: ''
                            },
                            validate:function(attribute){

                                let emailpat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                                
                                if(!emailpat.test(attribute.from)){
                                    return 'Please Enter Proper Email Id!';
                                }
                                else if(!emailpat.test(attribute.to)){
                                    return 'Please Enter Proper Email Id!';
                                }
                                else if(!attribute.subject){
                                    return 'Please Enter subject';
                                }
                                else if(!attribute.body){
                                    return 'please fill the space!';
                                }
                                
                            }
                                        });

                var myEmail = new Email();

                var collections = Backbone.Collection.extend({
                    model:MyModel,
                
                });
                var emailCollection = Backbone.Collection.extend({
                    model:Email, 
                });

                var eCollection = new emailCollection()

                var myCollections = new collections();
                // myCollections.add(modelMy);
           
            var MyView = Backbone.View.extend({
                el: '.container',
                model:modelMy ,
                collection: myCollections,
                template:_.template($('#myView').html()),
                initialize: function () {
                    this.render();
                        $('#sideDiv').hide()
                        $('#details').hide();
                        $('#updateForm').hide();
                    
                },
                events: {
                    'change #name': 'updateName',
                    'change #address': 'updateAddress',
                    'change #empId': 'updateEmp',
                    'change #age': 'updateAge',
                    'change #place': 'updatePlace',
                    'click .delete':'deleteUser',
                    'click .update':'updateModel',
                    'click #updateDetails':'updateDetails',
                    'click #setDetails':'setVal',
                    'click #closeSide':'closePop',
                    'click #closeDetails':'closeDetails',
                    'click #openSide':'toggler',
                    'click #viewDetails':'viewDetails'
                },
                render: function () {
                    $('#details').hide();
                        $('#updateForm').hide();
                    this.$el.html(this.template({collection:this.collection.toJSON()}));
                },
               
                 deleteUser: function (event) {
                    event.preventDefault();
                     var index = $(event.currentTarget).closest('tr').index();
                    
                     Swal.fire({
                         title: 'Are you sure?',
                         text: "You won't be able to revert this!",
                         icon: 'warning',
                         showCancelButton: true,
                         confirmButtonColor: '#3085d6',
                         cancelButtonColor: '#d33',
                         confirmButtonText: 'Yes, delete it!'
                     }).then((result) => {
                         if (result.isConfirmed) {
                             Swal.fire(
                                 'Deleted!',
                                 'Your file has been deleted.',
                                 'success'
                             )
                          
                                this.collection.at(index).destroy()
                                this.render()
                                $('#updateForm').hide();
                                $('#sideDiv').hide();
                         }
                     })
                },
                
                updateModel: function () {
                    // $('#createDetails').hide()
                    $('#updateForm').show()
                    let col;
                    col = {name:'',address:'',empId:0,age:0,place:''}
                    var index = $(event.currentTarget).closest('tr').index();
                     col = this.collection.at(index);
                     console.log(col.toJSON());
                     var templateData = _.extend({}, col.toJSON(), { collection:this.collection.toJSON(),name: col.toJSON().name,address:col.toJSON().address,  empId:col.toJSON().empId,age:col.toJSON().age, place:col.toJSON().place  });
                    this.$el.html(this.template(templateData));
                    $('#createDetails').hide();
                    $('#sideDiv').hide();
                },

                updateDetails:function(e){
                    e.preventDefault();
                    let name=$('#nameUp').val();
                    let address=$('#addressUp').val();
                    let empId=$('#empIdUp').val();
                    let age=$('#ageUp').val();
                    let place=$('#placeUp').val();
                    console.log(name, address, empId, age, place);
                    var modelToUpdate = this.collection.findWhere({ empId: empId });
                    console.log(modelToUpdate);
                    if (modelToUpdate) {
                        modelToUpdate.set({ name:name,
                        address:address,
                        empId:empId,
                        age:age,
                        place:place,});
                    }
                    this.render();
                    $('#updateForm').hide();
                    $('#createDetails').show();
                    $('#sideDiv').hide();
                },

                setVal:function(e){
                  
                    let data = {
                        name:$('#name').val(),
                        address:$('#address').val(),
                        empId:$('#empId').val(),
                        age:$('#age').val(),
                        place:$('#place').val(),
                    }
                    let mdl = new MyModel();
                    mdl.set(data)

                    if(mdl.isValid()){
                        console.log('valid data')
                        this.collection.add(mdl);
                              Swal.fire(
                            'Good job!',
                            'You entered details successfully!!',
                            'success'
                        )
                    }else{
                        Swal.fire(
                            'Please Enter all Fields',
                            mdl.validationError,
                            'warning'
                        )                       
                    }
                    this.$el.html(this.template({collection:this.collection.toJSON()})); 
                    $('#details').hide();
                    $('#updateForm').hide()
                    $('#sideDiv').hide()
                    

                },
                closePop:function(){                   
                    $('#sideDiv').animate({
                    width: 'toggle'
                }, 500, function () {
                    
                });;
                    
                },
                closeDetails:function(){
                   
                    $('#details').animate({
                    width: 'toggle'
                }, 500, function () {
                  
                });;
                    
                },
                viewDetails:function(){
                    let data = this.model.toJSON();
                    console.log(this.collection.toJSON());
                    if(this.collection.toJSON()==''){
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Please enter proper details!'
                        })
                    }
                    else{
                        $('#details').show(500);
                       
                    }
                },
                toggler:function(){
                $('#sideDiv').animate({
                    width: 'toggle'
                }, 500, function () {
                });;
            },
            });            
            var exView2 = Backbone.View.extend({
                
            el:'.container',
            tagName: 'div',
            className: 'email',
            model:myEmail,
            collection:eCollection,
            events:{
                    'change #bodyEmail':'bodyMssg',
                    'click #btnClick':'btnClick',
                    'click #closeMail':'closeMail',
                },
            template:_.template($('#view1').html()),
            initialize: function () {
                    this.render()
                },
                bodyMssg:function(){
                    console.log($('#bodyEmail').val(),'hello')
                },
                
                closeMail:function(){
                    $('#mailData').hide(500)
                },
        });
        var exView3 = Backbone.View.extend({
          el: ".container",
          model: MyModel,
          template: _.template($("#eves2").html()),
          initialize: function () {
            this.render();
          },
          render: function () {
            this.$el.html(this.template($("#eves2").html()));
            const xValues = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
            const yValues = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];

            new Chart("myChart", {
              type: "line",
              data: {
                labels: xValues,
                datasets: [
                  {
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(0,0,255,1.0)",
                    borderColor: "rgba(0,0,255,0.1)",
                    data: yValues,
                  },
                ],
              },
              options: {
                legend: { display: false },
                scales: {
                  yAxes: [{ ticks: { min: 6, max: 16 } }],
                },
              },
            });
          },
        });

        var view4 = exView2.extend({
            template1:_.template($('#tempView').html()), 
            render:function(){
                this.$el.html(this.template({collection:this.collection.toJSON()}))
                $('#tempD').html(this.template1());
                    // $('#mailData').hide()
            },
            btnClick:function(e){
                e.preventDefault();
                console.log("clicked on button",
                $('#bodyEmail').html(),
                $('#fromEmail').html(),
                $('#toEmail').html(),
                $('#subjectEmail').html(),
                // $('#tempView').html()
                );
                let data = {
                    from:$('#fromEmail').html(),
                    to:$('#toEmail').html(),
                    subject:$('#subjectEmail').html(),
                    body:$('#bodyEmail').html(),
                    
                }
                let myEmail = new Email(data);

                if(myEmail.isValid()){
                    this.collection.add(myEmail);
                }else{
                    Swal.fire(
                        myEmail.validationError,
                        'Please Enter All Details',
                        'warning'
                    ) 
                }
                this.$el.html(this.template({collection:this.collection.toJSON()}));
                this.render()
            },

            
        });

        var sideView = Backbone.View.extend({
            el:'#sideDivBar',
            events:{
                'click #openSide':'toggler',
                'click #closeSide':'closePop',
            },
            template:_.template($('#sideBar').html()),
            initialize:function(){
                this.render();
            },
            render:function(){
                this.$el.html(this.template())
            },
            closePop:function(){                   
                $('#sideDiv').animate({
                width: 'toggle'
            }, 500, function () {
                
            });;
                
            },
            toggler:function(){
                $('#sideDiv').animate({
                    width: 'toggle'
                }, 500, function () {
                    
                });;
            },
        })

        var routes = Backbone.Router.extend({
            routes:{
                 '':'showview1',
                 'view1':'showview2',
                 'view2':'showview3',
                 'view3':'showview4',
            },
            showview1:function(){
                var exvew = new MyView();
                var sideV = new sideView();
                console.log("hello view 1")
            },
            showview2:function(){
                var exvew2 = new view4();
                var sideV = new sideView();
                console.log("hello view 2")
            },
            showview3:function(){
                var exvew2 = new exView3();
                var sideV = new sideView();
                console.log("hello view 3")
            },
            showview4:function(){
                var exvew3 = new view4();
                var sideV = new sideView();
                console.log("hello view 4")
            },
        });
        var routers = new routes();
        Backbone.history.start();   