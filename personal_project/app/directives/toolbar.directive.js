/*
 * Copyright (c) Joe Martella All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

"use strict";

/*
	The Slider used is from //https://github.com/rzajac/angularjs-slider with some customize css for matching color
	The Rest is created by Carlos Gratacos
*/
(function(){
	
	var Toolbar = angular.module('directive.toolbar',['rzModule']);
	//Default IIF Global Variables
	var toolbarFactory, sceneFactory;
	Toolbar.run(function(ToolbarFactory, SceneFactory){
		toolbarFactory = ToolbarFactory;
		sceneFactory = SceneFactory;
	});
	//Function that converts RGB to Hex, acquired from stack overflow, with some changes for optimization
	function rgbToHex(r, g, b) {
		if (r > 255 || g > 255 || b > 255)
			throw "Invalid color component";
		return ((r << 16) | (g << 8) | b).toString(16);
	}
	
	//Tool Function Constructor
	function toolbarDirective(){
		//Toolbar template
		var template="<div flex-container='column'>"
					+"<div>"
					+"<span class='fs-display-1 display-block' flex-align='center'>{{title}}</span>"
					+"</div>"
					+"<div flex-container='row'>"
					+"<div flex-container='row'>"
					+"<div class='ml+ mt' flex-container='column' flex-align=''>"
					+"		<span class='fs-headline display-block'>RGB</span>"
					+"		<div id='rgb-r'>"
					+"			<span class='fs-body-2 display-block'>R: {{tooltip.r_value}}</span>"
					+"		</div>"
					+"		<div id='rgb-g'>"
					+"			<span class='fs-body-2 display-block'>G: {{tooltip.g_value}}</span>"
					+"		</div>"
					+"		<div id='rgb-b'>"
					+"			<span class='fs-body-2 display-block'>B: {{tooltip.b_value}}</span>"
					+"		</div>"
					+"		<div id='xy-cord'><span class='fs-body-1 display-block'>X:{{tooltip.x_coord}}, Y:{{tooltip.y_coord}}</span></div>	"
					+"	</div>"
					+"	<div class='ml++ mt'>"
					+"		<span class='fs-headline display-block'>Mesh Type</span>"
					+"		<div class='radio-group'>"
					+"			<div class='radio-button'>"
					+"				 <input type='radio' id='ball'  ng-click='updateMeshType()' value='ball' ng-model='meshType' class='radio-button__input tc-blue-400' checked>"
	   	 			+"				<label for='ball' class='radio-button__label'>Circle</label>"
					+"				<span class='radio-button__help'>Histogram pixel will appear as circles</span>"
					+"			</div>"
					+"			<div class='radio-button'>"
					+"				 <input type='radio' id='block' ng-model='meshType'  ng-click='updateMeshType()' value='block' class='radio-button__input'>"
	   	 			+"				<label for='block' class='radio-button__label'>Blocks</label>"
					+"				<span class='radio-button__help'>Histogram pixel will appear as square blocks</span>"
					+"			</div>"
					+"		</div>"
					+"	</div>"
					+"	<div class='ml++ mt'>"
					+"		<span class='fs-headline display-block'>Background Color</span>"
					+"		<rzslider rz-slider-model='slider.value' rz-slider-options='slider.options'></rzslider>"
					+"	</div>"
					+"</div></div></div>";
		//fucntion linker			
		var link = function(scope,element,attr){
			scope.title = "Toolbar";
			scope.slider = {//slider object 
				value:0,
				max:255,
				options:{
					step:1,
					floor:0,//min
					ceil:255,//max
					onChange:function(){//slider callback for when onchange
						sceneFactory.global().backgroundColor = "#"+rgbToHex(scope.slider.value,scope.slider.value,scope.slider.value);
						sceneFactory.global().animation = true;
						sceneFactory.eventEmmit();
					}
				}
			};
			//Tooltip Object
			scope.tooltip={
				r_value: 0,
				g_value: 0,
				b_value: 0,
				x_coord: 0,
				y_coord: 0			
				};
				//Registering a callback to the toolbar factory
				toolbarFactory.callbackRegister('toolbar.tooltip',function(value){
					//Update tooltip
					scope.tooltip.r_value = value.r || scope.tooltip.r_value;
					scope.tooltip.g_value = value.g || scope.tooltip.g_value;
					scope.tooltip.b_value = value.b || scope.tooltip.b_value;
					scope.tooltip.x_coord = value.x || scope.tooltip.x_coord;
					scope.tooltip.y_coord = value.y || scope.tooltip.y_coord;
			});
			//Default Variables
			scope.meshType ="block";
			scope.wireframeOption = {value:true};
			//creating function
			scope.updateMeshType = function(){
				if(sceneFactory.global().meshType != scope.meshType){
					sceneFactory.global().meshType = scope.meshType;
					sceneFactory.animation = true;
					//console.log(sceneFactory.global());
					sceneFactory.eventEmmit();
				}
			}
		}
		//Returning Angular ODM
		return{
			restricted:"E",
			scope:{
			},
			template:template,
			link:link
		};
	}
	
	Toolbar.directive('toolbarCanvas',toolbarDirective);
})();