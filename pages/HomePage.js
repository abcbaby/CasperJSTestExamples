phantom.page.injectJs('pages/BasePage.js');

function HomePage(url, title, dir) {

	BasePage.call(this, url, title, dir);

}

HomePage.prototype = Object.create(BasePage.prototype);