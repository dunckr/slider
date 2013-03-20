var slider = (function(slider){
  var Grid = function() {
    Object.defineProperties(this,{
      grid: {
        value: [],
        writable: true
      },
      sequence: {
        value: [],
        writable: true
      },
      correct: {
        value: [],
        writable: true
      },
      length: {
        value: 0,
        writable: true
      },
      columns: {
        value: 0,
        writable: true
      }
    });
  };

  Object.defineProperties(Grid.prototype,{
    create: {
      value: function(size) {
        this.columns = size;
        this.length = size*size;
        for (var j=1; j<this.length; j++) {
          this.sequence.push(j);
        }
        this.sequence.push('');
        this.correct = this.sequence.join();
        return this;
      }
    },
    pos: {
      value: function(n,m) {
        if (arguments.length === 3) {
          this.grid[n][m] = arguments[2];
        }
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
        var value = this.pos(n,m);
        this.pos(p,q,value);
        this.pos(n,m,'');

        //TOFIX: moving dom element logic shouldn't live here
        //TODO: add moving animation
        $('#' + n + m).addClass('empty')
                  .html('');
        $('#' + p + q).removeClass('empty')
                  .html(value);
        return this;
      }
    }
  });

  var Game = function() {
    Object.defineProperties(this,{
      grid: {
        value: [],
        writable: true
      },
      columns: {
        value: 0,
        writable: true
      },
      elements: {
        value: $('#grid'),
        writable: true
      }
    });
  };
  Object.defineProperties(Game.prototype,{
    create: {
      value: function(size) {
        this.grid = new Grid();
        this.columns = size;
        this.grid.create(size);
        this.grid.shuffle();
        this.grid.structure();
        return this;
      }
    },
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
                
                //TOFIX: Must be a better way to fire this event
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
        $('#grid').empty();
        this.create(size);
        this.draw();
      }
    }
  });


  slider.createGame = function(size) {
    var game = new Game();
    game.create(size);
    game.draw();
    return game;
  };
  return slider;
})(slider || {});

var game = slider.createGame(5);
$('.drop').change(function() {
  game.reset($(this).val());
});
