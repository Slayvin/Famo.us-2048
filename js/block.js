define(['init'],function(Famous) {
    
    function Block(posX, posY, value){
        this.position = {
			x:posX,
			y:posY
		};
        if(!value){
            value = this._getRandomValue();
        }
        this.value = value;
        this.justGrew = false;
        this.modifier = new Famous.StateModifier({
            transform : Famous.Transform.translate(posX*115,posY*115,1),
            opacity: 0
        });
        this.scaleModifier = new Famous.StateModifier({
            transform : Famous.Transform.scale(0,0,1),
            origin:[0.5, 0.5],
            align:[0, 0]
        });
        this.rotationModifier = new Famous.StateModifier({
            transform : Famous.Transform.rotate(0,0,0)
        });
		this.surface = new Famous.Surface({
            content: value,
            size: [100, 100],
            classes: ['block',('_'+value)]
        });
        this.transform = new Famous.ModifierChain();
        this.transform.addModifier(this.scaleModifier, this.rotationModifier, this.modifier);
        this.pop();
    }
    
    Block.prototype = {
        constructor: Block,
        recycle:function(x, y){
            this.value = 2;
            this.position.x = x;
            this.position.y = y;
            this.surface.setContent(this.value);
			this.surface.setClasses(['block',('_'+this.value)]);
            this.justGrew = false;
            this.modifier.setTransform(Famous.Transform.translate(x*115,y*115,1));
            this.modifier.setOpacity(0);
            this.scaleModifier.setTransform(Famous.Transform.scale(0,0,1));
            this.pop();
        },
        _getRandomValue: function(){
            var v = Math.floor(Math.random()*100);
            if(v<=85)
                return 2;
            else
                return 4;
        },
        animGrow:function(){
            this.surface.setContent(this.value);
			this.surface.setClasses(['block',('_'+this.value)]);
            this.justGrew = false;
            this.scaleModifier.setTransform(Famous.Transform.scale(1.2, 1.2, 1),{duration:25, curve: 'easeIn'});
            this.scaleModifier.setTransform(Famous.Transform.scale(1, 1, 1),{duration:75, curve: 'easeOut'});
//            this.rotationModifier.setTransform(Famous.Transform.rotate(0,0,0.2),{duration:220, curve: Famous.Easing.easeOut});
//            this.rotationModifier.setTransform(Famous.Transform.rotate(0,0,0),{duration:180, curve: Famous.Easing.inOutBack});
        },
		grow:function(){
            this.value *= 2;
            this.justGrew = true;
        },
		moveTo:function(x,y, mustHide){
			var block = this;
			var isHidden = mustHide || false;
            this.position.x = x;
			this.position.y = y;
			this.modifier.setTransform(
  				Famous.Transform.translate(x*115,y*115,1),
  				{ duration : 120, curve: 'easeIn' },
				function(){
                    if(isHidden){
                        block.hide();
                    }
                });
            if(isHidden){
                this.modifier.setOpacity(0.15,{duration:100});
            }
		},
        hide:function(){
            this.surface.addClass('hidden');
			this.modifier.setOpacity(0);
        },
        pop:function(){
            this.modifier.setOpacity( 1,
                { duration: 150, curve: Famous.Easing.easeOut}
            );
            this.scaleModifier.setTransform(
                Famous.Transform.scale(1, 1, 1),
                { duration : 150, curve: Famous.Easing.easeOut }
            );
        }
    };
	
	return(Block);
    
});