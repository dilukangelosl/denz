var express = require('express');
var app = express();

var sql = require('mssql');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


var connectionstring = "mssql://DB_A16FBA_testingjayani_admin:assass123@SQL5034.SmarterASP.NET/DB_A16FBA_testingjayani";


app.get('/', function(req,res){

res.send("API V2");

})


app.get('/api/getvehicleno', function(req,res){

	sql.connect(connectionstring).then(function(){

		new sql.Request().query("select * from Vehicle_Tbl where Status = 'active' ").then(function(result){

			var obj = {
				status:200,
				result:result
			}
			res.send(obj);
		}).catch(function(er){
			var obj ={
				status:400,
				result:er
			}
		})

	}).catch(function(err){
				var obj = {
					status:500,
					result:err
				}
				res.send(obj)
	})
});


app.get('/api/auth', function(req,res){

	sql.connect(connectionstring).then(function(){

		new sql.Request().query("select * from mobileauth").then(function(result){

			var obj = {
				status:200,
				result:result
			}
			res.send(obj);
		}).catch(function(er){
			var obj ={
				status:400,
				result:er
			}
		})

	}).catch(function(err){
				var obj = {
					status:500,
					result:err
				}
				res.send(obj)
	})
});





app.get('/api/getallinvoices', function(req,res){

		sql.connect(connectionstring).then(function(){

			var query = "Select * from Transport_Details_Tbl ";
			new sql.Request().query(query).then(function(result){

					var obj = {
				status:200,
				result:result
			}
			res.send(obj);
			}).catch(function(er){

					var obj = {
					status:500,
					result:er
				}
				res.send(obj)
			})

		}).catch(function(err){

			//sql connection error
			var obj = {
					status:500,
					result:err
				}
				res.send(obj)
		})

})


app.post('/api/getinvoices', function(req,res){
 var vehicleNo =  req.body.id;
  console.log(req.body);
	sql.connect(connectionstring).then(function(){


  new sql.Request().query("Select * from Transport_Details_Tbl where End_Milage = 'Pending' and Vehicle_No  =  '"+vehicleNo+"' ").then(function(result){



		var obj = {
				status:200,
				result:result
			}
			res.send(obj);

     }).catch(function(er){
     	var obj = {
					status:500,
					result:er
				}
				res.send(obj)
     })


	}).catch(function(err){
				
				var obj = {
					status:500,
					result:err
				}
				res.send(obj)

	  })
    })



app.post('/api/invoicesearch', function(req,res){
 var search =  req.body.search;
  console.log(req.body);
	sql.connect(connectionstring).then(function(){


  new sql.Request().query("Select * from Transport_Details_Tbl where Invoice_No  LIKE '"+search+"%'  ").then(function(result){



		var obj = {
				status:200,
				result:result
			}
			res.send(obj);

     }).catch(function(er){
     	var obj = {
					status:500,
					result:er
				}
				res.send(obj)
     })


	}).catch(function(err){
				
				var obj = {
					status:500,
					result:err
				}
				res.send(obj)

	  })
    })




app.post('/api/getinvoice', function(req,res){


var invoiceid = req.body.id;
console.log("invoice ID : " + invoiceid);
	sql.connect(connectionstring).then(function(){


		new sql.Request().query("Select * from Invoice_Tbl INNER JOIN Customer_Tbl on  Invoice_Tbl.NIC =  Customer_Tbl.NIC  INNER JOIN  Invoice_Product_Tbl on  Invoice_Product_Tbl.Invoice_No = Invoice_Tbl.Invoice_No INNER JOIN Product_Tbl on Invoice_Product_Tbl.Pcode = Product_Tbl.P_Code where Invoice_Tbl.Invoice_No = '"+invoiceid+"'").then(function(result){
				var obj = {
				status:200,
				result:result
			}
			res.send(obj);
		}).catch(function(err){
			res.send({
			status:400,
			result:err
		})
		})



	}).catch(function(err){
		res.send({
			status:500,
			result:err
		})
	})

})


app.post('/api/finishtransport', function(req,res){

var invoiceid = req.body.invoiceid;
//var productCode = req.body.productCode;


//Customer

var endmilage = req.body.endmilage;
var charges = req.body.charges;
var discount = req.body.discount;
var paidamount = req.body.paidamount;



	sql.connect(connectionstring).then(function(){

			var query = "Update Transport_Details_Tbl set  End_Milage = '"+endmilage+"' , Charges  = '"+charges+"' , Discount = '"+discount+"' , Paid_Amount = '"+paidamount+"'  where 	Invoice_No = '"+invoiceid+"' ";

			console.log(query);
			new sql.Request().query(query).then(function(result){


			var obj = {
				status:200,
				result:result
			}
			res.send(obj);


			}).catch(function(er){
				res.send({
			status:400,
			result:er
		})
			})



	}).catch(function(err){
		res.send({
			status:500,
			result:err
		})
	})

})



app.post('/api/finishproduct', function(req,res){

var pno = req.body.productcode;
var status = req.body.status;
var invoiceno =req.body.invoiceno;
//var productCode = req.body.productCode;


//Customer



	sql.connect(connectionstring).then(function(result){

			var query = "Update Invoice_Product_Tbl set  Tr_Status = '"+status+"' where PNo = '"+pno+"' and Invoice_No = '"+invoiceno+"' ";
			console.log(query);
			new sql.Request().query(query).then(function(){


			var obj = {
				status:200,
				result:result
			}
			res.send(obj);


			}).catch(function(er){
				res.send({
			status:400,
			result:er
		})
			})



	}).catch(function(err){
		res.send({
			status:500,
			result:err
		})
	})

})



app.post('/api/finishinvoice', function(req,res){

var invoiceno = req.body.invoiceno;
var status = req.body.status;
//var productCode = req.body.productCode;


//Customer



	sql.connect(connectionstring).then(function(result){

			var query = "Update Invoice_Tbl set  Delivery_Status = '"+status+"' where Invoice_No = '"+invoiceno+"' ";
			console.log(query);
			new sql.Request().query(query).then(function(){


			var obj = {
				status:200,
				result:result
			}
			res.send(obj);


			}).catch(function(er){
				res.send({
			status:400,
			result:er
		})
			})



	}).catch(function(err){
		res.send({
			status:500,
			result:err
		})
	})

})


app.post('/api/viewlocation', function(req,res){

var delid = req.body.delid;

//var productCode = req.body.productCode;


//Customer



	sql.connect(connectionstring).then(function(){

			var query = "select * from location_Tbl where delId = '"+delid+"' ";
			console.log("select * from location_Tbl where delId = '"+delid+"' ");

			new sql.Request().query(query).then(function(result){


			var obj = {
				status:200,
				result:result
			}
			res.send(obj);


			}).catch(function(er){
				res.send({
			status:400,
			result:er
		})
			})



	}).catch(function(err){
		res.send({
			status:500,
			result:err
		})
	})

})



app.post('/api/addlocation', function(req,res){

var delid = req.body.delid;
var lat  = req.body.lat;
var lng = req.body.lng;

//var productCode = req.body.productCode;


//Customer



	sql.connect(connectionstring).then(function(){

			var query = "Insert Into location_Tbl(delid,lat,lng) VALUES('"+delid+"' , '"+lat+"' , '"+lng+"') ";
			console.log(query);
			new sql.Request().query(query).then(function(result){


			var obj = {
				status:200,
				result:result
			}
			res.send(obj);


			}).catch(function(er){
				res.send({
			status:400,
			result:er
		})
			})



	}).catch(function(err){
		res.send({
			status:500,
			result:err
		})
	})

})



app.post('/api/updatelocation', function(req,res){

var delid = req.body.delid;
var lat  = req.body.lat;
var lng = req.body.lng;

//var productCode = req.body.productCode;


//Customer



	sql.connect(connectionstring).then(function(){

			var query = "Update location_Tbl Set lat = '"+lat+"', lng ='"+lng+"' where delId = '"+delid+"' ";
			console.log(query);
			new sql.Request().query(query).then(function(result){


			var obj = {
				status:200,
				result:result
			}
			res.send(obj);


			}).catch(function(er){
				res.send({
			status:400,
			result:er
		})
			})



	}).catch(function(err){
		res.send({
			status:500,
			result:err
		})
	})

})


app.post('/api/updatecurrentlocation', function(req,res){

var id = req.body.id;
var lat  = req.body.lat;
var lng = req.body.lng;
var lng = req.body.time;

//var productCode = req.body.productCode;


//Customer



	sql.connect(connectionstring).then(function(){

			var query = "Update currentlocation_Tbl Set lat = '"+lat+"', lng ='"+lng+"' , timestamp ='"+time+"'where vehicleno = '"+id+"' ";
			console.log(query);
			new sql.Request().query(query).then(function(result){


			var obj = {
				status:200,
				result:result
			}
			res.send(obj);


			}).catch(function(er){
				res.send({
			status:400,
			result:er
		})
			})



	}).catch(function(err){
		res.send({
			status:500,
			result:err
		})
	})

})



app.post('/api/addcurrentlocation', function(req,res){

var vehicleid = req.body.id;
var lat  = req.body.lat;
var lng = req.body.lng;
var time = req.body.time;

//var productCode = req.body.productCode;


//Customer



	sql.connect(connectionstring).then(function(){

			var query = "Insert Into currentlocation_Tbl(vehicleno,lat,lng,timestamp) VALUES('"+id+"' , '"+lat+"' , '"+lng+"', '"+time+"') ";	console.log(query);
			new sql.Request().query(query).then(function(result){


			var obj = {
				status:200,
				result:result
			}
			res.send(obj);


			}).catch(function(er){
				res.send({
			status:400,
			result:er
		})
			})



	}).catch(function(err){
		res.send({
			status:500,
			result:err
		})
	})

})







	



app.listen(3000);

console.log("api is runing on port 3000");
