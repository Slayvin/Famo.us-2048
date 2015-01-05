require(['init','input','game'], function(Famous, Input, Game){
    
    var backgroundElement = document.getElementById('gameBackground');
    for(var i=0; i<16; i++){
        backgroundElement.appendChild(document.createElement("div"));
    }
    
    var gameContainer = document.getElementById('main');
    var headContainer = document.getElementById('top');
    var mainContext = Famous.Engine.createContext(gameContainer);
    var headerContext = Famous.Engine.createContext(headContainer);
    var inputHandler = new Famous.EventHandler();
	
	inputHandler.subscribe(Input.handler);
	
	inputHandler.on('down', function() {
  		if(game.isReady){
            game.isReady = false;
            game.moveVertically(-1);
        }
	});
	inputHandler.on('up', function() {
  		if(game.isReady){
            game.isReady = false;
            game.moveVertically(1);
        }
	});
	inputHandler.on('left', function() {
        if(game.isReady){
            game.isReady = false;
            game.moveHorizontally(1);
        }
	});
	inputHandler.on('right', function() {
        if(game.isReady){
            game.isReady = false;
            game.moveHorizontally(-1);
        }
	});
    
    var inputModifier = new Famous.StateModifier({
            transform : Famous.Transform.translate(0,0,10),
            opacity: 0.9
        });
    
    mainContext.add(inputModifier).add(Input.surface);
    
	var game = new Game();
	game.registerContexts(mainContext, headerContext);
	game.start();
	
//    Debug:
//    game.generateBlock(4);
//    game.generateBlock(8);
//    game.generateBlock(16);
//    game.generateBlock(32);
//    game.generateBlock(64);
//    game.generateBlock(128);
//    game.generateBlock(256);
//    game.generateBlock(512);
//    game.generateBlock(1024);
//	  game.generateBlock(1024);
//    game.generateBlock(2048);
//	  game.reset();
	
	return(game);

});