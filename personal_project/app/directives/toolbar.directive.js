"use strict";

/*
	The Slider used is from //https://github.com/rzajac/angularjs-slider with some customize css for matching color
*/
(function(){
	
	var Toolbar = angular.module('directive.toolbar',['rzModule']);
	
	function toolbarDirective(){
		var template="<div flex-container='column'>"
					+"<div>"
					+"<span class='fs-display-1 display-block' flex-align='center'>{{title}}</span>"
					+"</div>"
					+"<div flex-container='row'>"
					+"<div flex-container='row'>"
					+"<div class='ml+ mt' flex-container='column' flex-align=''>"
					+"		<span class='fs-headline display-block'>RGB</span>"
					+"		<div id='rgb-r'>"
					+"			<span class='fs-body-2 display-block'>R: {{r_value}}</span>"
					+"		</div>"
					+"		<div id='rgb-g'>"
					+"			<span class='fs-body-2 display-block'>G: {{g_value}}</span>"
					+"		</div>"
					+"		<div id='rgb-b'>"
					+"			<span class='fs-body-2 display-block'>B: {{b_value}}</span>"
					+"		</div>"
					+"	</div>"
					+"	<div class='ml++ mt'>"
					+"		<span class='fs-headline display-block'>Mesh Type</span>"
					+"		<div class='radio-group'>"
					+"			<div class='radio-button'>"
					+"				 <input type='radio' id='circleMesh' name='meshType' value='1' class='radio-button__input tc-blue-400' checked>"
	   	 			+"				<label for='circleMesh' class='radio-button__label'>Circle</label>"
					+"				<span class='radio-button__help'>Histogram pixel will appear as circles</span>"
					+"			</div>"
					+"			<div class='radio-button'>"
					+"				 <input type='radio' id='blockMesh' name='meshType' value='2' class='radio-button__input'>"
	   	 			+"				<label for='blockMesh' class='radio-button__label'>Blocks</label>"
					+"				<span class='radio-button__help'>Histogram pixel will appear as square blocks</span>"
					+"			</div>"
					+"		</div>"
					+"	</div>"
					+"	<div class='ml++ mt'>"
					+"		<span class='fs-headline display-block'>Background Color</span>"
					+"		<rzslider rz-slider-model='slider.value' rz-slider-options='slider.options'></rzslider>"
					+"	</div>"
					+"	<div class='ml++ mt'>"
					+"		<span class='fs-headline display-block'>Options</span>"
					+"		<div class='switch'>"
					+"			 <input type='checkbox' id='wireframe' class='switch__input' checked>"
					+"			 <label for='wireframe' class='switch__label'>Wireframe</label>"
					+"		</div>"
					+"	</div></div></div></div>";
					
		var link = function(scope,element,attr){
			scope.title = "Toolbar";
			scope.slider = {
				value:0,
				max:255,
				options:{
					step:1,
					floor:0,
					ceil:255,
					onChange:function(){
						console.log(scope.slider.value);
					}
				}
			};
			
			scope.r_value = 255;
			scope.g_value = 255;
			scope.b_value = 255;
			
			var onChange = function(category,value){
				
			};
			var onChangeMeshType = function(value){
				
			};
			
			var onChangeOptions = function(value){
				
			};
			
		}
		return{
			restricted:"E",
			scope:{
				uploaderFunc:'&'
			},
			template:template,
			link:link
		};
	}
	
	Toolbar.directive('toolbarCanvas',toolbarDirective);
})();