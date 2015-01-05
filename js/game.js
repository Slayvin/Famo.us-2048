define(['init','block'],function(Famous, Block) {
    
    // views, surfaces & modifiers
	
	var localModifier = new Famous.StateModifier({
        transform: Famous.Transform.translate(65, 65, 0)
    });
    
    var fadeSurface = new Famous.Surface({
        classes: ['fade']
    });
	var fadeModifier = new Famous.StateModifier({
		transform: Famous.Transform.translate(0, 0, 0),
		opacity: 0
	});
	
	var scoreModifier = new Famous.StateModifier({
        align: [1, 0],
        origin: [1, 0],
        transform: Famous.Transform.translate(0, -90, 0)
    });
    	
    var scoreSurface = new Famous.Surface({
        content: '0',
        size: [200, 80],
        classes: ['score']
    });
	var winMessageElement = document.getElementById('winMessage');
	
	var winMessageSurface = new Famous.Surface({
		content: winMessageElement.innerHTML,
		classes:['message']
    });
	var winMessageModifier = new Famous.StateModifier({
		transform: Famous.Transform.translate(0, 0, 0),
		opacity: 0
	});
    winMessageElement.parentNode.removeChild(winMessageElement);
    
    var loseMessageElement = document.getElementById('loseMessage');
	
	var loseMessageSurface = new Famous.Surface({
		content: loseMessageElement.innerHTML,
		classes:['message']
    });
	var loseMessageModifier = new Famous.StateModifier({
		transform: Famous.Transform.translate(0, 0, 0),
		opacity: 0
	});
	loseMessageElement.parentNode.removeChild(loseMessageElement);
		
	var endGameView = new Famous.View();
	endGameView.add(fadeModifier).add(fadeSurface);
	endGameView.add(winMessageModifier).add(winMessageSurface);
    endGameView.add(loseMessageModifier).add(loseMessageSurface);
    
    // Game class
	function Game(){
        this.tab = [];
        this.usedBlocks = [];
        this.gameGrid = null;
        this.score = 0;
		this.win = false;
		this.continueGame = false;
        this.isReady = false;
		
		var i,j;
		for(i=0; i<4; i++){
			this.tab[i] = [];
			for(j=0; j<4; j++){
				this.tab[i][j] = null;
			}
		}
        
		winMessageSurface.on('click',function(that){return function(){
			that.fadeOutEndMessage();
			that.reset();
		}}(this));
        loseMessageSurface.on('click',function(that){return function(){
			that.fadeOutEndMessage();
			that.reset();
		}}(this));
    }
    
    // Game methods
	Game.prototype = {
        constructor: Game,
        start: function(){
			this.generateBlock();
    		this.generateBlock();
			this.isReady = true;
		},
		reset: function(){
            var i,j;
			var block = null;
			
            for(i=0; i<4; i++){
                for(j=0; j<4; j++){
                    block = this.tab[i][j];
					if (block !== null){
						block.hide();
						this.usedBlocks.push(block);
					}
					this.tab[i][j] = null;
                }
            }
            this.score = 0;
			this.win = false;
			this.continueGame = false;
			this.updateScore();
	   		this.start();
        },
		registerContexts: function(mainContext, headContext){
			this.gameGrid = mainContext.add(localModifier);
            headContext.add(scoreModifier).add(scoreSurface);
//			mainContext.add(fadeModifier).add(fadeSurface);
//			mainContext.add(winMessageModifier).add(winMessage);
			mainContext.add(endGameView);
		},
        updateScore: function(){
            scoreSurface.setContent(this.score);
        },
        _getRandomPos: function(){
           	var position = {x:0, y:0};
			var tile = Math.floor(Math.random()*16);
            var row = Math.floor(tile/4);
			position.x = row;
			position.y = tile-4*row;
			
			return(position);
        },
        _isMovePossible: function(){
            var canMove = false;
            var i=0;
            var j=0;
            while(!canMove && i<4){
                for(j=0; j<3; j++){
                    if(this.tab[i][j] !==null && this.tab[i][j+1] !==null){
                        if(this.tab[i][j].value === this.tab[i][j+1].value)
                            canMove = true;
                    }
                    else
                        canMove = true;
                }
                i++;
            }
            i=0;
            while(!canMove && i<4){
                for(j=0; j<3; j++){
                    if(this.tab[j][i] !==null && this.tab[j+1][i] !==null){
                        if(this.tab[j][i].value === this.tab[j+1][i].value)
                        canMove = true;
                    }
                    else
                        canMove = true;
                }
                i++;
            }
            return canMove;
        },
		addBlock: function(){
            if(!this.win){
				Famous.Timer.setTimeout(function(that){
					return function(){
						that.generateBlock();
                        if(that._isMovePossible())
				            that.isReady = true;
                        else{
                            that.isReady = false;
                            that.endGame(false);
                        }
					}
				}(this),
				200);
			}
        },
        generateBlock: function(value){
			var block = null;
			var pos = this._getRandomPos();
			if(this.tab[pos.x][pos.y] === null){
				var availableBlock = this.usedBlocks.length > 0;
                if(availableBlock){
                    block = this.usedBlocks.shift();
                    block.recycle(pos.x, pos.y);
                }
                else{
                    block = new Block(pos.x, pos.y, value);
                    this.gameGrid.add(block.transform).add(block.surface);
                }
				this.tab[pos.x][pos.y] = block;
			}
			else{
				this.generateBlock(value);
			}					
		},
        applyMove: function(x, y, newPosX, newPosY, block, previousBlock, emptyCells, bVertical){
            var score=0;
            if(previousBlock !== null){                        
                if(previousBlock.value === block.value && !previousBlock.justGrew){
                    previousBlock.grow();
                    score = previousBlock.value;
					if(score === 2048)
						this.win = true;
                    
                    if(bVertical)
                        block.moveTo(x, previousBlock.position.y, true);
                    else
                        block.moveTo(previousBlock.position.x, y, true);
					
                    Famous.Timer.setTimeout(function(){previousBlock.animGrow();}, 120);
					
                    this.usedBlocks.push(block);
                    this.tab[x][y] = null;
                    emptyCells = 0;
                }                            
            }
            if(emptyCells>0){
                block.moveTo(newPosX, newPosY);
                this.tab[newPosX][newPosY] = block;
                this.tab[x][y] = null;
            }
            return(score);
        },
        moveVertically: function(direction){
            var row,col,i;
            var emptyCells = 0;
            var emptyCellFound = false;
            var hasMoved = false;
            var block = null;
            var cell = null;
            var previousBlock = null;
            var score = 0;
            var start = 0;
            if(direction<0){
                start = 3;
            }            
            for(row=0; row<4; row++){
                for(col=0; col<4; col++){
                    block = this.tab[row][start+direction*col];                    
                    if(block !== null){
                        emptyCells = 0;
                        previousBlock = null;
                        for(i=0; i<col; i++){
                            cell = this.tab[row][start+i*direction];
                            if(cell === null){
                                emptyCells++;
                                emptyCellFound = true;
                            }
                            else{
                                previousBlock = cell;
                            }
                        }                        
                        score += this.applyMove(row, start+direction*col, row, (start+direction*col-direction*emptyCells), block, previousBlock, emptyCells, true);
                    }
                }
            }
            if(this.win){
				this.endGame(true);
			}
			if(score>0 || emptyCellFound)
                hasMoved = true;
            if(score>0){
                this.score+=score;
                this.updateScore();
            }
            if(hasMoved){
                this.addBlock();
            }
            else{
                this.isReady = true;
            }
        },
        move: function(x, y){
            var i,j;
			var cell = null;
			var emptyCells = 0;
            var emptyCellFound = false;
			for(i=0; i<4; i++){//0,1,2,3 - 3,2,1,0
                for(j=0; j<4; j++){
                    cell = this.tab[i*y,j*x+j];
                    if(cell === null){
                        emptyCells++;
                        emptyCellFound = true;
                    }
                    else{
                        if(previous!==null){
                            
                        }
                    }
                }
                
            }
        },
        moveHorizontally: function(direction){
            var row,col,i;
            var emptyCells = 0;
            var emptyCellFound = false;
            var hasMoved = false;
            var block = null;
            var cell = null;
            var previousBlock = null;
            var score = 0;
            var start = 0;
            if(direction<0){
                start = 3;
            }            
            for(row=0; row<4; row++){
                for(col=0; col<4; col++){
                    block = this.tab[start+direction*col][row];                    
                    if(block !== null){
                        emptyCells = 0;
                        previousBlock = null;
                        for(i=0; i<col; i++){
                            cell = this.tab[start+direction*i][row];
                            if(cell === null){
                                emptyCells++;
                                emptyCellFound = true;
                            }
                            else{
                                previousBlock = cell;
                            }
                        }
                        score += this.applyMove(start+direction*col, row, (start+direction*col-direction*emptyCells), row, block, previousBlock, emptyCells, false);
                    }
                }
            }
			if(this.win){
				this.endGame(true);
			}
            if(score>0 || emptyCellFound)
                hasMoved = true;
            if(score>0){
                this.score+=score;
                this.updateScore();
            }
            if(hasMoved){
                this.addBlock();
            }
            else{
                this.isReady = true;
            }
        },
		endGame: function(win){
			fadeModifier.setOpacity(0.66,{duration:500});
			fadeModifier.setTransform(Famous.Transform.translate(0,0,10));
			if(win){
                winMessageModifier.setOpacity(1.0,{duration:500});
			    winMessageModifier.setTransform(Famous.Transform.translate(0,0,10));
            }
            else{
                loseMessageModifier.setOpacity(1.0,{duration:500});
			    loseMessageModifier.setTransform(Famous.Transform.translate(0,0,10));
            }
			this.isReady = false;
		},
		fadeOutEndMessage: function(){
			fadeModifier.setOpacity(0.0,{duration:500});
			fadeModifier.setTransform(Famous.Transform.translate(0,0,0));
			winMessageModifier.setOpacity(0.0,{duration:500});
			winMessageModifier.setTransform(Famous.Transform.translate(0,0,0));
            loseMessageModifier.setOpacity(0.0,{duration:500});
			loseMessageModifier.setTransform(Famous.Transform.translate(0,0,0));
//			this.isReady = true;
		}
    };
    
    return(Game);
    
});