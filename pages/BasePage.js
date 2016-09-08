function BasePage(url, title, dir) {
	var pageUrl = url.indexOf('http') >= 0 ? url : (baseUrl + url);
	var	pageTitle = title;
	var	outputDir = dir;
	var	outputDirFail = dir + '/fail';
	var outputFile = 'FAIL';
	var self = this;

	this.titlePrefix = titlePrefix + "_" + moment(new Date()).format('YYYY-MM-DD_HH:mm:ss');

	// default timeout when waiting for ajax response; Note: need to be long otherwise, will have some failed tests
	this.defaultTimeoutInSec = customTimeoutInSec;
	this.defaultTimeout = this.defaultTimeoutInSec * 1000; // in millis

	/**
	 * Starts test and opens webpage
	 */
	this.start = function() {
		casper.start(pageUrl);
		this.includeBind();
	};

	/**
	 * Opens webpage
	 */
	this.open = function() {
		casper.thenOpen(pageUrl);
	};

	/**
	 * Asserts page URL to be correct
	 * @param {string} url Expected value for page URL
	 */
	this.checkPageUrl = function(url) {
		var urlToCheck = url != null ? url : pageUrl;
		casper.then(function() {
			casper.test.assertUrlMatch(urlToCheck, 'Page URL matches: ' + urlToCheck);
		});
	};

	/**
	 * Asserts page title to be correct
	 * @param {string} title Expected value for page title
	 */
	this.checkPageTitle = function(title) {
		var titleToCheck = (title != null ? title : pageTitle);
		casper.then(function() {
			casper.test.assertTitle(titleToCheck, 'Page title matches: ' + titleToCheck);
		});
	};

	/**
	 * Asserts page URL and title to be correct
	 * @param {string} url Expected value for page URL
	 * @param {string} title Expected value for page title
	 */
	this.checkPage = function(url, title) {
		this.checkPageUrl(url);
		this.checkPageTitle(title);
	};

	/**
	 * Takes screenshot of the current page
	 * @param {string} dir Directory to save screenshot to
	 * @param {string} name Filename for the screenshot
	 */
	this.screenshot = function(dir, name) {
		casper.then(function() {
			this.capture(screenshotName(dir, (pad(screenshotCount++) + '_' + name.replace(/ /g, '_').replace(/\W/g, ''))));
		});
	};

	/**
	 * Takes screenshot of the area containing the specified selector
	 * @param {string} dir Directory to save screenshot to
	 * @param {string} name Filename for the screenshot
	 * @param {string} selector The CSS selector for the element being clicked
	 */
	this.screenshotSelector = function(dir, name, selector) {
		casper.then(function() {
			this.captureSelector(screenshotName(dir, (pad(screenshotCount++) + '_' + name.replace(/ /g, '_').replace(/\W/g, ''))), selector);
		});
	};

	/**
	 * Waits specified number of seconds
	 * @param {number} seconds The number of seconds to explicitly wait
	 * @param {string} reason Explanation of why test explicitly waited
	 */
	this.wait = function(seconds, reason) {
		casper.wait((seconds * 1000), function() {
			logWait(seconds, reason);
		});
	};

	/**
	 * Clicks selector and logs the action
	 * @param {string} selector The CSS selector for the element being clicked
	 * @param {string} name The easy to understand description of the element
	 */
	this.click = function(selector, name) {
		this.waitAndAssert(selector, name);
		casper.then(function(){
			this.click(selector);
			logClick(name);
		});
	};

	/**
	 * Checks a checkbox and logs the action
	 * @param {string} selector The CSS selector for the checkbox to be checked
	 * @param {string} name The easy to understand description of the element
	 */
	this.check = function(selector, name) {
		this.waitAndAssert(selector, name);
		casper.then(function() {
			this.click(selector);
			logCheck(name);
		});
	};

	/**
	 * Types a value into text input or textarea and logs the action
	 * @param {string} selector The CSS selector for the element being typed in
	 * @param {string} value The text to type into the text input or textarea
	 * @param {string} name The easy to understand description of the element
	 * @param {boolean} focus Whether or not the element should keep focus after being typed in
	 */
	this.type = function(selector, value, name, focus) {
		if (value != null) {
			this.waitAndAssert(selector, name);
			casper.then(function(){
				this.sendKeys(selector, value, {keepFocus: focus, reset: true});
	    		logType(value, name);
			});
		}
	};

	/**
	 * Selects an option from a select dropdown
	 * @param {string} formSelector The CSS selector for the form
	 * @param {string} selectSelector The CSS selector for the form
	 * @param {string} selectName The easy to understand description of the select dropdown
	 * @param {string} optionValue The value of the option being selected
	 * @param {string} optionName The easy to understand description of the option
	 */
	this.select = function(formSelector, selectSelector, selectName, optionValue, optionName) {
		casper.then(function() {
			var opt = {};
			opt[selectSelector] = optionValue;
			this.fillSelectors(formSelector, opt, false);
			logSelect(selectName, optionName);
		});
	};

	/**
	 * Selects an option from a select dropdown
	 * @param {string} formSelector The CSS selector for the form
	 * @param {string} selectSelector The CSS selector for the form
	 * @param {string} selectName The easy to understand description of the select dropdown
	 * @param {string} optionText The text of the option being selected
	 * @param {string} optionName The easy to understand description of the option
	 */
	this.selectByText = function(formSelector, selectSelector, selectName, optionText, optionName) {
		if (optionText != null) {
			casper.then(function() {
			    this.evaluate(function(selector, textToMatch){
			        var select = document.querySelector(selector);
			        var found = false;
			        Array.prototype.forEach.call(select.children, function(opt, i){
			            if (!found && opt.innerHTML.indexOf(textToMatch) !== -1) {
			                select.selectedIndex = i;
			                found = true;
			            }
			        });
			    }, selectSelector, optionText);
			    logSelect(selectName, optionName);
			});
		}
	};

	/**
	 * Hovers over an element in the page
	 * @param {string} selector The CSS selector for the element being hovered over
	 * @param {string} name The easy to understand description of the element
	 */
	this.hover = function(selector, name) {
		this.waitAndAssert(selector, name);
		casper.then(function(){
			this.mouse.move(selector);
		});
		this.screenshot(outputDir, name);
	};

	/**
	 * Chooses file to be uploaded into file input of a form
	 * @param {string} selector The CSS selector for the file input
	 * @param {string} filename The name of the file being uploaded
	 * @param {string} name The easy to understand description of the element
	 */
	this.upload = function(selector, filename, name) {
		this.waitAndAssert(selector, name);
		casper.then(function(){
		    this.page.uploadFile(selector, getUploadFileLocation(filename));
		    logUpload(filename);
		});
	};

	/**
	 * Refreshes the current page
	 */
	this.refresh = function() {
		casper.then(function(){
		    this.reload(function(){
		    	console.log('Refreshed page');
		    });
		});
	};

	/**
	 * Performs keyboard event of pressing enter
	 */
	this.pressEnter = function() {
		casper.then(function(){
		    this.page.sendEvent('keypress', this.page.event.key.Enter, null, null, null);
		    console.log('Action: Pressed Enter');
		});
	};

	/**
	 * Switches from main window to an iFrame within the page.  This is primarily used for the Projects pages
	 * where creating or editing a project is done in an iFrame
	 */
	this.switchToInnerFrame = function() {
		this.wait(5, 'iFrame to load');
		casper.then(function(){
			this.page.switchToChildFrame(0);
		});
		this.wait(5, 'switch to iFrame');
	};

	/**
	 * Switches from an iFrame within the page to the main window.  This is primarily used for the Projects pages
	 * where creating or editing a project is done in an iFrame
	 */
	this.switchToParentFrame = function() {
		casper.then(function(){
			this.page.switchToParentFrame();
		});
	};

	/**
	 * Presses OK on confirmation alert message
	 */
	this.confirmAlert = function() {
		casper.setFilter('page.confirm', function(message) {
            self.received = message;
            this.echo("message to confirm : " + message);
            return true;
        });
	};

	/**
	 * Waits for and then asserts selector exists
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 * @param {string} selector The CSS selector for the element whose existence is being verified
	 * @param {string} name The easy to understand description of the element
	 * @param {number} seconds The number of seconds to override default timeout with
	 */
	this.waitAndAssert = function(selector, name, seconds) {
		var timeout = (seconds != null && !isNaN(seconds) && seconds > 5) ? (seconds * 1000) : this.defaultTimeout;
		casper.waitForSelector(selector,
	        function success() {
	    		casper.test.assertExists(selector, found(name));
	    		self.screenshotSelector(outputDir, name, selector);
	    	},
	    	function fail() {
	    		self.screenshot(outputDirFail, outputFile);
	    		casper.test.fail(found(name));
	    		casper.test.done();
	    	},
	    	timeout
	    );
	};

	/**
	 * Waits for and then asserts selector DOES NOT have the expected text
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 * @param {string} selector The CSS selector for the element whose existence is being verified
	 * @param {string} expectedText The text the CSS selector is expected to have
	 * @param {string} name The easy to understand description of the element
	 */
	this.waitAndAssertDoesntHaveText = function(selector, expectedText, name) {
		casper.waitForSelector(selector,
	        function success() {
				casper.test.assertSelectorDoesntHaveText(selector, expectedText, name + ' does NOT equal ' + expectedText);
				self.screenshot(outputDir, name);
	    	},
	    	function fail() {
	    		self.screenshot(outputDirFail, outputFile);
	    		casper.test.fail(found(name));
	    		casper.test.done();
	    	},
	    	this.defaultTimeout
	    );
	};

	/**
	 * Waits for and then asserts selector has the correct text
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 * @param {string} selector The CSS selector for the element whose existence is being verified
	 * @param {string} expectedText The text the CSS selector is expected to have
	 * @param {string} name The easy to understand description of the element
	 */
	this.waitAndAssertText = function(selector, expectedText, name) {
		casper.waitForSelector(selector,
				function success() {
			casper.test.assertSelectorHasText(selector, expectedText, name + ' is correct');
			self.screenshot(outputDir, name);
		},
		function fail() {
			self.screenshot(outputDirFail, outputFile);
			casper.test.fail(found(name));
			casper.test.done();
		},
		this.defaultTimeout
		);
	};

	/**
	 * Waits for and then asserts selector has the correct number of elements
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 * @param {string} selector The CSS selector for the element being counted
	 * @param {number} expectedCount The number of elements expected to be found
	 * @param {string} name The easy to understand description of the element
	 */
	this.waitAndAssertCount = function(selector, expectedCount, name) {
		this.waitAndAssertCompareByCount(selector, expectedCount, 'eq', name);
	};

	/**
	 * Waits for and then asserts selector has a minimum number of elements
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 * @param {string} selector The CSS selector for the element being counted
	 * @param {number} expectedCount The number of elements expected to be found
	 * @param {string} name The easy to understand description of the element
	 */
	this.waitAndAssertMinimumCount = function(selector, expectedCount, name) {
		this.waitAndAssertCompareByCount(selector, expectedCount, 'gte', name);
	}

	/**
	 * Waits for and then asserts selector has a maximum number of elements
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 * @param {string} selector The CSS selector for the element being counted
	 * @param {number} expectedCount The number of elements expected to be found
	 * @param {string} name The easy to understand description of the element
	 */
	this.waitAndAssertMaximumCount = function(selector, expectedCount, name) {
		this.waitAndAssertCompareByCount(selector, expectedCount, 'lte', name);
	}

	/**
	 * Waits for and then asserts selector has the correct number of elements
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 * @param {string} selector The CSS selector for the element being counted
	 * @param {number} expectedCount The number of elements expected to be found
	 * @param {string} compareBy how to compare, values: gt (greater than) | lt (less than) | eq (equals)
	 * @param {string} name The easy to understand description of the element
	 */
	this.waitAndAssertCompareByCount = function(selector, expectedCount, compareBy, name) {
		casper.waitForSelector(selector,
	        function success() {
				casper.test.assertElementCompareCount(selector, expectedCount, compareBy, found((compareBy === 'gte' ? 'minimum of ' : compareBy === 'lte' ? 'maximum of ' : '') + expectedCount + ' ' + name));
				self.screenshot(outputDir, name);
	    	},
	    	function fail() {
	    		casper.test.fail(found(name));
	    		self.screenshot(outputDirFail, outputFile);
	    		casper.test.done();
	    	},
	    	this.defaultTimeout
	    );
	};

	/**
	 * Asserts text exists in page body
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 * @param {string} text The string to look for within page body
	 */
	this.assertTextExistsInBody = function(text) {
		casper.then(function() {
			casper.test.assertTextExists(text, name + ' is correct');
			self.screenshot(outputDir, text + '_Exists');
		});
	};

	/**
	 * Asserts value equals expected value
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 * @param {mixed} val The value being checked
	 * @param {mixed} expectedVal The value that val should be equal to
	 * @param {string} name The easy to understand description of the item
	 */
	this.assertValuesEqual = function(val, expectedVal, name) {
		casper.then(function() {
			casper.test.assertEquals(val, expectedVal, name + ' is equal to ' + expectedVal);
			self.screenshot(outputDir, name);
		});
	};

	/**
	 * Asserts value does not equal specified value
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 * @param {mixed} val The value being checked
	 * @param {mixed} unexpectedVal The value that val shouldn't be equal to
	 * @param {string} name The easy to understand description of the element
	 */
	this.assertValuesNotEqual = function(val, unexpectedVal, name) {
		casper.then(function() {
			casper.test.assertNotEquals(val, unexpectedVal, name + ' is not equal to ' + unexpectedVal + ' (' + name + ' equals ' + val + ')');
			self.screenshot(outputDir, name);
		});
	};

	/**
	 * Waits for a selector's text to change value
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 * @param {string} selector The CSS selector for the element whose text is being monitored for a text change
	 * @param {string} name The easy to understand description of the element
	 */
	this.waitForTextChange = function(selector, name) {
		casper.waitForSelectorTextChange(selector,
			function success() {
				casper.test.pass(changed(name));
				self.screenshot(outputDir, name);
	    	},
	    	function fail() {
	    		casper.test.fail(changed(name));
	    		self.screenshot(outputDirFail, outputFile);
	    		casper.test.done();
	    	},
	    	this.defaultTimeout
	    );
	};

	/**
	 * Waits for a specified number of elements to appear on the page
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 * @param {string} selector The CSS selector for the element being checked
	 * @param {number} amount The number of elements to wait for
	 * @param {string} name The easy to understand description of the element
	 */
	this.waitForElements = function(selector, amount, name) {
		casper.waitFor(function() {
				return this.evaluate(function(el, num) {
			        return document.querySelectorAll(el).length >= num;
			    }, selector, amount);
			},
			function success() {
				casper.test.pass(found('At least ' + amount + ' of ' + name));
				self.screenshot(outputDir, name);
	    	},
	    	function fail() {
	    		casper.test.fail(found('At least ' + amount + ' ' + name));
	    		self.screenshot(outputDirFail, outputFile);
	    		casper.test.done();
			},
	    	this.defaultTimeout
    	);
	};

	/**
	 * Returns the number of elements in the page matching the provided selector
	 * @param {string} name The selector or name of the element clicked
	 */
	this.getElementCount = function(selector) {
		return casper.evaluate(function(sel){
			return $(sel).size();
		}, selector);
	};

	/**
	 * Modifies a property of an element in a page
	 * @param {string} selector The CSS selector for the element having a property modified
	 * @param {string} property The property being modified
	 * @param {string} value The new value for the property
	 */
	this.changeElementProperty = function(selector, property, value) {
		casper.then(function(){
		    casper.evaluate(function(element, prop, val) {
		    	// Grabs the element
				var el = $(element);
				// Sets the new value for the property of the element
				$(el).attr(prop, val);
			}, selector, property, value);
		});
	};

	/**
	 * Removes an element from the DOM of a page
	 * @param {string} selector The CSS selector for the element being removed
	 */
	this.removeElement = function(selector) {
		casper.then(function(){
		    casper.evaluate(function(element) {
		    	// Grabs the element
				var el = $(element);
				// Removes the element
				$(el).remove();
			}, selector);
		});
	};

	/**
	 * Fixes all links that match a selector to open in the same window by modifying the onclick event
	 * @param {string} selector The CSS selector for the element getting its onclick event modified
	 */
	this.modifyLinkLocation = function(selector) {
		casper.then(function() {
			this.evaluate(function(sel) {
				$(sel).each(function(){
					var onclick = $(this).attr('onclick');
					var from = onclick.indexOf('(') + 1;
					var to = onclick.indexOf(')');
					var url = onclick.substr(from, to-from);
					$(this).removeAttr('onclick');
					$(this).attr('onclick', 'parent.location=' + url);
				});
			}, selector);
		});
	};

	/**
	 * Types value into an autocomplete input and clicks the first result
	 * @param {string} inputSelector The CSS selector for the input to type a value in
	 * @param {string} nameToType The value to type into the input
	 * @param {string} nameOfElement The easy to understand description of the input element
	 */
	this.fillAutoCompleteInput = function(inputSelector, autoCompleteSelector, nameToType, nameOfElement) {
		// Types {nameToType} in the {inputSelector} input
		this.type(inputSelector, nameToType, nameOfElement, true);
		// Waits for the autocomplete to pop up
		casper.waitUntilVisible(autoCompleteSelector,
			// Clicks the full name option and logs the click
			function success() {
				self.click(autoCompleteSelector, 'First autocomplete option of ' + nameOfElement);
			},
			function fail() {
				logNotFound('First autocomplete option of ' + nameOfElement);
				self.capture(screenshotName(outputDirFail, outputFile));
	    		casper.test.done();
		});
	};

	/**
	 * CasperJS v1.1-beta3 is only compatible with PhantomJS v1.x
	 * PhantomJS v1.x does not support Function.prototype.bind
	 * http://stackoverflow.com/questions/25359247/casperjs-bind-issue
	 */
	this.includeBind = function() {
		casper.on('page.initialized', function(){
		    this.evaluate(function(){
		        var isFunction = function(o) {
		          return typeof o == 'function';
		        };
		        var bind,
		          slice = [].slice,
		          proto = Function.prototype,
		          featureMap;

		        featureMap = {
		          'function-bind': 'bind'
		        };

		        function has(feature) {
		          var prop = featureMap[feature];
		          return isFunction(proto[prop]);
		        }

		        // check for missing features
		        if (!has('function-bind')) {
		          // adapted from Mozilla Developer Network example at
		          // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
		          bind = function bind(obj) {
		            var args = slice.call(arguments, 1),
		              self = this,
		              nop = function() {
		              },
		              bound = function() {
		                return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
		              };
		            nop.prototype = this.prototype || {}; // Firefox cries sometimes if prototype is undefined
		            bound.prototype = new nop();
		            return bound;
		          };
		          proto.bind = bind;
		        }
		    });
		});
	};


}