 var express = require('express');
var router = express.Router();
var APIClient = require("APIClient.js");
var client = new APIClient();
var parseUrl=reuquire("url").parse;
var formatUrl =require("url").format;

//扩展
//检查第三方用户是否登陆,第三方
function ensureLogin(req,res,next){
	//检测三方是否登录
	//如果未登录，跳转登页面
	//否则
	req.loginUserId="";
	next();
}
//get获得请求页面，并且将用户信息和应用信息存入浏览器中
router.get("/OAuth2/authorize",ensureLogin,checkAuthorizeParams,function(req,res,next){
	res.locals.loginUserId=req.loginUserId;
    res.locals.appInfo =req.appInfo;
    res.render("authorize");
});

//post请求在用户点击确认授权时，此过程产生authorization——code并且嵌入
router.post("/OAuth2/authorize",ensureLogin,checkAuthorizeParams,function(req,res,next){
    //生成authorize_code
    generateAuthoriaztionCode(req.loginUserId,req.query.client_id,req.query.redirect_uri,function(err,ret){
    	if(err){return next(err);}
    	//加工跳转至原来的页面
    	res.redirect(addQueryParamsToUrl(req.query.redirect_uri,{
    		code:ret
    	}));
    });
});

//接口OAuth/access_token:请求用户授权Token
router.post("OAuth2/access_token",function(req,res,next){  
    //获得各个参数，req.body优先级大于params并且检查
     var clientId = req.body.client_id ||req.qurey.client_id;
     var clientSecret =req.body.client_secret || req.query.client_secret;
     var redirectUrl =req.body.client_uri ||req.body.clent_uri;
     var code =req.body.code ||req.body.code;
     if(!clientId)return next(missingParameterError(clientId));
     if(!clientSecret)return next(missingParameterError(clientSecret));
     if(!redirectUrl)return next(missingParameterError(redirectUrl));
     if(!code)return next(missingParameterError(code));
    //校验各个参数
    verifyAuthorizationCode(code,clientId,clientSecret,redirectUrl,function(err,userId){
        if(err)return next(err);
        //生成accessToken
        generateAccessTokenCode(userId,client_id,function(err,accessToken){
            if(err)return next(err);
            //删除旧的auth
        });
    });
    
    //获取accessToken返回,其中authorize_code要失效，且将Token进行时间限定，exp.但是返回给谁？有些问题？
   

});


//接受authorization_code
router.get("/auth/callback",function(req,res,next){
    client.requestAccessToken(req.query.code,function(err,ret){
        if(err) return next(err);
        res.end("获取授权success");
    });

});


module.exports = router;

//methods
//生成唯一的authoriztion_code
function generateAuthoriaztionCode(usserId,appkey,redirectUrl,cb){
      //生成code随机字符串
      var code = randomString(20,"hjw");
      //将参数存储进数据库
      cb(null,code);
}
function randomString(size,chars){
   size=size || 6;
   chars =chars ||"haisshihjwhahahahaha";
   var newcode="";
   while(size>0){
    newcode += newcode.charAt(Math.floor(Math.random()*chars.length+1));
    newcode--；
   }
    return newcode;
}

//添加callback地址,以及authorizition_code
function addQueryParamsToUrl(url,params){
    var info =parseUrl(url,true);
    for( var i in params){
        info.query[i]=params[i];
    }
    delete info.serarch;
    return formmatUrl(info);
};



//错误生成以及处理
//创建统一错误对象
function createError(code,mes){
 var  err = new Error(msg);
 err.error_code=code;
 err.error_message=mes;
 return err;
  
} 
 
function apiErrorHandler(err,req,res,next){
    if(typeof res.apierror==="function"){
       return  res.apierror(err);
    }
  next();
}

//校验请求params
function missingParameterError(name){
   return createApiError("missingParameter","缺少参数=="+name+"/");
};
//校验回掉地址
function redirectUriNotMatchError(url){
   return createApiError("redirect Uri not match Error","回掉地址不对=="+url+"/");
}
//检查authoparams
function checkAuthorizeParams(req,res,next){
    //检查参数
    var clientId = req.body.client_id ||req.qurey.client_id;
    var redirectUrl =req.body.client_uri ||req.body.clent_uri;
    if(!clientId)return next(missingParameterError(clientId));
    if(!redirectUrl)return next(missingParameterError(redirectUrl));
    //验证client_id并且查询应用的详细信息
    getAppInfo(clientId,function(err,ret){
        if(err)return next(err);
        req.appInfo=ret;
        //验证回掉地址是不是符合规则 
        verifAppRedirectUri(req.query.client_id,req.query.redirect_uri,function(err,ok){
            if(err)next(err);
            if(!ok){return next(redirectUriNotMatchError(req.query.redirect_uri););}
            next();
        });
    });
}

