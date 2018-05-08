
const dotenv = require("dotenv").config();
const _config = require('./config/config.js');
const restify = require('restify');
const fs = require('fs');
const shell = require('shelljs');
const https = require('https');
const path = require('path');
const unirest = require('unirest');
const Resp = require("./helpers/utilities");
const logger = require("logger").createLogger();
const crypto = require('crypto');


const api_url = _config.api.app_base+_config.api._url+_config.api._version;

const server = restify.createServer({
    name: _config.api.app_name,
    version: _config.app_version
}); 
server.pre(restify.pre.sanitizePath());

/**
 * 
 * @param {*} res 
 * @param {*} data 
 * 
 * const resp = function(res,data){
    res.header("Access-Control-Allow-Origin", "*");
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify(data))
};
 */


server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({mapParams: true}));
server.use(restify.plugins.bodyParser({mapParams: true}));


server.listen(_config.api._port, function () {
    logger.info('%s listening at %s', server.name, server.url+api_url);
});


server.get(api_url+"/compile-box", function (req, res) {
    return res.send(Resp.success({msg:"Welcome to compilebox ", resp: "ok"}));
})


server.post(api_url+"/user_request", (req, res) => {
    
    var params = req.body;
    var user_id = params.user_id;
    var language = params.language;
    var mode_mvc = params.mode_mvc;
    var port_web = params.port_web;
    var port_tree = params.port_tree;
    var port_ssh = params.port_ssh;
    var port_mongo = params.port_mongo;
    var initial_code = params.initial_code;
    var right_answer = params.right_answer;
    var image_name = params.image_name;
    var ex_id = params.ex_id;  
    var app_path = params.app_path; 
    var volume_path = params.volume_path            
    var _volumes_path = path.join(path.dirname(fs.realpathSync(__filename)), volume_path);
    var _app_path = path.join(path.dirname(fs.realpathSync(__filename)), app_path);
    var error = [];




    if (user_id == '') error.push("Please insert user id");
    if (language == '') error.push("Please insert container name");
    if (mode_mvc == '') error.push("Please insert mode_mvc");
    if (port_web == '') error.push("Please insert port_w id");
    if (port_tree == '') error.push("Please insert port_api id");
    if (port_ssh == '') error.push("Please insert port_ssh id");
    if (port_mongo == '') error.push("Please insert port_mongo id");
    if (image_name == "")error.push("Please insert image name or set to default")


    if (params && params != "undefined"){
        if (error.length == 0){
            var user_volume = container_name = volume_name = user_id+ex_id;
            var host_volumes = [], host_containers = [];
            var publish_web = port_web+':80', publish_tree = port_tree+':3000', publish_mongo = port_mongo+':27017', publish_ssh = port_ssh+':22';
            var publish_param = '-p '+publish_web+' -p '+publish_tree+' -p '+publish_mongo+' -p '+publish_ssh;
            var getVolumes = JSON.parse(shell.exec("curl --unix-socket /var/run/docker.sock http:/v1.24/volumes")).Volumes;
            var getContainers = JSON.parse(shell.exec("curl --unix-socket /var/run/docker.sock http:/v1.24/containers/json"));


            switch (mode_mvc) {
                case "stop":
                    if (initial_code === "no" && right_answer == "no"){
                        container_name = container_name+"no"+"yes";
                        shell.exec('docker stop ' + container_name + ' && docker rm ' +container_name);
                        logger.info("Container tag with " + container_name  + "Stopped and Destroyed ");
                        logger.info("Starting New Container");
                        shell.exec('docker run -d --name '+ container_name + ' -v '+container_name+":/var/www/localhost/htdocs/  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name);
                        logger.info("Container Copied " + shell.exec('docker cp '+ _app_path + container_name+':/var/www/localhost/htdocs '));
                        // return res.send("Destroyed container, Created New Container and Mounted Volume " + container_name + " And created a new container with volume "+container_name)
                        return res.send(Resp.success({msg:"Destroyed container, Created New Container and Mounted Volume ", resp: {status: "ok", container_name: container_name, volume_name: volume_name}}));
                    } else {
                        return res.send(Resp.error({msg: "Nothing to do!!! ", resp: "Stop action only runs when inital_code and right_answer is no"}));
                    }
                break;
    
               
                case "start":
                    if (initial_code == "yes" && right_answer === "no"){
                        container_name = container_name+"yes"+"no";
                        user_volume = container_name; 
                        
                        // if using volume mount
                        //docker run -d -p 9000:80 --name lamp-test1 --mount type=volume,source=01100yes,destination=/Users/adedayoakinpelu/Documents/compile-box/apps/ -e MYSQL_ROOT_PASSWORD=qwerty  milenium1/alpine-lamp

                        if (getVolumes == null || getVolumes == ""){
                            logger.info("No volume found in host, creating fresh volume...");
                            // var exec_query = 'docker run -d '+publish_param + ' --name '+ container_name + ' --mount type=volume,source='+container_name+',destination='+_app_path+container_name+' -e MYSQL_ROOT_PASSWORD=qwerty '+ image_name;
                            var exec_query = 'docker run -d --name '+ container_name + ' -v '+_app_path+user_volume+":/var/www/localhost/htdocs/ --name "+user_volume+"  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                            var output =  JSON.stringify(shell.exec(exec_query));
                            return res.send(Resp.success({msg: "No existing container matches search, New container created with id: "+ container_name, resp:{status: "ok", response: output}}));
                        }else{
                            logger.info("Searching for matching volumes...");                           
                            
                            getVolumes.forEach(function(_host_volumes){
                                if (_host_volumes.Name === user_volume)
                                     host_volumes.push(_host_volumes.Name)
                             })
        
                            if (host_volumes[0] === user_volume){
                                // if (host_containers[0] != user_volume){
                                //     var exec_query = 'docker run -d --name '+ container_name + ' -v '+container_name+":/var/www/localhost/htdocs/ --name "+ volume_name +"  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                                //     return res.send("Ex_id does not exists, created a new container with name "+ shell.exec(exec_query));
                                // }
                                var exec_query = 'docker start '+ container_name;
                                var output = shell.exec(output)
                                return res.send(Resp.success({msg: "Container with name "+ container_name + " Found and started, Volume " + host_volumes[0] +" mounted to container " ,resp:{status: "ok", response: output} }));
                            }else{
                                var exec_query = 'docker run -d --name '+ container_name + ' -v '+user_volume+":/var/www/localhost/htdocs/  "+ volume_name +"  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                                var output = shell.exec(exec_query);
                                return res.send(Resp.success({msg: "Ex_id does not exists, created a new container with name ", resp:{status: "ok", response: output}}));
                            }
                        }      
                    }else if (initial_code === "no" && right_answer === "yes"){
                        container_name = container_name+"no"+"yes";
                        // container_name = hash(_container_name.toString());
                        user_volume = container_name; 
                        logger.info("Initial code is no and right answer is yes")
                        if (getVolumes == null || getVolumes == ""){
                            logger.info("No volume found in host, creating volume...")
                            var exec_query = 'docker run -d --name '+ container_name + ' -v '+container_name+":/var/www/localhost/htdocs/  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                            var output =  JSON.stringify(shell.exec(exec_query));
                            return res.send({msg: "No existing container matches search, New container created", resp: {status:"ok", response: output}})
                        }else{
                            logger.info("Searching for matching volumes...");  
                            getVolumes.forEach(function(_host_volumes){
                               console.log(_host_volumes.Name, user_volume)
                               if (_host_volumes.Name === user_volume)
                                    host_volumes.push(_host_volumes.Name)
                            })

                            if (host_volumes[0] === user_volume){ 
                                var exec_query = 'docker run -d --name '+ container_name + ' -v '+container_name+":/var/www/localhost/htdocs/ " +"  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                                shell.exec(exec_query)
                                var output = shell.exec('docker start '+ container_name)
                                return res.send({msg: "Container with name "+ container_name + " Found and started, Volume " + host_volumes[0] +" mounted to container", resp: output})
                            }else{
                                var exec_query = 'docker run -d --name '+ container_name + ' -v '+container_name+":/var/www/localhost/htdocs/ " +"  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                                var output = shell.exec(exec_query);
                                return res.send({msg: "Ex_id does not exists, created a new container with name", resp: {status: "ok", response: output}})
                            }
                        }      
                    }else if (initial_code === "no" && right_answer === "no"){
                        logger.info("Initial code is no and right answer is no")
                        container_name = container_name+"yes"+"no";
                        // container_name = hash(_container_name.toString());
                        user_volume = container_name;

                        if (getVolumes == null || getVolumes == ""){
                            logger.info("No volume found in host, creating volume...")
                            var exec_query = 'docker run -d --name '+ container_name + ' -v '+container_name+":/var/www/localhost/htdocs/  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                            var output =  JSON.stringify(shell.exec(exec_query));
                            return res.send({msg: "No existing container matches search, New container created with id", resp: {status: "ok", response: outpiut}})
                        }else{
                            logger.info("Searching for matching volumes...");                           
                            getVolumes.forEach(function(_host_volumes){
                                if (_host_volumes.Name === user_volume)
                                     host_volumes.push(_host_volumes.Name)
                             })
                            //  getContainers.forEach(function(_host_containers){
                            //     if (_host_containers.Name === user_volume)
                            //         host_containers.push(_host_containers.Name)
                            // })
        
                            if (host_volumes[0] === user_volume){
                                shell.exec('docker cp '+_app_path+' '+container_name+':/var/www/localhost/htdocs')
                                var output = shell.exec('docker restart '+ container_name);
                                return res.send({msg:"Container with name "+ container_name + " Found, copied to htdocs folder and started, Volume " + host_volumes[0] +" mounted to container ", resp: {status: "ok", response: output}})
                            }else{
                                var exec_query = 'docker run -d --name '+ container_name + ' -v '+container_name+":/var/www/localhost/htdocs/ --name "+ host_volumes[0] +"  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                                var output = shell.exec(exec_query)
                                return res.send({msg: "Ex_id does not exists, created a new container with name", resp: {status: "ok", response: output}})
                            }
                        }      
                    }else {
                        _container_name = container_name+initial_code+right_answer;
                        container_name = hash(_container_name.toString());
                        user_volume = container_name;
                        if (getVolumes == null || getVolumes == ""){
                            var exec_query = 'docker run -d --name '+ container_name + ' -v '+container_name+":/var/www/localhost/htdocs/  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                            var output =  JSON.stringify(shell.exec(exec_query));
                            return res.send(output);
                        }else{
                            getVolumes.forEach(function(_host_volumes){
                                host_volumes.push(_host_volumes.Name);     
                            })
                            getContainers.forEach(function(_host_containers){
                                host_containers.push(_host_containers.Name)
                            })
                            var _find_volume = host_volumes.indexOf(volume_name);
                            var host_volume = host_volumes[_find_volume];
                            
                            if (host_volume === user_volume){
                                return res.send("Copying content from volume to container " + shell.exec('docker cp '+container_name+' '+container_name+':/var/www/volumes'));
                            }else{
                                return res.send("Volume does not exists, Set mvc_mode to start to create container and volume with ex_id");
                            }
                        }    
                    }

                    
                break;
                case "edit_container":
                    if (initial_code === "yes"){
                        _container_name = container_name+initial_code+right_answer;
                        container_name = hash(_container_name.toString());
                        user_volume = container_name;
                        if (getVolumes == null || getVolumes == ""){
                            var exec_query = 'docker run -d --name '+ container_name + ' -v '+container_name+":/var/www/localhost/htdocs/  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                            var output =  JSON.stringify(shell.exec(exec_query));
                            return res.send(output);
                        }else{
                            getVolumes.forEach(function(_host_volumes){
                                host_volumes.push(_host_volumes.Name);     
                            })
                            var _find_volume = host_volumes.indexOf(volume_name);
                            var host_volume = host_volumes[_find_volume];
        
                            if (host_volume === user_volume){
                                return res.send("Copying content from volume to container " + shell.exec('docker cp '+container_name+' '+container_name+':/var/www/volumes'));
                            }else{
                                return res.send("Volume does not exists, Set mvc_mode to start to create container and volume with ex_id");
                            }
                        }    
                    }

                    if (right_answer === "yes"){
                        _container_name = container_name+initial_code+right_answer;
                        container_name = hash(_container_name.toString());
                        user_volume = container_name;
                        if (getVolumes == null || getVolumes == ""){
                            var exec_query = 'docker run -d --name '+ container_name + ' -v '+container_name+":/var/www/localhost/htdocs/  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                            var output =  JSON.stringify(shell.exec(exec_query));
                            return res.send(output);
                        }else{
                            getVolumes.forEach(function(_host_volumes){
                                host_volumes.push(_host_volumes.Name);     
                            })
                            var _find_volume = host_volumes.indexOf(volume_name);
                            var host_volume = host_volumes[_find_volume];

                            if (host_volume === user_volume){
                                return res.send("Container started Volume with ex_id "+ ex_id + " Found, Volume " + host_volume +" mounted to container " + shell.exec('docker start '+ container_name));
                            }else{
                                var exec_query = 'docker run -d --name '+ container_name + ' -v '+container_name+":/var/www/localhost/htdocs/ --name "+ volume_name +"  -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                                return res.send("Ex_id does not exists, created a new container with name "+ shell.exec(exec_query));
                            }
                        }
                    }

                    
                break;
                case "run":
                    var image_name = params.image_name;
                    var volume_name = language+user_id+'_'+ex_id;
                    var container_name = language+'-'+user_id;
                    var publish_web = port_web+':80';
                    var publish_tree = port_tree+':3000';
                    var publish_mongo = port_mongo+':27017';
                    var publish_ssh = port_ssh+':22';
                    var publish_param = '-p '+publish_web+' -p '+publish_tree+' -p '+publish_mongo+' -p '+publish_ssh;
                    var exec_query = 'docker run -d --name '+ container_name + ' -v '+_app_path+":/var/www/localhost/htdocs/ -e MYSQL_ROOT_PASSWORD=qwerty  "+publish_param + " " + image_name;
                    console.log(exec_query);
                    return res.send("Running Container "  + shell.exec(exec_query))                    
                    // return res.send("Running Container " + shell.exec('docker run -d --name  '+ container_name +  ' -p ' + publish + ' --mount source='+volume_name + ',target='+volume_path  + ' ' +image_name));
                break;
                default:
                    return res.send("Unidentified mvc_mode");
                break;
            }
        }else
            return res.send(error)
    }else{
        return res.send("Input paramters not set");
    }
})

server.post(api_url+"/delete_container", (req, res) => {
    
    var params = req.body;
    var user_id = params.user_id;
    var language = params.language;
    var mode_mvc = params.mode_mvc;
    var port_w = params.port_w;
    var port_api = params.port_api;
    var port_ssh = params.port_ssh;
    var port_mongo = params.port_mongo;
    var initial_code = params.initial_code;
    var right_answer = params.right_answer;
    var ex_id = params.ex_id;
    var error = [];


    if (user_id.length == 0) error.push("Please insert user id");
    if (language.length == 0) error.push("Please insert container name");
    if (mode_mvc.length == 0) error.push("Please insert mode_mvc");
    if (port_w.length == 0) error.push("Please insert port_w id");
    if (port_api.length == 0) error.push("Please insert port_api id");
    if (port_ssh.length == 0) error.push("Please insert port_ssh id");
    if (port_mongo.length == 0) error.push("Please insert port_mongo id");

    if (error.length == 0){
        return res.send("Deleted " + shell.exec('docker rm ' + language ) + " Container with  volume id 6f17216c9b3a...");
    }else
        return res.send(error)
})

server.post(api_url+"/stop_container", (req, res) => {
    
    var params = req.body;
    var user_id = params.user_id;
    var language = params.language;
    var mode_mvc = params.mode_mvc;
    var port_w = params.port_w;
    var port_api = params.port_api;
    var port_ssh = params.port_ssh;
    var port_mongo = params.port_mongo;
    var initial_code = params.initial_code;
    var right_answer = params.right_answer;
    var ex_id = params.ex_id;
    var error = [];


    if (user_id.length == 0) error.push("Please insert user id");
    if (language.length == 0) error.push("Please insert container name");
    if (mode_mvc.length == 0) error.push("Please insert mode_mvc");
    if (port_w.length == 0) error.push("Please insert port_w id");
    if (port_api.length == 0) error.push("Please insert port_api id");
    if (port_ssh.length == 0) error.push("Please insert port_ssh id");
    if (port_mongo.length == 0) error.push("Please insert port_mongo id");

    if (error.length == 0){
        return res.send("Stopped " + shell.exec('docker stop ' + language ) + " Container with  volume id 0e5bec869e38...");
    }else
        return res.send(error)
})



server.post(api_url+"/start_container", (req, res) => {
    var params = req.body;
    var user_id = params.user_id;
    var language = params.language;
    var mode_mvc = params.mode_mvc;
    var port_w = params.port_w;
    var port_api = params.port_api;
    var port_ssh = params.port_ssh;
    var port_mongo = params.port_mongo;
    var initial_code = params.initial_code;
    var right_answer = params.right_answer;
    var ex_id = params.ex_id;
    var error = [];


    if (user_id.length == 0) error.push("Please insert user id");
    if (language.length == 0) error.push("Please insert container name");
    if (mode_mvc.length == 0) error.push("Please insert mode_mvc");
    if (port_w.length == 0) error.push("Please insert port_w id");
    if (port_api.length == 0) error.push("Please insert port_api id");
    if (port_ssh.length == 0) error.push("Please insert port_ssh id");
    if (port_mongo.length == 0) error.push("Please insert port_mongo id");
    // sudo docker run -d --name milenium-alpine-lamp --mount source=lamp-volume,target=/Users/adedayoakinpelu/Documents/compile-box milenium1/alpine-lamp
    if (error.length == 0){
        return res.send("Started " + shell.exec('docker start ' + language ) + " Container with volume id dfbc2d2f18cf...")
    }else
        return res.send(error)

})


server.post(api_url+"/run", (req, res) => {
    var params = req.body;
    var user_id = params.user_id;
    var image_name = params.image_name;
    var mode_mvc = params.mode_mvc;
    var port_w = params.port_w;
    var port_api = params.port_api;
    var port_ssh = params.port_ssh;
    var port_mongo = params.port_mongo;
    var initial_code = params.initial_code;
    var right_answer = params.right_answer;
    var ex_id = params.ex_id;
    var error = [];


    if (user_id.length == 0) error.push("Please insert user id");
    if (image_name.length == 0) error.push("Please insert container name");
    if (mode_mvc.length == 0) error.push("Please insert mode_mvc");
    if (port_w.length == 0) error.push("Please insert port_w id");
    if (port_api.length == 0) error.push("Please insert port_api id");
    if (port_ssh.length == 0) error.push("Please insert port_ssh id");
    if (port_mongo.length == 0) error.push("Please insert port_mongo id");
    // sudo docker run -d --name milenium-alpine-lamp --mount source=lamp-volume,target=/Users/adedayoakinpelu/Documents/compile-box milenium1/alpine-lamp
    if (error.length == 0){
        var volume_name = 'sandbox-react-'+user_id;
        var container_name = 'sandbox-react-'+user_id;
        var volume_path = "/Users/adedayoakinpelu/Documents/compile-box/volumes";
        var publish = port_w+':'+port_api;
        return res.send("Started Container with volume id" + shell.exec('docker run -d --name  -p '+ container_name + ' --mount source='+volume_name + ',target='+volume_path  + ' ' +image_name))
    }else
        return res.send(error)

})


server.post(api_url+"/restart_container", (req, res) => {
    var params = req.body;
    var user_id = params.user_id;
    var language = params.language;
    var mode_mvc = params.mode_mvc;
    var port_w = params.port_w;
    var port_api = params.port_api;
    var port_ssh = params.port_ssh;
    var port_mongo = params.port_mongo;
    var initial_code = params.initial_code;
    var right_answer = params.right_answer;
    var ex_id = params.ex_id;
    var error = [];


    if (user_id.length == 0) error.push("Please insert user id");
    if (language.length == 0) error.push("Please insert container name");
    if (mode_mvc.length == 0) error.push("Please insert mode_mvc");
    if (port_w.length == 0) error.push("Please insert port_w id");
    if (port_api.length == 0) error.push("Please insert port_api id");
    if (port_ssh.length == 0) error.push("Please insert port_ssh id");
    if (port_mongo.length == 0) error.push("Please insert port_mongo id");

    if (error.length == 0)
        return res.send("Restarted " + shell.exec('docker start ' + language ) + " Container with volume id  ...");
    else
        return res.send(error)

})

server.post(api_url+"/check_logs", (req, res) => {
    var params = req.body;
    var user_id = params.user_id;
    var language = params.language;
    var mode_mvc = params.mode_mvc;
    var port_w = params.port_w;
    var port_api = params.port_api;
    var port_ssh = params.port_ssh;
    var port_mongo = params.port_mongo;
    var initial_code = params.initial_code;
    var right_answer = params.right_answer;
    var ex_id = params.ex_id;
    var error = [];


    if (user_id.length == 0) error.push("Please insert user id");
    if (language.length == 0) error.push("Please insert container name");
    if (mode_mvc.length == 0) error.push("Please insert mode_mvc");
    if (port_w.length == 0) error.push("Please insert port_w id");
    if (port_api.length == 0) error.push("Please insert port_api id");
    if (port_ssh.length == 0) error.push("Please insert port_ssh id");
    if (port_mongo.length == 0) error.push("Please insert port_mongo id");

    if (error.length == 0)
        return res.send(shell.exec('docker logs ' + language ));
    else
        return res.send(error)

})
