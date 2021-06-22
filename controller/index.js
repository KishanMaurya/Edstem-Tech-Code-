const apiController = require("../utility/apiController");
const bcrypt = require("bcrypt")
const { promisifyQueries } = require("../lib/helper");
const jwt= require("jsonwebtoken")
const { db } = require('../connection');
const SECRET_KEY ="jiuydewhdhuyy823343r4r4ff"


class Edstem {
  
  //add register 
  async addRegister(register) {
    try {
      var created_at = new Date();  
      var check_sql = `select id, email  from register where email = '${register.email}' AND id = '${register.id}' `;
      var check_data = await promisifyQueries(check_sql);
      if (check_data.length > 0) {
        return apiController.respondBad("Duplicate email ");
      }
      if(register.password !== register.cnf_password) {
        return apiController.respondBad("try agian password does not match");
      }
      //password hashed
      var password=await bcrypt.hash(register.password, 10)
      var params = [
            [
              register.fname,
              register.lname,
              register.email, 
              password,
              created_at
            ]
        ];
      var sql = `insert into register (fname,lname,email,password,created_at) values ?`;
      var data = await promisifyQueries(sql, [params]);
      return apiController.respondPost(data);
    } catch (err) {
      return apiController.respondBad(err);
    }
  }
//login with register users
async LoginFunc(login) {
  try {
    var check_sql = `select email , password  from register where email = '${login.email}' AND id = '${login.id}' `;
    var check_data = await promisifyQueries(check_sql);
    if (check_data.length > 0) {
      return apiController.respondBad("Duplicate items email and contact");
    }
    let sql=`select * from register where email=${login.email}`;
    let query=db.query(sql, async(err, result) => {
      if (err)  throw err;
      if(result.length == 0){
        res.send(JSON.stringify({"status":404, "error":"Not user with that email", "token":null }));
        return ;
      }
      var valid =  bcrypt.compare(login.password,result[0].password);
      if(valid){
        res.send(JSON.stringify({"status":404, "error":"Incorrect email", "token":null }));
        return;
      }
      const token = jwt.sign({
        user: _.pick(result[0], ['id', 'email']),
      },SECRET_KEY,{
        expiresIn: '5m'
      })
      res.send(JSON.stringify({"status":200, "error":null, "token":token }));
    })
    
    
  } catch (err) {
    return apiController.respondBad(err);
  }
}


  async getRegisterUser(register) {
    //get details by paginaion 0 upto 10 par page 
    try {
      let skip = register.skip || 0;
      let limit = register.limit || 10;
      var query = `select id, fname, lname, email, password ,created_at, updated_at from register`;
      var countquery = `select count(id) as totalCount from register`;
      var totalCount = await promisifyQueries(countquery);
      query += ` order by id DESC `;
      query += `LIMIT ${skip}, ${limit}`;
      var data = await promisifyQueries(query);
      let contactRes = {
        total_count: totalCount[0].totalCount,
        data: data,
      };
      return apiController.respondGet(contactRes);
    } catch (err) {
      return apiController.respondBad(err);
    }
  }


  }


module.exports = new Edstem();
