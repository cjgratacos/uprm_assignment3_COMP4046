/*
 * Copyright (c) Joe Martella All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

//Scene Service, it is use as an event emitter and data holder, this is due to that angular
//factories are singletons
"use strict";

(function(){
	var Scene = angular.module('service.scene',[]);
	//Creating Factory
	Scene.factory('SceneFactory',function(){
		//Scene Variable
		var sceneGlob = {
			render:false,
			animation:false,//if loop should animate, this is done for reloading when toolbar item changes
			backgroundColor:0x8f8f8f, //scene background option
			wireframe:false, // If wireframe, this is removed for now because of bug.
			meshType:"block" // The type of mesh, if block or ball
		};
		//callback holder
		var callbackList = [];
		return {
			global:function(){ //sceneGlob getter
				return sceneGlob;
			},
			eventRegister:function(callback){ //Event Emitter Register
				callbackList.push(callback);
			},
			eventEmmit:function(){//Event Emitter Emitter
				for (var i = 0; i < callbackList.length; i++) {
					callbackList[i]();
				}
			}
		};
	});
})();