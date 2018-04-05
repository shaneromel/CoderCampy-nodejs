
var mongo = require('mongodb');
var assert = require('assert');
var admin = require("firebase-admin");
var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
var Join = require('mongo-join').Join;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'codercampy-438d0',
    clientEmail: 'firebase-adminsdk-m2bfv@codercampy-438d0.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDmlyrx0aewCMJ2\nDoHGc479DPyj3aI6yFQQJD8VLKFrHQXPUW7BDc/0GHNeKvae3/bFRC9cPdj2A0FA\n35cO/Ms/VkcUnCHQKXs5lZSc7bdqiDsFsMiCO6GgQSo8Y8XsNkNwaB0STxUNgVdj\n4UzqXdZP5VozfR8AcENPIm8dHhsTrJPOFTQNDMKMljeKlPbifpi1EavfkGM0JwMT\nHDD7V9cOCkHTbZwW11nKSDMGHQU1Utzjyj7Q/6YDKhn2XTHpQTydPBsqEPU2xB2L\nsRgq5LDU1yz1VwTNG1ReKX18WmQkVIhwsAiehTZ3qsAvfOe+TNBNUTBpzht/CqME\n/dp03lmlAgMBAAECggEAHSbGx9gCvFM7LFwkpW9WCCFEbj32hLpvQDQo4ncoOAet\nBJrtpsvlep09to21bHvxcVpvp1htTZq3POmXag5k7o6sgUtEzhF0ceD6bwVxfu8W\nkR9alfZOdllOquBNNRHeID+VT0t+pJyxrN+ejvGKhsK+zswWZ4KJy98VT4fPEgMt\npLvT8OK/tRk6ZC62MFbpHEEv/9OQSh28n2dWtlO3cFvtiJaooODHuzZSZOqy+05n\nWsUfT4Z/s3w53mkp286RNrRlcP8F85ZGYDaCFvZr5zAXp62xQmiPI2EeTk+sJgR/\nvm8cTLRLpUbpIL8cA4vO1T+G3o2t3+bWJXTUyGDmCQKBgQDzduKlFSxfH3PNj4Vx\ndRR2l2G+o4h2rljQ5cmg8W9giZpUtmkrhS8ZZ79Ar4UOUa3eOpKkyy5hSEIA4KNc\nmeuZ2qVDRVFqJbc20XsYeeym21Nqvpmvl82+gcsNuQdazSTmgFRYZJ/aGADSjTkY\nc7KBDqFw38lddZdYjQhdKDac+QKBgQDydpdN/YRupag4JQB6S3JSpu2dcHKshOCw\nYHHlzKt8FZvzrcEg+0ksklU8LYLu/KEathZIeEk5XCrCAGW6PnFzigTQQ9a57Zxc\n97+aSLXELAyI5ZkBkD4IzeiF42mznXmgOeKXPi4dkB5HV5eDStMWwNuK+op09cD/\no6xItjipDQKBgHVYw/0Vq4Fdw488sfDxoZ9Xb8FXSRsLBbwKRZjRRgGd0Ukrcp2L\nYBw6qTAgaV1xeQA38x6C4CP7k/SgUZz8g1Zw0F8QNiGXdCtz5ITzn2D9LcOxgpnj\n7UL5hElk+WqGnlaLXBwOxA12rE7PyslCWrNhveaNtpzZZM1FjNZ533jhAoGBAK6O\nblO5prQ6EyeIjBV/Z6jVgNAN+qD1cQXKCXXVqcfFjucaOqZSAtZR64dNhKwluJ6Q\nZO57msvu7OGKg7JX7jmuLdT6YgataBsOSiT7H9FBnSyZj1Qu0lpoU3TAyoKDZuLR\nia41F+I0tXfLOctN/TauVeByi2e03eOtpAUdGyGpAoGBALtW/G7UfdLYE+YuskD0\nA9XtuB/cprweruM5J63P4ru4gJhafK7W+QAKYdH36V7a8v4ZDfcTozBI+kMOwSsh\nJ8O2y3TZI34NhFRxGhV3o4h0mhaT8RtV2pe2poXsiAsTEfMsgqRTgB5dcRqWXduw\n471qi8IRv6DPUcEfsDCAJGiA\n-----END PRIVATE KEY-----\n'
	}),
  databaseURL: 'https://codercampy-438d0.firebaseio.com'
});

var url = 'mongodb+srv://codercampy:SyndicatesEra0601@codercampy-1eblt.azure.mongodb.net/test';

mongo.MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);

  var db = client.db("CoderCampy");

  //data -> course_id, rating, message, uid
  app.post('/course-rating', function(request, response){

    if(mongo.ObjectId.isValid(request.body.course_id) && request.body.message && request.body.uid && parseInt(request.body.rating) && parseInt(request.body.rating) > 0 && parseInt(request.body.rating) <= 5) {
      addCourseRating(db,function(res){
        response.send(res);
      },request.body);
    } else {
    	response.send({code:"failed",message:"Body data missing or incorrectly formatted"});
    }

  });

  //data -> blog_id, rating, message, uid
  app.post('/blog-rating', function(request, response){

  	if(mongo.ObjectId.isValid(request.body.blog_id) && request.body.message && request.body.uid && parseInt(request.body.rating) && parseInt(request.body.rating) > 0 && parseInt(request.body.rating) <= 5) {
      addBlogRating(db,function(res){
        response.send(res);
      },request.body);
    } else {
    	response.send({code:"failed",message:"Body data missing or incorrectly formatted"});
    }

  });

  app.get('/ratings/course/:id&:offset&:limit',function(req,res){
    findRatingsByCourseId(db,function(docs){
      res.send(docs);
    },req.params.id,req.params.offset,req.params.limit)
  })

  app.get('/ratings/blog/:id',function(req,res){
    findRatingsByBlogId(db,function(docs){
      res.send(docs);
    },req.params.id)
  })

  //data -> course_id, uid, message
  app.post('/course-discussion', function(request, response){

    if(mongo.ObjectId.isValid(request.body.course_id) && request.body.message && request.body.uid) {
      addCourseDiscussion(db,function(res){
        response.send(res);
      },request.body);
    } else {
    	response.send({code:"failed",message:"Body data missing or incorrectly formatted"});
    }

  });

  //data -> blog_id, uid, message
  app.post('/blog-discussion', function(request, response){

    if(mongo.ObjectId.isValid(request.body.blog_id) && request.body.message && request.body.uid) {
      addBlogDiscussion(db,function(res){
        response.send(res);
      },request.body);
    } else {
    	response.send({code:"failed",message:"Body data missing or incorrectly formatted"});
    }

  });

  app.get('/discussions/course/:id',function(req,res){
    findDiscussionsByCourseId(db,function(docs){
      res.send(docs);
    },req.params.id)
  })

  app.get('/discussions/blog/:id',function(req,res){
    findDiscussionsByBlogId(db,function(docs){
      res.send(docs);
    },req.params.id)
  })

  app.post('/user-update/name', function(request, response){

    if(request.body) {
      updateUserName(db,function(isAdded){
        if (isAdded) {
          response.send({code:"success"});
        } else {
          response.send({code:"failed"});
        }
      },request.body);
    }

  });

  app.post('/user-update/email', function(request, response){

    if(request.body) {
      updateUserEmail(db,function(isAdded){
        if (isAdded) {
          response.send({code:"success"});
        } else {
          response.send({code:"failed"});
        }
      },request.body);
    }

  });

  app.post('/user-update/phone', function(request, response){

    if(request.body) {
      updateUserPhone(db,function(isAdded){
        if (isAdded) {
          response.send({code:"success"});
        } else {
          response.send({code:"failed"});
        }
      },request.body);
    }

  });

   app.post('/toggle-favorite', function(req, res){
    toggleFavorite(db, req.body, function(response){
      res.send(response);
    });
  })

   app.post('/is-favorite', function(req, res){
    isFavorite(db, req.body, function(response){
      res.send(response);
    })
  })

  app.get('/courses/:offset&:limit',function(req,res){
    findcourses(db,function(docs){
      res.send(docs);
    },req.params.offset,req.params.limit)
  })

  app.get('/blogs/:offset&:limit',function(req,res){
    findblogs(db,function(docs){
      res.send(docs);
    },req.params.offset,req.params.limit)
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

  app.get('/blog/:id',function(req,res){
    findBlogById(db,function(docs){
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

var isFavorite= function(db, data, callback){
  var collection=db.collection("users");

  var uid=data.uid;
  var courseId=data.courseId;

  collection.findOne({uid:uid}, function(err, doc){
    assert.equal(err,null);

    var exists=false;
    if(doc){
      if(doc.favourites){
        doc.favourites.forEach(favorite=>{
          if(favorite==courseId){
            exists=true;
          }
        });
      }
    }

    callback(exists);

  })
}

var findcourses = function(db, callback,offset,limit) {
  // Get the documents collection
  var collection = db.collection('courses');
  // Find some documents
  collection.find().skip(parseInt(offset)).limit(parseInt(limit)).toArray(function(err, docs) {
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

var findblogs = function(db, callback,offset,limit) {
  // Get the documents collection
  var collection = db.collection('blog');
  // Find some documents
  collection.find({},{ _id: 1, name: 1, image: 1, instructor: 0, data: 0, time: 1, category: 1, languages: 1 }).skip(parseInt(offset)).limit(parseInt(limit)).toArray(function(err, docs) {
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

  collection.find({course_id:mongo.ObjectId(category)} , function(err, docs){
    assert.equal(err,null);
    callback(docs);
  })
}

var findRatingsByCourseId = function(db,callback, courseId,offset,limit){
  var collection=db.collection('course_ratings');

  collection.find({course_id:mongo.ObjectId(courseId)}/*.skip(parseInt(offset)).limit(parseInt(limit))*/,function(err, cursor) {

     var join = new Join(db).on({
            field: 'uid', // <- field in employee doc 
            as: 'user',     // <- new field in employee for contact doc 
            to: 'uid',         // <- field in employer doc. treated as ObjectID automatically. 
            from: 'users'  // <- collection name for employer doc 
          });    

          join.toArray(cursor, function(err, joinedDocs) {
            // handle array of joined documents here 
            assert.equal(err,null);
            callback(joinedDocs);
          });
      });

}

var findRatingsByBlogId = function(db,callback, blogId){
  var collection=db.collection('blog_ratings');

  collection.find({blog_id:mongo.ObjectId(blogId)} , function(err, docs){
    assert.equal(err,null);
    callback(docs);
  })
}


var findDiscussionsByBlogId = function(db,callback, id){
  var collection=db.collection('blog_discussions');

  collection.find({blog_id:mongo.ObjectId(id)} , function(err, cursor){

	var join = new Join(db).on({
            field: 'uid', // <- field in employee doc 
            as: 'user',     // <- new field in employee for contact doc 
            to: 'uid',         // <- field in employer doc. treated as ObjectID automatically. 
            from: 'users'  // <- collection name for employer doc 
          });    

          join.toArray(cursor, function(err, joinedDocs) {
            // handle array of joined documents here 
            assert.equal(err,null);
            callback(joinedDocs);
          });
      });

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

  var collection = db.collection('languages');

  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });

  /*collection.find({}).skip(2).limit(2).toArray(function(err, posts){
                assert.equal(err, null);
               return callback(posts);
            });*/

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

var updateUserName = function(db,callback,data){

  var collection=db.collection("users");

  var cond = {
    uid: data.uid
  };

  var d = {
    name: data.name
  }

 //data -> name, uid

  collection.findOneAndUpdate( cond,{$set : d}, {upsert:true},function(err,res){
    if(err) throw err;
    callback(true);
  })

}

var updateUserEmail = function(db,callback,data){

  var collection=db.collection("users");

  var cond = {
    uid: data.uid
  };

  var d = {
    email: data.email
  }

 //data -> email, uid

  collection.findOneAndUpdate( cond,{$set : d}, {upsert:true},function(err,res){
    if(err) throw err;
    callback(true);
  })

}

var updateUserPhone = function(db,callback,data){

  var collection=db.collection("users");

  var cond = {
    uid: data.uid
  };

  var d = {
    phone: data.phone
  }

 //data -> phone, uid

  collection.findOneAndUpdate( cond,{$set : d}, {upsert:true},function(err,res){
    if(err) throw err;
    callback(true);
  })

}

var addCourseRating = function(db,callback,data){
  var collection = db.collection("course_ratings");

  var cond = {
  	uid:data.uid
  }

  var d = {
    uid: data.uid,
    course_id: mongo.ObjectId(data.course_id),
    rating: parseInt(data.rating),
    message: data.message
  }

  collection.update(cond,d,{ upsert : true },function(err,res){
    if(err) {
    	callback({code:"failed",message:err.message});
    } else callback({code:"success",message:"rating added successfully"});
  });

}

var addBlogRating = function(db,callback,data){
  var collection = db.collection("blog_ratings");

  var cond = {
    uid:data.uid
  };

  var d = {
    uid: data.uid,
    blog_id: mongo.ObjectId(data.blog_id),
    rating: parseInt(data.rating),
    message: data.message
  }

  collection.update(cond,d,{ upsert : true },function(err,res){
    if(err) {
    	callback({code:"failed",message:err.message});
    } else callback({code:"success",message:"rating added successfully"});
  });

}

var addCourseDiscussion = function(db,callback,data){
 var collection = db.collection("course_discussions");

 var d = {
   course_id: mongo.ObjectId(data.course_id),
   uid: data.uid,
   timestamp: Date.now(),
   message: data.message
 }

 collection.insertOne(d,function(err,res){
   if(err) {
   	callback({code:"failed",message:err.message});
   } else callback({code:"success",message:"discussion added successfully"});
 });

}

var addBlogDiscussion = function(db,callback,data){
  var collection = db.collection("blog_discussions");

  var d = {
   blog_id: mongo.ObjectId(data.blog_id),
   uid: data.uid,
   timestamp: Date.now(),
   message: data.message
 }

 collection.insertOne(d,function(err,res){
   if(err) {
   	callback({code:"failed",message:err.message});
   } else callback({code:"success",message:"discussion added successfully"});
 });

}

var toggleFavorite= function(db, data, callback){
  var collection=db.collection("users");
  var uid= data.uid;
  var courseId=data.courseId;

  collection.findOne({uid:uid}, function(err, doc){
    assert.equal(err,null);

    var exists=false;
    if(doc.favourites){
      doc.favourites.forEach(favorite=>{
        if(favorite==courseId){
          exists=true;
        }
      });
    }

    if(exists){
      collection.findOneAndUpdate({uid:uid},{$pull:{favourites:mongo.ObjectId(courseId)}}, function(err, doc){
        assert.equal(err, null);
        callback(false)
      });
    }else{
      collection.findOneAndUpdate({uid:uid},{$push:{favourites:mongo.ObjectId(courseId)}}, function(err, doc){
        assert.equal(err, null);
        callback(true);
      });
    }
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