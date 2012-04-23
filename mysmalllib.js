var MSL = {
    // Pretty fast - http://jsperf.com/select-vs-natives-vs-jquery
    /*
    By, shortcuts for getting elements.

    Author: Raynos
    Link: https://gist.github.com/1455456
    */
    By: {
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
    },

    /* Little XHR
    * by: rlemon        http://github.com/rlemon/
    * see README for useage.
    * */
    xhr: {
        xmlhttp: (function() {
            var xmlhttp;
            try {
                xmlhttp = new XMLHttpRequest();
            }
            catch (e) {
                try {
                    xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
                }
                catch (er) {
                    try {
                        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
                    }
                    catch (err) {
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
            },
            singularStringify = function(thing) {
                if (typeof thing in simplies) {
                    return encodeURIComponent(thing.toString());
                }
                return '';
            },
            arrayStringify = function(array, keyName) {
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
                    }
                    else {
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
                if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if ('success' in options && options.success.apply) {
                    options.success.apply(this, [xhr]);
                    }
                } else if (xhr.status && xhr.status !== 200) {
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
    },

    /**
     * Object to handle cookies easily.
     *
     * Original code: http://quirksmode.org/js/cookies.html
     */
    Cookie: {
        create: function(name, value, days, domain) {
            var expires,
                date

            if (days) {
                date = new Date()
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
                expires = '; expires=' + date.toGMTString()
            }
            else {
                expires = ""
            }
            if (domain) {
                domain = '; domain=' + domain
            }
            else {
                domain = ''
            }
            document.cookie = name + '=' + value + expires + domain + '; path=/'
        },
        read: function(name) {
            var nameEQ = name + '=',
                ca = document.cookie.split(';'),
                i,
                c
            for (i = 0, l = ca.length; i < l; i++) {
                c = ca[i]
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length)
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length)
                }
            }
            return null
        },
        remove: function(name) {
            this.create(name, '', -1)
        }
    }
}

