/**********************************
** Gerald Wilson
** 8/13/2017
** CS 340 Database interactions and UI
****************************************/

//node module set up, port set up, etc
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 31108);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static("public"));


//Create or reset exercise table in database
//Code given by OSU CS 290 instructor as part of assignment
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ 
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('display',context);
    })
  });
});


//Get all data from workouts db table
app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
	/*
	row_data = {};
    row_data.workouts = [];
    for (row in rows) {
        workout = {};

        workout.id      = rows[row].id;
        workout.name    = rows[row].name;
        workout.reps    = rows[row].reps;
        workout.weight  = rows[row].weight;
        workout.date    = rows[row].date;
        workout.lbs     = rows[row].lbs;

        row_data.workouts.push(workout);
    }
	*/
    context.results = rows;
    //context.data = row_data;
    res.render('display', context);
  });
});


//Insert new row into db table
app.get('/insert',function(req,res,next){
	var context = {};
	mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
		if(err){
		  next(err);
		  return;
		}
		context.inserted = result.insertId;
		res.send(JSON.stringify(context));
	});
});


//Delete selected row from db table, then display updated table
app.get('/delete',function(req, res,next){
	var context = {};
	mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
		if(err){
		  next(err);
		  return;
		}
	});
});


app.get('/updateGet',function(req, res,next){
	var context = {};
	mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, rows, fields){
		if(err){
		  next(err);
		  return;
		}
		var param = [];

            for(var row in rows){                           
                var addItem = {'name': rows[row].name, 
                            'reps': rows[row].reps, 
                            'weight': rows[row].weight, 
                            'date':rows[row].date, 
                            'lbs':rows[row].lbs,
                            'id':rows[row].id};

                param.push(addItem);
            }
    context.results = param[0];
    res.render('updateWorkout', context);
	});
});
    

app.get('/updateReturn', function(req, res, next){
	var context = {};
    mysql.pool.query("SELECT * FROM `workouts` WHERE id=?", [req.query.id], function(err, result){
		if(err){
		  next(err);
		  return;
		}
		if(result.length == 1){
			
			if(req.query.lbs === "on"){
                    req.query.lbs = "1";
                }
                else{
                    req.query.lbs = "0";
                }
				
			mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, lbs=?, date=? WHERE id=? ",
			[req.query.name, req.query.reps, req.query.weight, req.query.lbs, req.query.date, req.query.id],
			function(err, result){
				if(err){
					next(err);
					return;
				}
				var context = {};
				mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
					if(err){
						next(err);
						return;
					}
					context.results = rows;
					res.render('display', context);
				});
            });
		}
	});
});
	
	
	
//Error handlers
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

