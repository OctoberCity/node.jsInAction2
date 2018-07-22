var request=require("request");
function APIClient(options){
  this._appkey =options.appkey;
  this._appscret =options.appscret;
  this._callbackUrl =option.callbackUrl;
}


//定义请求API地址
var API_url="";
var API_AOUTH2_AUTHORIZE=API_url+"OAuth2/authorize";
var API_AOUTH2_ACCESS_TOKEN=API_url+"OAuth2/access_token";

APIClient.prototype.getRedirectUrl = function(){
	return  addQueryParamsToUrl(API_AOUTH2_AUTHORIZE,{
		client_id:this._appkey,
		redirect_url:this._callbackUrl
	}); 
}


//发送请求
APIClient.prototype._request= function(method,url,params,callback){

}
//获取ACCess_token
APIClient.prototype.requestAccessToken = function(code,callback){
	//code是authorize_code
}