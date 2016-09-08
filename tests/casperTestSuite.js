phantom.page.injectJs('pages/echoForm/EchoPage.js');

casper.test.begin('Echo Test', 0, function(test) {

	// Output folder that screenshots will be saved to //
	var outputDir = 'echoForm.EchoPage';

	// Page objects //
	var echoPage = new EchoPage(outputDir);

	echoPage.start();
	echoPage.screenshot(outputDir, 'Echo Form Page');
	echoPage.fillForm();
	echoPage.getResponse();
	echoPage.screenshot(outputDir, 'Echo Result Page');

	/** Ends test */
    casper.run(function() {
        test.done();
    });

});