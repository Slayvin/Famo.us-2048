define(['init'],function(Famous) {
    
    var Gestures = new Famous.TouchSync();
    var touchSurface = new Famous.Surface({
//        classes: ['bordered']
        properties:{zIndex:1}
    });
    var deltas = [];
    var direction = '';
    
	var inputHandler = new Famous.EventHandler();
    
    Gestures.on('update', function(data){
        if(data.delta[0]>10){
            // RIGHT
//            console.log(data.delta[0]);
            direction = 'right';
        }
        if(data.delta[0]<-10){
            // LEFT
//            console.log(data.delta[0]);
            direction = 'left';
        }        
        if(data.delta[1]>10){
            // DOWN
//            console.log(data.delta[1]);
            direction = 'down';
        }
        if(data.delta[1]<-10){
            // UP
//            console.log(data.delta[1]);
            direction = 'up';
        }
        
    });
    Gestures.on('end', function(data){   
//        console.log('stop');
        switch(direction){
                case 'down':
                    inputHandler.emit('down');
					break;
                case 'up':
                    inputHandler.emit('up');
					break;
                case 'left':
                    inputHandler.emit('left');
					break;
                case 'right':
                    inputHandler.emit('right');
					break;
        }
        direction = '';
    });
    
    Famous.Engine.on('keyup', function(key) {
        // console.log('pressed: '+key.which);
        var keyPressed = Number(key.which);
        switch(keyPressed){
                case 40:
                    inputHandler.emit('down');
					break;
                case 38:
                    inputHandler.emit('up');
					break;
                case 37:
                    inputHandler.emit('left');
					break;
                case 39:
                    inputHandler.emit('right');
					break;
        }
    });
    Famous.Engine.on('keydown', function(key) {
        //prevent from scrolling with arrow keys
        var keyPressed = Number(key.which);
        switch(keyPressed){
                case 40:
                case 38:
                case 37:
                case 39: key.preventDefault();
        }
    });
    
    touchSurface.pipe(Gestures);
    
    var input = {
		surface : touchSurface,
		handler: inputHandler
	};
	
	return(input);

});