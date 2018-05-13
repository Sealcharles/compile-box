var jsTree = require("./js-tree.js");
var Laraedit = (function(){
  var path = require('path');
  function Laraedit(){};
  var projectPath = "../project";

  function getFileTree(params, res){
    var fs = new jsTree(projectPath);
    if(typeof params.operation != "undefined"){
      var rslt = null;
      try{
  		switch ( params.operation) {

                      case 'get_node':
                          var node = typeof params.id != "undefined" && params.id  !== '#' ? params.id  : '/';

                          rslt = fs.lst ( node, ( typeof params.id != "undefined"  && params.id === '#' ) );
                          break;

                      case "get_content":
                          var node = typeof params.id != "undefined"  && params.id !== '#' ? params.id : '/';
                          fs.data( node, res);

                          break;

                      case 'create_node':
                          var node = typeof params.id != "undefined"  && params.id !== '#' ? params.id : '/';
						 
                          rslt = fs.create ( node,  typeof params.text != "undefined" ? params.text : '', ( !(typeof params.type != "undefined") || params.type !== 'file' )) ;
						  
                          break;

                      case 'rename_node':
						
                          var node = typeof params.id != "undefined"  && params.id !== '#' ? params.id : '/';
                          fs.rename ( node, typeof params.text != "undefined" ? params.text : '' ,res);
                          break;

                      case 'delete_node':
                          var node = typeof params.id != "undefined"  && params.id !== '#' ? params.id : '/';
                          rslt = fs.remove ( node );
                          break;

                      case 'move_node':
                          var node = typeof params.id != "undefined"  && params.id !== '#' ? params.id : '/';
                          var parn = typeof params.parent != "undefined" && params.parent !== '#' ? params.parent : '/';
                          fs.move ( node, parn, res);
                          break;

                      case 'copy_node':
                          var node = typeof params.id != "undefined"  && params.id !== '#' ? params.id : '/';
                          var parn = typeof params.parent != "undefined" && params.parent !== '#' ? params.parent : '/';
                          fs.copy ( node, parn, res);
                          break;

                      default:
                          console.log( 'Unsupported operation: ' + params.operation );
                          break;

                  }
          }catch(error){
            console.log(error);
          }


                  return rslt;
  	}
  }

  Laraedit.prototype.getIndex = function(req, res){

    //if(req.xhr){
      var result = getFileTree(req.query, res);
      if(result != null){
          res.send(result);
      }
   /* }else{
      //res.sendFile(path.join(__dirname + '/index.html'));
    }*/


  }
  Laraedit.prototype.postSave = function(req, res) {

      var fs = require('fs');
      var params = req.body;
		
      var dir = path.join(path.join(__dirname,projectPath), params.file);
      // console.log(dir);
    fs.writeFile(dir, params.contents, function(err) {
        if(err) {
            throw err;
        }
    });
   }
  return Laraedit;
})();
var lre = new Laraedit();
module.exports = lre;
