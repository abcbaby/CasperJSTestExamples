/**
 * Reference: http://stackoverflow.com/questions/30105017/what-must-be-wrapped-in-then-statements-in-casperjs-how-to-determine-executio
 * OUTPUT:
 * 3 -> 1
 * 2 -> 2
 * 1 -> 3
 * 4 -> 4
 * 8 -> 5
 * 5 -> 6
 * 7 -> 7
 * 6 -> 8
 * 9 -> 10
 * 10 -> 11
 * 11 -> 12
 */
casper.test.begin('Casper Then Test', 0, function(test) {

	casper.on("load.finished", function(){
	    this.echo("1 -> 3");
	});
	casper.on("load.started", function(){
	    this.echo("2 -> 2");
	});
	casper.start('https://www.google.com');
	casper.echo("3 -> 1");
	casper.then(function() {
	    this.echo("4 -> 4");
	    this.then(function() {
	        this.echo("5 -> 6");
	        this.then(function() {
	            this.echo("6 -> 8");
	        });
	        this.echo("7 -> 7");
	    });
	    this.echo("8 -> 5");
	});

	casper.then(function() {
		casper.wait(1000, function() {
			// Waited 1 second.
		    this.echo("10 -> 11");
		});
	    this.echo("9 -> 10");
		casper.wait(1000, function() {
			// Waited 1 second.
		    this.echo("11 -> 12");
		});
	});

	casper.run();
});