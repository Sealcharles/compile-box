var jsTree = (function(){
	var fs = require('fs');
	var path = require('path');
	var process = require('process');
	var base = null;
	var pathProject= null;
	function jsTree(basePath){
		pathProject = base;
		base = 	real ( basePath );

        if ( !base ) {
					throw 'Base directory does not exist' ;
       	}
	};
	jsTree.prototype.data = function(id, res){

	/*	if (id.indexOf(":")) {

						id = [this, 'id'].map(id.split(':'));

            return {
            	'type'		: 'multiple',
            	'content'	: 'Multiple selected: ' + id.join (' ')
            };

    }*/
		dir = Path ( id );

	 	if (fs.lstatSync(dir).isDirectory()) {

			 return {
				 'type'		: 'folder',
				 'content'	: id
			 };

	 	}
		if (fs.lstatSync(dir).isFile()) {


			var ext = dir.indexOf('.') !== false ? dir.substring(dir.indexOf('.') + 1) : '';
			var dat = {
				'type' 		: ext,
				'content' 	: ''
			};
			fs.readFile(dir, 'utf8', function (err,data) {
			  if (err) {

					 throw err;
			  }
				dat['content'] = data;
				res.send(dat);
			});
			/*switch ( ext ) {

					case 'txt':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'text':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'md':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'js':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'json':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'css':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'html':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'htm':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'yml':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'xml':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'c':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'cpp':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'h':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'sql':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'log':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'py':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'rb':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'htaccess':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'php':
							dat['content'] = file_get_contents ( $dir );
							break;

					case 'jpg':

					case 'jpeg':

					case 'gif':

					case 'png':

					case 'bmp':
						//	$dat['content'] = 'data:' . finfo_file ( finfo_open ( FILEINFO_MIME_TYPE ), $dir ) . ';base64,' . base64_encode ( file_get_contents ( $dir ) );
							break;

					default:
							dat['content'] = 'File not recognized: '.Id(dir);
							break;

			}*/

			//return false;

		}
	};
	jsTree.prototype.create = function( id, name, mkdir) {
			
			mkdir = typeof mkdir !== 'undefined' ? mkdir : false;
			var dir = Path( id );
			
			if ( name.match (/^[0-9_+-]/g) || ! name.length ) {
					throw ( 'Invalid name: ' + name );
			}
			
			if ( mkdir ) {
				if (!fs.existsSync(dir + path.sep + name )){
					fs.mkdirSync(dir + path.sep + name );
				}
			} else {
				/*fs.writeFile(dir + path.sep + name+ext, '', function (err) {
				  if (err) throw err;
				});*/
				//fs.openSync(dir + path.sep + name, 'w', {mode: 0777});
				var writeFile = require('write');
				writeFile.sync(dir + path.sep + name, '');
			}
			
			var id = Id (dir + path.sep + name);
			return {
				'id' : id
			};

	}
	jsTree.prototype.rename = function ( id, name , res) {
			
			var dir = Path ( id );

			if ( dir === base ) {

					throw ( 'Cannot rename root' );
					return false;

			}

			if ( name.match( /^[0-9_+-]/g) || ! name.length ) {

				throw	( 'Invalid name: ' + name );

			}

			var newar = dir.split(path.sep);
			newar.pop();
		  newar.push(name);

			newar = newar.join(path.sep);
			
			if ( dir !== newar ) {
	
				
					fs.exists(newar, function (exists) {
					    if(exists){
								throw ('Path already exists: ' + newar);
							}else{
								fs.rename(dir, newar, function (err) {
									if (err) throw err;

									if(res !=  false){
											res.send({'id' : Id ( newar )});
									}

								});
							}
					});


			}

		}
		jsTree.prototype.remove = function ( id ) {

				var dir = Path ( id );

				if ( dir === base ) {

						//throw new Exception ( 'Cannot remove root' );
						console.log('Cannot remove root')
				}

				if ( fs.lstatSync(dir).isDirectory()) {
						rmdir = require('rimraf');
						rmdir(dir, function(error){
							console.log("del folder");
						});
				}

				if (fs.lstatSync(dir).isFile()) {
					fs.unlinkSync(dir);
				}

				return {
					'status' : 'OK'
				};

		}

	jsTree.prototype.move = function ( id, par, res ) {

			var dir = Path ( id );

			par = Path ( par );

			var newar = dir.split(path.sep);

			newar = newar.pop();

			newar = par +path.sep+ newar;

			//this.rename ( dir, newar, false);
			var mv = require('mv');

			mv(dir, newar, function(err) {
			  if(err){
					throw "Move error";
				}else{
					res.send({'id' : Id ( newar )});
				}
			});


	}
	jsTree.prototype.copy = function  ( id, par, res ) {

		dir = Path(id);

		par = Path(par);

		var newar = dir.split(path.sep);

		newar = newar.pop();

		newar = par +path.sep+ newar;

		fs.exists(newar, function (exists) {
				if(exists){
					console.log("exists")
				}else{
					var ncp = require('ncp').ncp;
						ncp.limit = 16;
						ncp(dir, newar, function (err) {
							if (err) {
							 return console.error(err);
							}
							res.send({'id' : Id ( newar )});
						});


				}
		});
}
	jsTree.prototype.lst = function(id, with_root){

		with_root = typeof with_root !== 'undefined' ? with_root : false;
    var dir = Path(id);

    var lst = fs.readdirSync(dir);

    if(!lst){
      throw ( 'Could not list path: ' + dir );
    }

    var res = [];

    lst.forEach(function(item) {

      if ( item == '.' || item == '..' || item === null ) {
          return;
      }
      tmp = item.match ( /([^ a-zа-я-_0-9.]+)/g);

      if ( tmp === false || tmp === 1 ) {
      		return;
      }

      if (fs.lstatSync(dir + path.sep + item ).isDirectory()) {

        res.push({
					'text' 		: item,
					'children' 	: true,
					'id' 		: Id( dir + path.sep + item ),
					'icon' 		: 'fa fa-folder'
				});

      }else {

          res.push({
          	'text' 		: item,
          	'children' 	: false,
          	'id' 		: Id( dir + path.sep + item ),
          	'type' 		: 'file',
          	'icon' 		: 'fa fa-file fa-file-' + item.substring(item.indexOf(".") + 1)
          });

    	}
		});

		if ( with_root && Id( dir ) === '/' ) {

        res = [
            	{
            		'text' 		:  path.basename(base),
            		'children' 	: res,
            		'id' 		: '/',
            		'icon'		: 'fa fa-folder',
            		'state' 	: {
						            			'opened' 	: true,
						            			'disabled' 	: true
            								 }
						}
					];
    }

        return res;
	}


   function real ( paths ) {
		 		if(base == null){
					process.chdir (path.join(__dirname,paths));
				}else{
						process.chdir (base);
				}

        var temp = fs.realpathSync(paths)

        if ( ! temp ) {
					throw  'Path does not exist: ' + paths;
        }

        if (base && base.length) {

            if (temp.indexOf(base) !== 0 ) {
							throw 'Path is not inside base ( ' +base + ' ) : ' + temp ;
            }

        }

        return temp;

    }
	function Id(paths){
		paths = real ( paths );
		
		paths =  paths.substring(base.length);
		paths =  paths.replace(path.sep, '/');

		$path = trim ( paths, '/' );
		if(paths.length){
			return paths;
		}else{
			return '/'
		}
	}
	function Path(id){
	    id = id.replace ( '/', path.sep);

			id = trim(id, path.sep)

      id = real ( base +path.sep+ id );

        return id;
	}



	return jsTree;
})();

module.exports = jsTree;

//trim function
function makeString(object) {
if (object == null) return '';
return String(object);
};
function escapeRegExp(str) {
return makeString(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
function defaultToWhiteSpace(characters) {
if (characters == null)
return '\\s';
else if (characters.source)
return characters.source;
else
return '[' + escapeRegExp(characters) + ']';
};
function ltrim(str, characters) {
var nativeTrimLeft = String.prototype.trimLeft;
str = makeString(str);
if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
characters = defaultToWhiteSpace(characters);
return str.replace(new RegExp('^' + characters + '+'), '');
};
function trim(str, characters) {
var nativeTrim = String.prototype.trim;
str = makeString(str);
if (!characters && nativeTrim) return nativeTrim.call(str);
characters = defaultToWhiteSpace(characters);
return str.replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
};
function rtrim(str, characters) {
var nativeTrimRight = String.prototype.trimRight;
str = makeString(str);
if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
characters = defaultToWhiteSpace(characters);
return str.replace(new RegExp(characters + '+$'), '');
};
