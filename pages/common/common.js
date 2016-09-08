
/**
 * Common included in testing
 * @author zhci7sa
 */

/**
 Global variables (used across multiple tests)
 */
var system =  require('system'),
    utils = require('utils'),
    tester = require('tester'),
	x = require('casper').selectXPath,
	baseUrl = casper.cli.get('url'),
	customTimeoutInSec = casper.cli.get('timeoutInSec'),
	titlePrefix = casper.cli.get('titlePrefix'),
	screenshotCount = 1;

init();

/**
 * Initializes the Casper test and Phantom browser
 */
function init(){
	casper.options.viewportSize = {width: 1024, height: 768};
	casper.on('page.error', function(msg, trace) {
	   this.echo('Error: ' + msg, 'ERROR');
	   for(var i=0; i<trace.length; i++) {
	       var step = trace[i];
	       this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
	   }
	});

	casper.options.onResourceRequested = function(C, requestData, request) {
		if(false) {
			console.log("--- Request headers ---");
		    utils.dump(requestData.headers);
			console.log("-----------------------");
		}
		if(false) {
			console.log("--- Cookies ---");
		    utils.dump(phantom.cookies);
			console.log("---------------");
		}
	};

	casper.options.onResourceReceived = function(C, response) {
		if(false) {
			console.log("--- Response ---");
		    utils.dump(response);
			console.log("----------------");
		}
	};
}

/**
 * Returns the absolute path of the screenshot including path, name, timestamp, and extension
 * @param {string} subPath The path of the file
 * @param {string} name The name of the file
 */
function screenshotName(subPath, name){
	var screenshotExtention = 'png',
		screenshotNow = new Date(),
		screenshotStamp = screenshotNow.getFullYear() + pad(screenshotNow.getMonth() + 1) + pad(screenshotNow.getDate()) + '-' + pad(screenshotNow.getHours()) + pad(screenshotNow.getMinutes()) + pad(screenshotNow.getSeconds());
	return 'target' + '/' + subPath + '/' + name + '_' + screenshotStamp +  '.' + screenshotExtention;
}

/**
 * Pads single digit numbers with a 0 on the left
 * @param {int} number The number to be padded
 */
function pad(number) {
	var r = String(number);
	if (r.length === 1) {
		r = '0' + r;
	}
	return r;
}

/**
 * Returns absolute path of where files to upload are located
 * @param {string} name The name of the file being uploaded
 */
function getUploadFileLocation(name){
	return 'assets' + '/' + 'upload-files' + '/' + name;
}

/**
 * Returns a message that an element was found
 * @param {string} name The element found
 */
function found(name){
	return 'Found ' + name;
}

/**
 * Returns a message that an element's text changed
 * @param {string} name The element whose text changed
 */
function changed(name){
	return 'Text of ' + name + ' changed';
}

/**
 * Returns a message that an element was clicked
 * @param {string} name The selector or name of the element clicked
 */
function logClick(name){
	console.log('Action: Clicked \'' + name + '\'');
}

/**
 * Returns a message that an element was checked
 * @param {string} name The selector or name of the element checked
 */
function logCheck(name){
	console.log('Action: Checked \'' + name + '\' checkbox');
}

/**
 * Returns a message that an option was chosen in a select
 * @param {string} selectName The name of the select element
 * @param {string} optionName The name of the option selected
 */
function logSelect(selectName, optionName){
	console.log('Action: Selected ' + optionName + ' option from the ' + selectName + ' select list');
}

/**
 * Returns a message that a document was uploaded
 * @param {string} name The name of the file uploaded
 */
function logUpload(name){
	console.log('Action: Uploaded \'' + name + '\' file');
}

/**
 * Returns a message that some string was typed in an element
 * @param {string} str The string that was typed in
 * @param {string} name The selector or name of the element typed in
 */
function logType(str, name){
	console.log('Action: Typed \'' + str + '\' in the \'' + name + '\' input\'');
}

/**
 * Returns a message that the browser navigated back a page
 */
function logNavigatedBack(){
	console.log('Action: Browser navigated back');
}

/**
 * Returns a message that the test performed a wait
 * @param {int} seconds The number of seconds waited
 * @param {string} reason Why the test waited
 */
function logWait(seconds, reason){
	var str = 'Waited: ' + seconds + ' second(s)';
	if (reason != null){
		str += ' for ' + reason;
	}
	console.log(str);
}

/**
 * Returns an error message
 * @param {string} err The error message to provide to the user
 */
function logError(err){
	console.log('ERROR: ' + err);
}

/**
 * Returns the HTML matching the provided selector
 * @param {string} name The selector or name of the element clicked
 */
function getHtml(selector){
	var html = this.evaluate(function(sel){
		return $(sel).html();
	}, selector);
	return html;
}

/**
 * Asserts that a selector expression matches n elements.
 *
 * @param  Mixed   selector  A selector expression
 * @param  Number  count     Expected number of matching elements
 * @param  String  compareBy Value: lte | eq | gte
 * @param  String  message   Test description (Optional)
 * @return Object            An assertion result object
 */
tester.Tester.prototype.assertElementCompareCount = function assertElementCompareCount(selector, count, compareBy, message) {
    "use strict";
    if (!utils.isNumber(count) || count < 0) {
        throw new CasperError('assertElementCompareCount() needs a positive integer count');
    }
    if (!utils.isString(compareBy)) {
    	throw new CasperError('assertElementCompareCount() compareBy must be a string value');
    }
    var elementCount = this.casper.evaluate(function(selector) {
        try {
            return __utils__.findAll(selector).length;
        } catch (e) {
            return -1;
        }
    }, selector);
    var ok = false;
	switch (compareBy) {
    	case 'lte':
    		ok = elementCount <= count;
    		break;
    	case 'gte':
    		ok = elementCount >= count;
    		break;
    	case 'eq':
    	default:
    		ok = elementCount === count;
    		break;
	}
    return this.assert(ok, message, {
        type: "assertElementCount",
        standard: f('%d element%s matching selector "%s" found',
                    count,
                    count > 1 ? 's' : '',
                    selector),
        values: {
            selector: selector,
            expected: count,
            obtained: elementCount
        }
    });
};

