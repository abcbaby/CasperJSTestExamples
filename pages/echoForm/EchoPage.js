phantom.page.injectJs('pages/HomePage.js');

function EchoPage(dir) {

	var	url = '/~jkorpela/forms/testing.html';
	var	title = 'Echoing';

	HomePage.call(this, url, title, dir);

	this.fillForm = function() {
		casper.then(function() {
			this.sendKeys('form textarea[name=Comments]', '{"fields":["id"]}');
			this.click('input[name=box]');
			this.echo('submitting form...');
			this.click('form input[type="submit"]');
		});
	};

	this.getResponse = function() {
		casper.then(function() {
			this.echo('Page url is ' + this.getCurrentUrl());
			this.echo('Page title is ' + this.getTitle());
			casper.test.assertSelectorHasText('tt', 'Comments');
			casper.test.assertSelectorHasText('tt', 'hidden field');
			casper.test.assertSelectorHasText('tt', 'box');
			this.echo(this.getHTML());
		});
	};

}

EchoPage.prototype = Object.create(HomePage.prototype);