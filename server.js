var express = require('express');
var app = express();

var sql = require('mssql');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



var connectionstring = "mssql://DB_A16FBA_testingjayani_admin:assass123@SQL5034.SmarterASP.NET/DB_A16FBA_testingjayani";



app.get('/getvehicleno', function(req,res){

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


app.post('/getinvoices', function(req,res){
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



app.post('/getinvoice', function(req,res){


var invoiceid = req.body.id;
console.log("invoice ID : " + invoiceid);
	sql.connect(connectionstring).then(function(){


		new sql.Request().query("Select * from Invoice_Tbl INNER JOIN Customer_Tbl on  Invoice_Tbl.NIC =  Customer_Tbl.NIC  INNER JOIN  Invoice_Product_Tbl on  Invoice_Product_Tbl.Invoice_No = Invoice_Tbl.Invoice_No where Invoice_Tbl.Invoice_No = '"+invoiceid+"'").then(function(result){
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
















	



app.listen(3000);

console.log("api is runing on port 3000");
