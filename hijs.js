/*jslint browser:true*/
/*jslint regexp:true*/

/*!
 * hijs - JavaScript Syntax Highlighter
 *
 * Copyright (c) 2010 Alexis Sellier
 */
(function (hijs) {
	'use strict';

	// All elements which match this will be syntax highlighted.
	var selector = hijs || 'code',
		keywords = [
			'var', 'function', 'if', 'else', 'for', 'while', 'break', 'switch', 'case', 'do', 'new', 'null', 'in', 'with',
			'void', 'continue', 'delete', 'return', 'this', 'true', 'false', 'throw', 'catch', 'typeof', 'with', 'instanceof'
		],
		special  = [
			'eval', 'window', 'document', 'undefined', 'NaN', 'Infinity', 'parseInt', 'parseFloat', 'encodeURI', 'decodeURI',
			'encodeURIComponent', 'decodeURIComponent'
		],
		// Syntax definition
		// The key becomes the class name of the <span>
		// around the matched block of code.
		syntax = [
			[
				'comment', /(\/\*(?:[^*\n]|\*+[^\/*])*\*+\/)/g /**/
			],
			[
				'comment', /(\/\/[^\n]*)/g
			],
			[
				'string', /("(?:(?!")[^\\\n]|\\.)*"|'(?:(?!')[^\\\n]|\\.)*')/g //"
			],
			[
				'regexp', /(\/.+\/[mgi]*)(?!\s*\w)/g
			],
			[
				'class', /\b([A-Z][a-zA-Z]+)\b/g
			],
			[
				'number', /\b([0-9]+(?:\.[0-9]+)?)\b/g
			],
			[
				'keyword', new (RegExp)('\\b(' + keywords.join('|') + ')\\b', 'g')
			],
			[
				'special', new (RegExp)('\\b(' + special.join('|') + ')\\b', 'g')
			]
		],
		syntaxLength = syntax.length,
		nodes = [],
		table = {},
		i,
		j,
		y,
		children,
		str,
		code,
		trim,
		map;

	// test to see if the native String.prototype.trim() method exists
	if (String.prototype.trim === undefined) {
		// if not, put a primitive polyfil in place
		trim = function (str) {
			return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
		};
	} else {
		// use the native .trim
		trim = function (str) {
			return str.trim();
		};
	}

	// test to see if the native Array.prototype.map() method exists
	if (Array.prototype.map === undefined) {
		// if not, put a primitive polyfil in place
		map = function (arr, callback) {
			var len = arr.length,
				result = [],
				i;

			for (i = 0; i < len; i += 1) {
				result[i] = callback(arr[i], i);
			}

			return result;
		};
	} else {
		// use the native .map
		map = function (arr, callback) {
			return arr.map(callback);
		};
	}

	function escape(str) {
		return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	// Encode ASCII characters to, and from Braille
	function encode(str, encoded) {
		table[encoded = map(str.split(''), function (s) {
			if (s.charCodeAt(0) > 127) {
				return s;
			}
			return String.fromCharCode(s.charCodeAt(0) + 0x2800);
		}).join('')] = str;
		return encoded;
	}

	function decode(str) {
		if (table.hasOwnProperty(str)) {
			return table[str];
		}

		return map(trim(str).split(''), function (s) {
			if (s.charCodeAt(0) - 0x2800 > 127) {
				return s;
			}
			return String.fromCharCode(s.charCodeAt(0) - 0x2800);
		}).join('');
	}

	function encodeNodeValue(code, k, v) {
		return code.nodeValue.replace(v, function (a, m) {
			return '\u00ab' + encode(k) + '\u00b7' + encode(m) + '\u00b7' + encode(k) + '\u00bb';
		});
	}

	function handleNode(node) {
		var k, v, i,
			trimmedValue;

		if (node.length !== undefined && node.length >= 0) {
			trimmedValue = trim(node.nodeValue);
			if (!/^\$\s/.test(trimmedValue)) {
				for (i = 0; i < syntaxLength; i += 1) {
					k = syntax[i][0];
					v = syntax[i][1];
					node.nodeValue = encodeNodeValue(node, k, v);
				}
			}
		}
	}

	function handleHtml(html) {
		return html.replace(/\u00ab(.+?)\u00b7(.+?)\u00b7\1\u00bb/g, function (a, name, value) {
			value = value.replace(/\u00ab[^\u00b7]+\u00b7/g, '');
			value = value.replace(/\u00b7[^\u00bb]+\u00bb/g, '');
			return '<span class="' + decode(name) + '">' + escape(decode(value)) + '</span>';
		});
	}

	if (/^[a-z]+$/.test(selector)) {
		nodes = document.getElementsByTagName(selector);

	} else if (document.getElementsByClassName && /^\.[\w\-]+$/.test(selector)) {
		nodes = document.getElementsByClassName(selector.slice(1));

	} else if (document.querySelectorAll) {
		nodes = document.querySelectorAll(selector);
	}

	for (i = 0, children; i < nodes.length; i += 1) {
		children = nodes[i].childNodes;
		for (j = 0, str; j < children.length; j += 1) {
			handleNode(children[j]);
		}
	}

	for (i = 0; i < nodes.length; i += 1) {
		nodes[i].innerHTML = handleHtml(nodes[i].innerHTML);
	}

}(window.hijs));
