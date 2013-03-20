var slider = (function(slider){
  var Grid = function(size) {
    var grid = [];
    var numItems = size*size;
    var sequence = [];
    for (var j=1; j<numItems; j++) {
      sequence.push(j);
    }
    sequence.push('');
    var correct = sequence.join();

    Object.defineProperties(this,{
      grid: {
        value: grid
      },
      sequence: {
        value: sequence
      },
      correct: {
        value: correct
      },
      length: {
        value: numItems
      },
      columns: {
        value: size
      }
    });
  };

  Object.defineProperties(Grid.prototype,{
    pos: {
      value: function() {
        // console.log(arguments[0] + ' ' + arguments[1]
          // + ' ' + arguments[2]);
        if (arguments.length === 3) {
          this.grid[arguments[0]][arguments[1]] = arguments[2];
        }
        return this.grid[arguments[0]][arguments[1]];
      }
    },
    isSolved: {
      value: function() {
        return this.correct === this.grid.join();
      }
    },
    shuffle: {
      value: function() {
        for (var i=this.length-1; i>0; i--) {
          var r = Math.floor(Math.random() * (i+1));
          var tmp = this.sequence[i];
          this.sequence[i] = this.sequence[r];
          this.sequence[r] = tmp;
        }
        return this.sequence;
      }
    },
    structure: {
      value: function() {
          this.grid = [];
          var temp = [];
          for (var i=0; i <= this.length; i++) {
            if (i%this.columns === 0 && i !== 0) {
              this.grid.push(temp);
              temp = [ this.sequence[i] ];
            } else {
              temp.push( this.sequence[i] );
            }
          }
          return this.grid;
      }
    },
    itemClicked: {
      value: function(n,m) {
        this.canMove(n,m);
      }
    },
    canMove: {
      value: function(n,m) {
        var max = this.columns - 1;
        var value = this.pos(n,m);
        if (value !== '') {
          if (n>0 && this.pos(n-1,m) === '') {
            this.swap(n,m,n-1,m);
          }
          else if (n<max && this.pos(n+1,m) === '') {
            this.swap(n,m,n+1,m);
          }
          else if (m>0 && this.pos(n,m-1) === '') {
            this.swap(n,m,n,m-1);
          }
          else if (m<max && this.pos(n,m+1) === '') {
            this.swap(n,m,n,m+1);
          } else {
            return false;
          }
        }
      }
    },
    swap: {
      value: function(n,m,p,q) {
        // var value = this.pos(n,m);
        // this.pos(n,m,value);
        // this.pos(n,m,'');
        var value = this.grid[n][m];
        this.grid[p][q] = value;
        this.grid[n][m] = '';

        //TOFIX: moving dom element logic shouldn't be here
        //TODO: add moving animation
        $('#' + n + m).addClass('empty')
                  .html('');
        $('#' + p + q).removeClass('empty')
                  .html(value);
        return this;
      }
    },
    reset: {
      value: function(size) {
        this.grid = new Grid(size);
        return 0;
      }
    }
  });

  var Game = function(size) {
    var grid = new Grid(size);
    grid.shuffle();
    grid.structure();

    Object.defineProperties(this,{
      grid: {
        value: grid
      },
      columns: {
        value: size
      },
      elements: {
        value: $('#grid')
      }
    });
  };
  Object.defineProperties(Game.prototype,{
    draw: {
      value: function() {

        for (var n=0; n<this.columns; n++) {
          var column = $('<tr/>', {
              class: 'columns'
          }).appendTo(this.elements);

          for (var m=0; m<this.columns; m++) {
            var value = this.grid.pos(n,m);

            var item = $('<td/>', {
                id: '' + n + m,
                class: 'item',
                html: value,
                click: function(g,n,m) {
                  return function() {
                    g.itemClicked(n,m);
                  };
                }(this.grid,n,m)
            }).appendTo(column);

            if (value === '') {
              item.addClass('empty');
            }
          }
        }
        return this;
      }
    },
    reset: {
      value: function(size) {
        this.grid.reset(size);
      }
    }
  });


  slider.createGame = function(size) {
    var game = new Game(size);
    game.draw();
    return game;
  };
  return slider;
})(slider || {});

// TODO: need to workout best way to reset the game 
// without redefining all properties
// set grid to shuffle
// then draw

var game = slider.createGame(5);
$('.drop').change(function() {
  // slider.createGame($(this).val());
  game.reset($(this).val());
});
