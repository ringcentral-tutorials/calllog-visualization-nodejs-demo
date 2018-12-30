var RC = require('ringcentral')
require('dotenv').load()

var rcsdk = null
if (process.env.ENVIRONMENT_MODE == "production"){
  rcsdk = new RC({
    server:RC.server.production,
    appKey: process.env.CLIENT_ID_PROD,
    appSecret:process.env.CLIENT_SECRET_PROD,
  })
}else{
  rcsdk = new RC({
      server:RC.server.sandbox,
      appKey: process.env.CLIENT_ID_SB,
      appSecret:process.env.CLIENT_SECRET_SB
    })
}

var platform = rcsdk.platform()

var engine = module.exports = {
    login: function(req, res){
      var un = ""
      var pwd = ""
      if (process.env.ENVIRONMENT_MODE == "production"){
        un= process.env.USERNAME_PROD
        pwd= process.env.PASSWORD_PROD
      }else{
        un= process.env.USERNAME_SB
        pwd= process.env.PASSWORD_SB
      }

      platform.login({
        username:un,
        password:pwd
      })
      .then(function(resp){
        engine.readCallLogs(req, res)
      })
      .catch(function(e){
        var errorRes = {}
        errorRes['calllog_error'] = "Cannot login."
        res.send(JSON.stringify(errorRes))
      })
    },
    readCallLogs(req, res){
      var endpoint = "/account/~/extension/~/call-log"
      if (req.query.access == "account")
        endpoint = "/account/~/call-log"

      platform.get(endpoint, req.body)
      .then(function(resp){
        var json = resp.json()
        res.send(JSON.stringify(json.records))
      })
      .catch(function(e){
        var errorRes = {}
        var err = e.toString();
        if (err.includes("ReadCompanyCallLog")){
          errorRes['calllog_error'] = "You do not have admin role to access account level. You can choose the extension access level."
          res.send(JSON.stringify(errorRes))
        }else{
          errorRes['calllog_error'] = "Cannot access call log."
          res.send(JSON.stringify(errorRes))
        }
        console.log(err)
      })
    }
}
