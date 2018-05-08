'use strict'
var config = {
    "api":{
        "_url":"api",
        "_version":"/1.0",
        "_port":process.env.API_PORT,
        "app_name": "CompileBox Sandbox",
        "app_base": "/"
    },
    "containers": {
        "lamp": {
            "user_id": "",
            "language": "lamp",
            "mode_mvc": "",
            "port_w": "",
            "port_api": "",
            "port_ssh": "",
            "port_mongo": "",
            "initial_code": "",
            "right_answer": "",
            "ex_id": ""
        },
        "nodejs": {
            "user_id": "",
            "language": "nodejs",
            "mode_mvc": "",
            "port_w": "",
            "port_api": "",
            "port_ssh": "",
            "port_mongo": "",
            "initial_code": "",
            "right_answer": "",
            "ex_id": ""
        },
        "laravel": {
            "user_id": "",
            "language": "laravel",
            "mode_mvc": "",
            "port_w": "",
            "port_api": "",
            "port_ssh": "",
            "port_mongo": "",
            "initial_code": "",
            "right_answer": "",
            "ex_id": ""
        },
        "react": {
            "user_id": "",
            "language": "reactbox",
            "mode_mvc": "",
            "port_w": "",
            "port_api": "",
            "port_ssh": "",
            "port_mongo": "",
            "initial_code": "",
            "right_answer": "",
            "ex_id": ""

        }
    }
}

module.exports = config;