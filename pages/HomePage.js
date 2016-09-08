phantom.page.injectJs('pages/BasePage.js');

function HomePage(url, title, dir) {

	var linkFeedback = '#feedback-btn';
	var inputFeedbackTitle = '#feedback_label';
	var inputFeedbackMessage = '#feedback_message';
	var checkboxFeedbackResponse = '#respond-0';
	var buttonFeedbackOk = 'button[data-bb-handler="ok"]';
	var buttonFeedbackCancel = '.btn-primary';
	var buttonFeedbackClose = 'button.close';
	var linkProfile = '.navbar-right .dropdown-toggle';
	var linkViewProfile = '#navbar-common-user-dropdown li:first-child a';
	var linkPreferences = '#navbar-common-user-dropdown li:nth-child(2) a';
	var linkLogout = '#logout-btn';

	BasePage.call(this, url, title, dir);

	/**
	 * Asserts Feedback link in header exists and then clicks it
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 */
	this.clickLinkFeedback = function() {
		this.click(linkFeedback, 'Feedback link');
	};

	/**
	 * Asserts Title input exists and then fills it in
	 * @param {string} val The value to type in Title input
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 */
	this.completeFeedbackTitle = function(val) {
		this.type(inputFeedbackTitle, val, 'Title');
	};

	/**
	 * Asserts Message textarea exists and then fills it in
	 * @param {string} val The value to type in Message textarea
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 */
	this.completeFeedbackMessage = function(val) {
		this.type(inputFeedbackMessage, val, 'Message textarea');
	};

	/**
	 * Asserts Response Requested checkbox exists and then checks it
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 */
	this.completeFeedbackResponse = function() {
		this.check(checkboxFeedbackResponse, 'Response requested');
	};

	/**
	 * Asserts Ok button in the Feedback modal exists and then clicks it
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 */
	this.clickFeedbackOkButton = function() {
		this.click(buttonFeedbackOk, 'Feedback Ok button');
	};

	/**
	 * Asserts Cancel button in the Feedback modal exists and then clicks it
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 */
	this.clickFeedbackCancelButton = function() {
		this.click(buttonFeedbackCancel, 'Feedback Cancel button');
	};

	/**
	 * Asserts Close button (X) in the Feedback modal exists and then clicks it
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 */
	this.clickFeedbackCloseButton = function() {
		this.click(buttonFeedbackClose, 'Feedback Close button');
	};

	/**
	 * Asserts Profile link denoted by the current user's name exists and then clicks it
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 */
	this.clickLinkProfile = function() {
		this.click(linkProfile, 'Profile link');
	};

	/**
	 * Asserts View Profile link exists and then clicks it
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 */
	this.clickLinkViewProfile = function() {
		this.clickLinkProfile();
		this.click(linkViewProfile, 'View Profile link');
	};

	/**
	 * Asserts Preferences link exists and then clicks it
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 */
	this.clickLinkPreferences = function() {
		this.clickLinkProfile();
		this.click(linkPreferences, 'Preferences link');
	};

	/**
	 * Asserts Logout link exists and then clicks it
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 */
	this.clickLinkLogout = function() {
		this.clickLinkProfile();
		this.click(linkLogout, 'Logout link');
		this.wait(this.defaultTimeoutInSec, 'Logging out');
		this.checkPageUrl('/sso/login');
	};

	/**
	 * Submits a feedback with the appropriate info
	 * @param {object} feedback An object containing the information to submit
	 * PASS: Logs the result
	 * FAIL: Logs the result, takes screenshot, and ends test
	 */
	this.submitFeedback = function(feedback) {
		this.clickLinkFeedback();
		this.completeFeedbackTitle(feedback.title);
		this.completeFeedbackMessage(feedback.message);
		if (feedback.response) {
			this.completeFeedbackResponse();
		}
		this.clickFeedbackOkButton();
		this.wait(this.defaultTimeoutInSec, 'Feedback to submit');
	};

}

HomePage.prototype = Object.create(BasePage.prototype);