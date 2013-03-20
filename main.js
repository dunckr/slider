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
      }
    });
    Object.defineProperties(Grid.prototype,{
      pos: {
        value: function(n,m) {
          return this.grid[n][m];
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
              if (i%size === 0 && i !== 0) {
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
          var max = size - 1;
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
            }
          }
        }
      },
      swap: {
        value: function(n,m,p,q) {
          var value = grid[n][m];
          grid[p][q] = value;
          grid[n][m] = '';

          // TODO - moving dom elements logic shouldn't be here
          var first = $('#' + n + m);
          first.html('');
          first.addClass('empty');

          var second = $('#' + p + q);
          second.html(value);
          second.removeClass('empty');
        }
      }
    });
  };

  var Game = function(size) {
    var grid = new Grid(size);
    grid.shuffle();
    grid.structure();

    Object.defineProperties(this,{
      grid: {
        value: grid
      },
      elements: {
        value: $('#grid')
      }
    });
    Object.defineProperties(Game.prototype,{
      draw: {
        value: function() {
          var item = 0;
          for (var n=0; n<size; n++) {
            var column = document.createElement("tr");
            column.className = 'columns';
            this.elements.append(column);

            for (var m=0; m<size; m++) {
              var value = this.grid.pos(n,m);
              item = document.createElement("td");
              item.id = n + '' + m;
              item.className = 'item';
              if (value === '') {
                item.className = item.className + ' empty';
              }
              item.innerHTML = value;
              item.addEventListener('click',function(g,n,m) {
                return function() {
                    g.itemClicked(n,m);
                };
              }(this.grid,n,m),false);

              column.appendChild(item);
            }
          }
        }
      }
    });
  };

  slider.createGame = function(size) {
    var game = new Game(size);
    game.draw();
    return game;
  };
  return slider;
})(slider || {});

$('.drop').change(function() {
  slider.createGame($(this).val());
});
var s = slider.createGame(5);