// Grid Shuffle
Array.prototype.shuffle = function () {
    for (var i = this.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = this[i];
        this[i] = this[j];
        this[j] = tmp;
    }
    return this;
};

$(function() {
	// TODO: dynamically create the dom grid
	// Create the multi array for storing the grid of elements
	var size = 9;
	var rows = Math.sqrt(size);
	var list = [];
	for (var j=1; j<size; j++) {
		list.push(j);
	}
	list.push('');
	var correct = list.join();
	list.shuffle();
	// hax
	list = [1,2,3,4,5,6,7,8,''];

	var grid = [];
	var temp = [];
	for (var i=0; i <= size; i++) {
		if (i%rows === 0 && i !== 0) {
			grid.push(temp);
			temp = [ list[i] ];
		} else {
			temp.push( list[i] );
		}
	}

	var items = $('.item');
	var count = 0;
	var numClicks = 0;
	for (var n=0; n<rows; n++) {
		for (var m=0; m<rows; m++) {
			items[count].innerHTML = grid[n][m];
			items[count].id = n + '' + m;
			items[count].onclick = function(n,m) {
				return function() {
					itemClicked(n,m);
					numClicks++;
				};
			}(n,m);
			count++;
		}
	}

	//$('#1').html('updated');

	function itemClicked(n,m) {
		canMove(n,m);
		// check for win
		console.log(grid.join());
		console.log(correct);
		if (grid.join() === correct) {
			$('body').append('YOU WINNNER!' + 
				' with ' + numClicks + ' clicks taken');
			// reset
			numClicks = 0;
		}
		// if win then add info
	}

	function canMove(n,m) {
		var max = rows - 1;
		var value = grid[n][m];

		if (value !== '') {

			console.log(n + ' ' + m);

			if (n>0 && grid[n-1][m] === '') {
				swap(n,m,n-1,m);
			}
			else if (n<max && grid[n+1][m] === '') {
				swap(n,m,n+1,m);
			}
			else if (m>0 && grid[n][m-1] === '') {
				swap(n,m,n,m-1);
			}
			else if (m<max && grid[n][m+1] === '') {
				swap(n,m,n,m+1);
			}
		}
	}

	// TODO: Use callbacks on change
	function swap(n,m,p,q) {
		var value = grid[n][m];
		grid[p][q] = value;
		grid[n][m] = '';
		$('#' + n + m).html('');
		$('#' + p + q).html(value);
	}

	// Check if won or not
	// 
	// Can reset


});