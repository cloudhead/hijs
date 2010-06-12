(function () {
//
// hijs - JavaScript Syntax Highlighter
//
// Copyright (c) 2010 Alexis Sellier
//

// All elements which match this will be syntax highlighted.
var selector = 'code';

var keywords = ('var function if else for while break switch case do new '
               +'continue delete return this true false throw catch typeof').split(' ');

// Syntax definition
// The key becomes the class name of the <span>
// around the matched block of code.
var syntax = {
  'comment': /(\/\*(?:[^*]|\*+[^\/*])*\*+\/|\/\/[^\n]*)/mg,
  'string' : /("(?:(?!")[^\\]|\\.)*"|'(?:(?!')[^\\]|\\.)*')/g,
  'regexp' : /(\/.*\/[mgi]*)(?!\w)/g,
  'class'  : /\b([A-Z][a-z]+)\b/g,
  'number' : /\b([0-9]+(?:\.[0-9]+)?)\b/g,
  'keyword': new(RegExp)('\\b(' + keywords.join('|') + ')\\b', 'g')
};
var nodes = document.querySelectorAll(selector);

for (var i = 0, children; i < nodes.length; i++) {
    children = nodes[i].childNodes;

    for (var j = 0, str; j < children.length; j++) {
        code = children[j];

        if (code.length >= 0) { // It's a text node
            Object.keys(syntax).forEach(function (s) {
                code.nodeValue = code.nodeValue.replace(syntax[s], function (_, m) {
                    return '{#' + s + '#' + encode(m) + '#}';
                });
            });
        }
    }
}
for (var i = 0; i < nodes.length; i++) {
    nodes[i].innerHTML =
        nodes[i].innerHTML.replace(/\{#([a-z]+)#(.*?)#\}/g, function (_, name, value) {
            return '<span class="' + name + '">' + decode(value) + '</span>';
    });
}

// Encode ASCII characters to, and from Braille
function encode (str) {
    return str.split('').map(function (s) {
        if (s.charCodeAt(0) > 127) { return s }
        return String.fromCharCode(s.charCodeAt(0) + 0x2800);
    }).join(' ');
}
function decode (str) {
    return str.trim().split(' ').map(function (s) {
        if (s.charCodeAt(0) - 0x2800 > 127) { return s }
        return String.fromCharCode(s.charCodeAt(0) - 0x2800);
    }).join('');
}

})();
