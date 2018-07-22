function extendAPIOutPut(req,res,next){
	//根据请求头来输出指定数据格式
	res.apiSuccess=function(data){
           output({
           	status:"ok",
           	result:data
           });
	}
	res.apiError=function(err){
          output({
          	status:"error",
          	error_code:err.error_code|| "unknow",
          	errror_message:err.error_message || err.toString();
          });
	}
	function output(data){
		var type =req.accepts({"json","xml"});
		switch(type){
			case "xml":
			return res.xml(data);
			default :
			return res.json(json); 

		}
	}
	next();
}

module.exports = extendAPIOutPut;
