My Small Library
===

A small library grouping together a few objects I like to use on a daily basis.

Small description:

1. The `By` object. Allows to easily select DOM elements. Usage example:

        (function($) {
            var el = $.By.id('el-id');
        }(MSL));

2. The `Little-XHR` object. Allows to easily make AJAX requests. Usage example:

        (function($) {
            $.xhr.get({url: '/some-url', success: function(xhr) {
                // Get the response with xhr.responseText
            }});
        }(MSL));

3. The `Cookie` object. Allows to easily handle cookies. Usage example:

        (function($) {
            if ($.Cookie.read('some-value')) {
                // The cookie exists
            }
        }(MSL));

Licenses and authors are in the non-minified file.

