/*
	Developed by Robert Nyman, http://www.robertnyman.com
	Code/licensing: http://code.google.com/p/getelementsbyclassname/
*/	
var getElementsByClassName = function (className, tag, elm){
	if (document.getElementsByClassName) {
		getElementsByClassName = function (className, tag, elm) {
			elm = elm || document;
			var elements = elm.getElementsByClassName(className),
				nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
				returnElements = [],
				current;
			for(var i=0, il=elements.length; i<il; i+=1){
				current = elements[i];
				if(!nodeName || nodeName.test(current.nodeName)) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	else if (document.evaluate) {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for(var j=0, jl=classes.length; j<jl; j+=1){
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
			}
			try	{
				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
			}
			while ((node = elements.iterateNext())) {
				returnElements.push(node);
			}
			return returnElements;
		};
	}
	else {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
				current,
				returnElements = [],
				match;
			for(var k=0, kl=classes.length; k<kl; k+=1){
				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
			}
			for(var l=0, ll=elements.length; l<ll; l+=1){
				current = elements[l];
				match = false;
				for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break;
					}
				}
				if (match) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	return getElementsByClassName(className, tag, elm);
};

// Pretty fast - http://jsperf.com/select-vs-natives-vs-jquery
/*
  By, shortcuts for getting elements.
  
  Author: Raynos
  Link: https://gist.github.com/1455456
*/
var By = { 
    id: function (id) { return document.getElementById(id) }, 
    tag: function (tag, context) { 
        return (context || document).getElementsByTagName(tag)
    }, 
    "class": function (klass, context) {
        return (context || document).getElementsByClassName(klass)
    },
    name: function (name) { return document.getElementsByName(name) }, 
    qsa: function (query, context) { 
        return (context || document).querySelectorAll(query)
    },
    qs: function (query, context) {
        return (context || document).querySelector(query)
    }
}

/* Little XHR
 * by: rlemon        http://github.com/rlemon/
 * see README for useage.
 * */
var xhr = {
	xmlhttp: (function() {
		var xmlhttp;
		try {
			xmlhttp = new XMLHttpRequest();
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
			} catch (er) {
				try {
					xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
				} catch (err) {
					xmlhttp = false;
				}
			}
		}
		return xmlhttp;
	}()),
	 /* https://github.com/Titani/SO-ChatBot/blob/ccf6cfe827aee2af7b2832e48720a8e24a8feeed/source/bot.js#L110 */
	urlstringify: (function() {
		var simplies = {
			'number': true,
			'string': true,
			'boolean': true
		};
		var singularStringify = function(thing) {
			if (typeof thing in simplies) {
				return encodeURIComponent(thing.toString());
			}
			return '';
		};
		var arrayStringify = function(array, keyName) {
			keyName = singularStringify(keyName);
			return array.map(function(thing) {
				return keyName + '=' + singularStringify(thing);
			});
		};
		return function(obj) {
			return Object.keys(obj).map(function(key) {
				var val = obj[key];
				if (Array.isArray(val)) {
					return arrayStringify(val, key);
				} else {
					return singularStringify(key) + '=' + singularStringify(val);
				}
			}).join('&');
		};
	}()),
	post: function(options) {
		this.request.apply(this, ['POST', options]);
	},
	get: function(options) {
		this.request.apply(this, ['GET', options]);
	},
	request: function(type, options) {
		if (this.xmlhttp && options && 'url' in options) {
			var xhr = this.xmlhttp,
				enctype = ('enctype' in options) ? options.enctype : 'application/x-www-form-urlencoded';
			xhr.open(type, options.url, true);
			xhr.setRequestHeader('Content-Type', enctype);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						if ('success' in options && options.success.apply) {
							options.success.apply(this, [xhr]);
						}
					} else if (xhr.status && xhr.status != 200) {
						if ('failure' in options && options.failure.apply) {
							options.failure.apply(this, [xhr]);
						}
					}
				}
			};
			var data = null;
			if ('data' in options) {
				data = this.urlstringify.apply(this, [options.data]);
			}
			xhr.send(data);
		}
	}
};

// Cross-browser shims for small stuff
if (Node.textContent === 'undefined') {
  Node.textContent = Node.innerText
}
