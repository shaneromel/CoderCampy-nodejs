var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var mongo=require('mongodb');

var passport=require('passport'),LocalStrategy=require('passport-local').Strategy;

var express=require('express');
var app=express();
var cors=require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(cors());
app.use(express.static("public"));
app.use(passport.initialize());

// Connection URL
var url = 'mongodb://codercampy:password@ds117136.mlab.com:17136/codercampy';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  var db=client.db("CoderCampy");
  var User=db.collection("users");

  
  var filter;

  app.post('/course-rating', function(request, response){

    if(request.body) {
      addCourseRating(db,function(isAdded){
        if (isAdded) {
          response.send({code:"success"});
        } else {
          response.send({code:"failed"});
        }
      },request.body);
    }

  });

  app.post('/blog-rating', function(request, response){

    if(request.body) {
      addBlogRating(db,function(isAdded){
        if (isAdded) {
          response.send({code:"success"});
        } else {
          response.send({code:"failed"});
        }
      },request.body);
    }

  });

  app.post('/add-fav', function(request, response){

    if(request.body) {
      addFav(db,function(isAdded){
        if (isAdded) {
          response.send({code:"success"});
        } else {
          response.send({code:"failed"});
        }
      },request.body);
    }

  });

  app.post('/remove-fav', function(request, response){

    if(request.body) {
      removeFav(db,function(isAdded){
        if (isAdded) {
          response.send({code:"success"});
        } else {
          response.send({code:"failed"});
        }
      },request.body);
    }

  });


  app.post('/course-discussion', function(request, response){

    if(request.body) {
      addCourseDiscussion(db,function(isAdded){
        if (isAdded) {
          response.send({code:"success"});
        } else {
          response.send({code:"failed"});
        }
      },request.body);
    }

  });

  app.post('/blog-discussion', function(request, response){

    if(request.body) {
      addBlogDiscussion(db,function(isAdded){
        if (isAdded) {
          response.send({code:"success"});
        } else {
          response.send({code:"failed"});
        }
      },request.body);
    }

  });

  app.get('/courses',function(req,res){
    findcourses(db,function(docs){
      res.send(docs);
    })
  })

  app.get('/language-search/:ids',function(req,res){
    findcourses(db,function(docs){
      var languages=req.params.ids.split(',');
      var result=[];

      docs.forEach(doc=>{

        var found = false;

        for(var j=0;j<doc.languages.length;j++){
          for(var i=0;i<languages.length;i++){
            if(languages[i]==doc.languages[j]){
              result.push(doc);
              found = true;
              break;
            }
          }
          if(found) {
            break;
          }
        }

      })
      res.send(result);
    })
  })

  app.get('/instructor-search/:id',function(req,res){
    findcoursesByInstructor(db,function(docs){
      res.send(docs);
    }, req.params.id);
  })

  app.get('/categories',function(req,res){
    findcategories(db,function(docs){
      res.send(docs);
    })
  })

  app.get('/home-data',function(req,res){
    findHomeData(db,function(docs){
      res.send(docs);
    })
  })

  app.get('/name/:uid',function(req,res){
    findUserNameByUid(db,function(docs){
      res.send({name : docs});
    }, req.params.uid);
  })

  app.get('/instructors',function(req,res){
    findinstructors(db,function(docs){
      res.send(docs);
    })
  })

  app.get('/languages',function(req,res){
    findlanguages(db,function(docs){
      res.send(docs);
    })
  })

  app.get('/category/:id',function(req,res){
    findcategoryById(db, function(doc){
      res.send(doc);
    },req.params.id);
  })

  app.get('/course/:id',function(req,res){
    findcourseById(db,function(docs){
      res.send(docs);
    },req.params.id)
  })

  app.get('/instructor/:id',function(req,res){
    findinstructorById(db,function(docs){
      res.send(docs);
    },req.params.id)
  })

  app.get('/blogs',function(req,res){
    findblogs(db,function(docs){
      res.send(docs);
    })
  })

  app.get('/blog/:id',function(req,res){
    findBlogById(db,function(docs){
      res.send(docs);
    },req.params.id)
  })

  app.get('/discussions/course/:id',function(req,res){
    findDiscussionsByCourseId(db,function(docs){
      res.send(docs);
    },req.params.id)
  })

  app.get('/ratings/course/:id',function(req,res){
    findRatingsByCourseId(db,function(docs){
      res.send(docs);
    },req.params.id)
  })

  app.get('/discussions/blog/:id',function(req,res){
    findDiscussionsByBlogId(db,function(docs){
      res.send(docs);
    },req.params.id)
  })

  app.get('/ratings/blog/:id',function(req,res){
    findRatingsByBlogId(db,function(docs){
      res.send(docs);
    },req.params.id)
  })

  app.get('/language/:id',function(req,res){
    findLanguage(db,function(doc){
      res.send(doc);
    },req.params.id)
  })

  app.get('/languages/:ids',function(req,res){
    findlanguages(db,function(docs){

      languages = req.params.ids.split(",");
      var result=[];

      docs.forEach(doc=>{

        languages.forEach(lan => {
          if(lan == doc._id) {
            result.push(doc);
          }
        })

      })

      res.send(result);

    })
  })

  app.get('/courses/:ids',function(req,res){
    findcourses(db,function(docs){

      courses = req.params.ids.split(",");
      var result=[];

      docs.forEach(doc=>{

        courses.forEach(course_id => {
          if(course_id == doc._id) {
            result.push(doc);
          }
        })

      })

      res.send(result);

    })
  })

  app.get('/categories/:ids',function(req,res){
    findcategories(db,function(docs){

      categories = req.params.ids.split(",");
      var result=[];

      docs.forEach(doc=>{

        categories.forEach(category => {
          if(category == doc._id) {
            result.push(doc);
          }
        })

      })

      res.send(result);

    })
  })

  app.get('/search-course/:name',function(req,res){
    findCoursesByName(db,function(docs){
      res.send(docs)
    },req.params.name);
  });

  app.post('/add-user',function(req,res){
    var email=req.body.email;
    var name=req.body.name;
    var id=req.body.uid;
    var prov = req.body.provider;
    var image = req.body.image;

    if (email && name && id && prov) {

      if (!image) {
      image: "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png";
      }

      var user={
        email:email,
        name:name,
        uid:id,
        provider:prov,
        image: image
      }

      addUser(db,function(isAdded){
        if (isAdded) {
          res.send({code:"success"});
        } else {
        res.send({code:"failed"});
        }
      },user);
    } else {
      res.send({code:"failed"});
    }

  })

  app.post('/update-user', function(req,res){
    updateUser(db, function(isUpdated){
      res.send(isUpdated);
    }, req.body);
  })

  app.get('/users',function(req,res){
    findusers(db,function(docs){
      res.send(docs);
    })
  });

  app.get('/user/:id',function(req,res){
    findUserById(db,function(doc){
      res.send(doc);
    },req.params.id);
  });

  app.get('/user-uid/:uid', function(req,res){
    findUserByUid(db, function(doc){
      res.send(doc);
    }, req.params.uid);
  })

  app.get('/category-search/:id',function(req,res){
    findcoursesByCategory(db,function(docs){
      res.send(docs);
    }, req.params.id);
  })

  app.get('/',function(req,res){
    
  })

});

var findAll= function(db,callback){
  
}

var findcourses = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('courses');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var findcoursesByInstructor = function(db, callback, id) {
  // Get the documents collection
  var collection = db.collection('courses');
  // Find some documents
  collection.find({instructor:mongo.ObjectId(id)}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var findUserNameByUid = function(db, callback, uid) {
  // Get the documents collection
  var collection = db.collection('users');
  // Find some documents
  collection.findOne({uid:uid} , function(err, docs){
    assert.equal(err, null);
    callback(docs.name);
  });
}

var findblogs = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('blog');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var findBlogById = function(db,callback, category){
  var collection=db.collection('blog');

  collection.findOne({_id:mongo.ObjectId(category)} , function(err, docs){
    assert.equal(err,null);
    callback(docs);
  })
}

var findDiscussionsByCourseId = function(db,callback, category){
  var collection=db.collection('course_discussions');

  collection.findOne({course_id:mongo.ObjectId(category)} , function(err, docs){
    assert.equal(err,null);
    callback(docs);
  })
}

var findRatingsByCourseId = function(db,callback, category){
  var collection=db.collection('course_ratings');

  collection.findOne({course_id:mongo.ObjectId(category)} , function(err, docs){
    assert.equal(err,null);
    callback(docs);
  })
}

var findRatingsByBlogId = function(db,callback, category){
  var collection=db.collection('blog_ratings');

  collection.findOne({blog_id:mongo.ObjectId(category)} , function(err, docs){
    assert.equal(err,null);
    callback(docs);
  })
}


var findDiscussionsByBlogId = function(db,callback, id){
  var collection=db.collection('blog_discussions');

  collection.findOne({blog_id:mongo.ObjectId(id)} , function(err, docs){
    assert.equal(err,null);
    callback(docs);
  })
}


var findcoursesByCategory=function(db,callback, category){
  var collection=db.collection('courses');

  collection.find({category:mongo.ObjectId(category)}).toArray(function(err, docs){
    assert.equal(err,null);
    callback(docs);
  })
}

var findinstructors = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('instructors');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var findcategories = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('categories');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var findHomeData = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('home');
  // Find some documents
  collection.findOne({_id:mongo.ObjectId("5abe16aaa752c82bf018f76b")},function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var findlanguages = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('languages');
  // Find some documents sas
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var findcategoryById = function(db, callback,id) {
  // Get the documents collection
  id=id.trim();
  var collection = db.collection('categories');
  // Find some documents
  collection.findOne({_id:mongo.ObjectId(id)} , function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var findinstructorById = function(db, callback,id) {
  // Get the documents collection
  id=id.trim();
  var collection = db.collection('instructors');
  // Find some documents
  collection.findOne({_id:mongo.ObjectId(id)} , function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var findcourseById= function(db, callback,id) {
  // Get the documents collection h
  id=id.trim();
  // var objectId= new mongo.ObjectId(id);
  var collection = db.collection('courses');
  // Find some documents
  collection.findOne({_id:mongo.ObjectId(id)},function(err,doc){
    if (err) {
      throw err;
  }
  callback(doc);
  })
}

var findLanguage=function(db,callback,id){
  id=id.trim();
  var collection=db.collection("languages");
  collection.findOne({_id:mongo.ObjectId(id)},function(err,doc){
    if (err) {
      throw err;
    }
    callback(doc);
  })
}

var findCoursesByName=function(db,callback,name){
  name=name.trim();
  var collection=db.collection("courses");
  
  collection.find({$text:{$search:name}}).project({ score: { $meta: "textScore" } }).sort( { score: { $meta: "textScore" } } ).toArray(function(err,docs){
    assert.equal(err, null);
    callback(docs);
  });

}

var addUser=function(db,callback,user){
  var collection=db.collection("users");

  collection.insertOne(user,function(err,res){
    if(err){
      callback(false)
    }else{
      callback(true);
    }
    
  })

}

var addCourseRating=function(db,callback,data){
  var collection=db.collection("course_ratings");

  var cond = {
    course_id: mongo.ObjectId(data.course_id)
  };

  var d = {
    uid: data.uid,
    rating: parseInt(data.rating),
    message: data.message
  }

 //data -> course_id, rating, message, uid

 // collection.createIndex({'ratings.uid':1},{unique:true});
  collection.findOneAndUpdate( cond,{$push : {ratings: d}}, {upsert:true},function(err,res){
    if(err) throw err;
    callback(true);
  })

}

var addBlogRating=function(db,callback,data){
  var collection=db.collection("blog_ratings");

  var cond = {
    blog_id: mongo.ObjectId(data.blog_id)
  };

  var d = {
    uid: data.uid,
    rating: parseInt(data.rating),
    message: data.message
  }

 //data -> blog_id, rating, message, uid

 // collection.createIndex({'ratings.uid':1},{unique:true});
  collection.findOneAndUpdate( cond,{$push : {ratings: d}}, {upsert:true},function(err,res){
    if(err) throw err;
    callback(true);
  })

}

var addFav = function(db,callback,data){
  var collection=db.collection("users");

  var cond = {
    uid: data.uid
  };

 //data -> course_id, uid

  collection.findOneAndUpdate( cond,{$push : {favourites: mongo.ObjectId(data.course_id)}},function(err,res){
    if(err) throw err;
    callback(true);
  })

}

var removeFav = function(db,callback,data){
  var collection=db.collection("users");

  var cond = {
    uid: data.uid
  };

 //data -> course_id, uid

  collection.findOneAndUpdate( cond,{$pull : {favourites: mongo.ObjectId(data.course_id)}},function(err,res){
        if(err) throw err;
        callback(true);
  })

}

var addCourseDiscussion = function(db,callback,data){
  var collection=db.collection("course_discussions");

  var cond = {
    course_id: mongo.ObjectId(data.course_id)
  };

 d={
   uid:data.uid,
   timestamp: Date.now(),
   message: data.message
 }

 //data-> course_id, uid, message

  collection.findOneAndUpdate( cond,{$push : {discussions: d}},function(err,res){
    if(err) throw err;
    callback(true);
  })

}

var addBlogDiscussion = function(db,callback,data){
  var collection=db.collection("blog_discussions");

  var cond = {
    blog_id: mongo.ObjectId(data.blog_id)
  };

 d={
   uid:data.uid,
   timestamp: Date.now(),
   message: data.message
 }

 //data-> blog_id, uid, message

  collection.findOneAndUpdate( cond,{$push : {discussions: d}},function(err,res){
    if(err) throw err;
    callback(true);
  })

}

var updateUser= function(db, callback, data){
  var collection=db.collection("users");

  collection.findOneAndUpdate({uid:data.uid},{$set:{name:data.name, image:data.image}}, function(err, res){
    if(err) throw err;
    callback(true)
  })
}

var findusers = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('users');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var findUserById=function(db,callback,id){
  var collection=db.collection('users');

  collection.findOne({_id:mongo.ObjectId(id)}, function(err,doc){
    assert.equal(err,null);
    callback(doc);
  })
}

var findUserByUid=function(db, callback, uid){
  var collection=db.collection('users');

  collection.findOne({uid:uid}, function(err,doc){
    assert.equal(err, null);
    callback(doc);
  })
}

var port = process.env.PORT || 3000;
app.listen(port);