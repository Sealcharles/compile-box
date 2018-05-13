trim = {};

trim.makeString =  function (object) {
if (object == null) return '';
return String(object);
};
function escapeRegExp(str) {
return trim.makeString(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
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
