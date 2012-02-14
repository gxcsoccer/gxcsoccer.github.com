// A simple utility function to generate output in a visible way
function addOutput(val, msg) {
    msg = msg || 'Value received:'
    dojo.create('li', {
        innerHTML: msg + ' ' + val
    }, 'output');
} // addOutput

dojo.ready(function() {
    // Post to the JSON echoing service.
    // Note that I'm explicitly *not* handling the response as JSON,
    // so that I simply get my string back.
    var def = dojo.xhrPost({
        url: '/echo/json/',
        content: {
            json: '[1,2,"three"]'
        },
        load: function(val) {
            addOutput(val, 'Starting point:');
        }
    });

    // From here out, the code is identical for jQuery and Dojo.
    // Kind of neat, that. :)
    def.then(function(val) {
        // Should output the array
        addOutput(val);
        return true;
    }).then(function(val) {
        // Should output a true
        addOutput(val);
        return 3;
    }).then(function(val) {
        // Should output a 3
        addOutput(val);
        // No return
    }).then(function(val) {
        // Given that there was no return,
        // the received value is undefined,
        // as then returns a promise for the return value
        // of the callback, so should output 'undefined
        addOutput(val);
        return null;
    }).then(function(val) {
        // Should output null
        addOutput(val);
        return 4;
    }).then(function(val) {
        // Should output 4
        addOutput(val);
    });
});