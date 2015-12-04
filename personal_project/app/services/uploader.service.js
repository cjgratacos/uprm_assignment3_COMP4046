/*
 * Copyright (c) Joe Martella All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

"use strict";

//Service incharge of the uploading process
(function(){
	var Uploader = angular.module('service.uploader',[]);

	Uploader.factory('UploaderService',function(SETTING){

		var fileReader = new FileReader();
		var images = [];
		var filterType = ['image/'];
		var callbackFuncArray = [];

		function filterContainment(fileType){
			var filter = false;
			for (var i = 0; i < filterType.length; i++) {
				if(fileType.indexOf(filterType[i]) > -1){
					filter = true;
				}
			}
			return filter;
		}

		function callbackFuncUpload(category){
			category = category || false;
			if(category){
				for (var i = 0; i < callbackFuncArray.length; i++) {
					if(callbackFuncArray[i].category == category){
						callbackFuncArray[i].callback(images[0]);
					}
				}
			}else{
				for (var i = 0; i < callbackFuncArray.length; i++) {
						callbackFuncArray[i].callback(images[0]);
				}
			}
		}


		var upload = function(file,category,callback){
			if(filterContainment(file.type)){
				var image = new Image();
				callback = callback || false;
				category = category || false;
				fileReader.onloadend = function(event){
					image.src = event.target.result;
				}

				image.onload = function(){
					if(images.length == SETTING.maxHistory+1){
						images.splice(images.length-1,1);
					}
					images.splice(0,0,image);
					//console.log(images);
					callbackFuncUpload(category);
					if(callback){
						 callback(image);
					}
				}

				fileReader.readAsDataURL(file);
				}else{
					callback(false);
				}
		}

		var reUploadFromHistory = function(position,category){
			category = category || false;
			var image = images[position];
			images.splice(position,1);
			images.splice(0,0,image);
			callbackFuncUpload();
		}
		var clearHistory = function(){
			if(images.length>0){
				images.splice(1,images.length);
				callbackFuncUpload();
			}
		}
		
		return{
			getImageHistoryCount:function(){
				return images.length-1;
			},
			getImages:function(){
				return images;
			},
			getImage: function(){
				return images[0];
			},
			getFileReader: function(){
				return fileReader;
			},
			clearHistory:clearHistory,
			upload:upload,
			reUploadFromHistory:reUploadFromHistory,
			executeCallback:callbackFuncUpload,
			registerCallback:function(callbackObj){
				callbackFuncArray.push(callbackObj);
			}
		};
	});
})();