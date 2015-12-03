"use strict";

(function(){
	var Scene = angular.module('service.scene',[]);
	
	Scene.factory('SceneFactory',function(){
		var sceneGlob = {
			render:false,
			animation:false
		};	
		var tooltipPosition = {
			r:-1,
			g:-1,
			b:-1
		};
		
			
		return {
			global:function(){
				return sceneGlob;
			}
		};
	});
})();