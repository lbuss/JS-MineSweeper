;(function(){
	var board = null;

	if (typeof MineSweeper === "undefined") {
		window.MineSweeper = function(){
			board = new MineSweeper.Board(10, 4);
			board.render();
			
			var that = this;
			$("#submit").on("click", function(){
				that.newGame().bind(that);
			});
		};
	}
	
	MineSweeper.newGame = function(){
		var message = $l('#size').val();
		$l('#size').html('');
		var message = $l('#bombs').val();
		$l('#bombs').html('');
		this.board = new MineSweeper.Board(size, bombs);
		this.board.render();
	}

	MineSweeper.Board = function(size, bombs){
		//create a board size x size with bombs number of bombs
		this.size = size;
		this.bombs = bombs;
		this.safeTiles = 0;
		this.flagBombs = 0;
		this.time = 0;
		$l('#timer').html(this.time);
		
		this.tiles = [];
		for(var x = 0; x < size; x++){
			this.tiles.push([]);
		}
		
		for(var i = 0; i < size; i++){
			for(var j = 0; j < size; j++){
				this.tiles[i].push(new MineSweeper.Tile(i, j, this));
			}
		}
		
		var bombedTiles = 0;
		while(bombedTiles < bombs){
			//add bomb = true atrribute to random tiles
			var tryX = Math.floor( Math.random() * size);
			var tryY = Math.floor( Math.random() * size);
			if(this.tiles[tryX][tryY].bomb === false){
				this.tiles[tryX][tryY].bomb = true;
				bombedTiles++;
			}
		}
	};

	MineSweeper.Board.prototype.render = function(){
		var domBoard = $l('#board');
		document.getElementById('board').style.height = this.size * 30;
		this.tiles.forEach(function(row) {
			row.forEach(function(tile){
				domBoard.appendChild(tile.render());
			})
		});
	};
	
	MineSweeper.Board.prototype.gameOver = function(){
		clearInterval(this.timer);
		this.tiles.forEach(function(row){
			row.forEach(function(tile){
				if(tile.bomb){
					$l(tile.back).addClass("bombed");
					$l(tile.inside).addClass('flipped');
				}
			})
		})
	};
	
	MineSweeper.Board.prototype.checkVictory = function(){
		if(this.safeTiles >= this.size*this.size - this.bombs || this.flagBombs == this.bombs){
			clearInterval(this.timer);
			alert("You Win!");
		}
	};
	
	MineSweeper.Board.prototype.clock = function(){
		$l('#timer').html(this.time);
		this.time ++;
	};

	MineSweeper.Tile = function(x, y, board){
		//set up a tile object with position and status
		this.flipped = false;
		this.bomb = false;
		this.flagged = false;
		this.count = false;
		this.board = board;
		this.x = x;
		this.y = y;
	};

	MineSweeper.Tile.prototype.render = function(){
		//return tile html object with click events bound to it
		this.inside = document.createElement('div');
		var el = $l(this.inside);
		el.html("<div class='front'></div>");
		this.back = document.createElement('div');
		$l(this.back).addClass('back');
		el.appendChild(this.back);
		el.addClass('tile');
		this.inside.style.top = this.x*30;
		this.inside.style.left = this.y*30;
		var that = this;
		el.on("click", function(e){
			if(!that.board.time){
				that.board.timer = setInterval(that.board.clock.bind(that.board), 100);
			}
			e.preventDefault();
			switch(e.which){
				case 1:
					that.flipTile.bind(that)();
					break;
				case 2:
					that.flagTile.bind(that)();
					break;
			}	
		});
		return this.inside;
	};

	MineSweeper.Tile.prototype.bombCount = function(){
		if(this.count){
			return this.count;
		}
		
		this.count = 0;
		for(var x = this.x-1; x <= this.x + 1; x++){
			for(var y = this.y-1; y <= this.y + 1; y++ ){
				if(x >= 0 && x < this.board.size && y >= 0 && y < this.board.size){
					if(this.board.tiles[x][y].bomb){
						this.count++;
					}
				}
			}
		}
		
		return this.count;
	};
	
	MineSweeper.Tile.prototype.clickTile = function() {
	}
	
	MineSweeper.Tile.prototype.flagTile = function() {
		if(!this.flipped){
			this.flagged = true;
			this.flipped = true;
			if(this.bomb){
				this.board.flagBombs++;
			}
			$l(this.inside).addClass('flipped');
			$l(this.back).addClass('flagged');
			this.board.checkVictory();
		}else if(this.flagged){
			this.flagged = false;
			this.flipped = false;
			if(this.bomb){
				this.board.flagBombs--;
			}
			$l(this.inside).removeClass('flipped');
			$l(this.back).removeClass('flagged');
		}
	}

	MineSweeper.Tile.prototype.flipTile = function() {
		
		if(!this.flipped  && !this.flagged){
			this.flipped = true;
			if(this.bomb){
				this.board.gameOver();
			} else if(this.bombCount() > 0){
				$l(this.back).html(this.bombCount());
				$l(this.inside).addClass('flipped');
				this.board.safeTiles++;
				this.board.checkVictory();
			} else{
				$l(this.inside).addClass('flipped');
				setTimeout(this.flipNeighbors.bind(this), 100);
				this.board.safeTiles++;
				this.board.checkVictory();
			}
		}
	};

	MineSweeper.Tile.prototype.flipNeighbors = function(){
		for(var x = this.x - 1; x <= this.x + 1; x++){
			for(var y = this.y - 1; y <= this.y + 1; y++ ){
				if(x >= 0 && x < this.board.size && y >= 0 && y < this.board.size){
					this.board.tiles[x][y].flipTile();
				}
			}
		}
	};

})();
