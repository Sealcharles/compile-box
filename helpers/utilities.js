
'use strict'

const request = require("unirest");




var Utility = {
    _get: function(baseUrl){

        request({
            url: config.baseUrl,
        }, function(error, response, body){
            resp = JSON.parse(body)
            return resp;
        })
    },

    _post: function(url, param){
        var _req = unirest.post(url)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(param)
        .end(function (response) {
            return response.body
        });
    },

    error:function(data,code){
        return this.handleResponse(data,code,'error');
    },

    success:function(data){
        return this.handleResponse(data,null,'success');
    },

    handleResponse:function(data,code,type){
        var _status = false, _resp = [], _msg = '',_code=200;
        if(type == "error") _status = true;
        if(data.resp) _resp = data.resp;
        if(data.msg) _msg = data.msg;
        if(code) _code = code;

        var response = {'error':_status,
                        'message':_msg,
                        'code':_code,
                        'response':_resp};

        response.code = '';

        return response;
    },
    
    sanitize_http: function(_variables = {}){
        var errors = [];
        if (!_variables.access_key) errors.push()
    }


}

module.exports = Utility;