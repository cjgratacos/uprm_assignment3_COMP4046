/*
 * Copyright (c) Joe Martella All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

"use strict";
//Service in charge of the Toolbar comunication with the other Modules
(function(){
	var Toolbar = angular.module("service.toolbar",[]);
	
	Toolbar.factory("ToolbarFactory",function(){
		var callbackList =[];
		function emmitCallback(callbackType,value){
			//console.log(callbackType,value);
			for (var i = 0; i < callbackList.length; i++) {
				if(callbackList[i].type == callbackType){
					callbackList[i].callback(value);
				}
				
			}
		}
		function registerCallback(callbackType,callback){
			callbackList.push({type:callbackType,callback:callback});
		}
		return{
			callbackEmmiter:emmitCallback,
			callbackRegister:registerCallback
		};
	});
})();