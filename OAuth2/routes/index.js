 var express = require('express');
var router = express.Router();


//扩展
//检查第三方用户是否登陆,第三方
function ensureLogin(req,res,next){
	//检测三方是否登录
	//如果未登录，跳转登页面
	//否则
	req.loginUserId="";
	next();
}
router.get("/OAuth2/authorize",ensureLogin,checkAuthorizeParams,function(req,res,next){
	res.locals.loginUserId=req.loginUserId;
    res.locals.appInfo =req.appInfo;
    res.render("authorize");
});
router.get("/OAuth2/authorize",ensureLogin,checkAuthorizeParams,function(req,res,next){
    //生成authorize_code
    generateAuthoriaztionCode(req.loginUserId,req.query.client_id,req.query.redirect_uri,function(err,ret){
    	if(err){return next(err);}
    	//加工跳转至原来的页面
    	res.redirect(addQueryParamsToUrl(req.query.redirect_uri,{
    		code:ret
    	}));
    });
});

module.exports = router;
