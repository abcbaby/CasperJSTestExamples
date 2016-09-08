# CasperJS Automated Testing

This project contains CasperJS tests.

Currently set to run on Windows.

1. Run
	- Right click on build.xml
	- Click Run As -> Ant Build...
	- Click on 'Main' tab
	- Click 'Run' button
	- Watch for output in console and exam test report and screenshot in target folder

2. Code
	- Drop your test file(s) under tests folder or sub-folder.  All tests under tests folder will be run

3. Debugging
	- Modify build.xml to include the argument: <arg line="--remote-debugger-port=9000" />
	- Place the debugger; command somewhere in the test to serve as a breakpoint
	- Run test
	- Open Chrome and navigate to localhost:9000
	- Click the page link (probably titled about:blank)
	- In the console tab, type __run(); and hit enter
	- Add additional breakpoints where required
	- Debug away!