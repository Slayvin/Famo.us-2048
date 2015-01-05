define(function(require, exports, module) {
    
	// import dependencies
    var Famous = {
        Engine : require('famous/core/Engine'),
        Surface : require('famous/core/Surface'),
        View : require('famous/core/View'),
        ModifierChain : require('famous/modifiers/ModifierChain'),
        Transform : require('famous/core/Transform'),
        StateModifier : require('famous/modifiers/StateModifier'),
        Transitionable : require('famous/transitions/Transitionable'),
        Easing : require('famous/transitions/Easing'),
        TouchSync : require("famous/inputs/TouchSync"),
		EventHandler : require('famous/core/EventHandler'),
        Timer : require('famous/utilities/Timer')
    };

//    Famous.Engine.setOptions({ appMode: false });
    
    return(Famous);

});