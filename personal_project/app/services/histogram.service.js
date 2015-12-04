/*
 * Copyright (c) Joe Martella All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

"use strict";
//Fucntion where the Histogram Scene logic is Handle and creaded, is Module Factory Service
//The main Idea behinf this Factory is to use image Quantization between cube coordinate, coordinate array in index of 1 dimension, and coordinate color
(function(){
	var Histogram = angular.module('service.histogram',[]);
	
	
	
	//Default point information
	var PointInfo = {
			bytesPerChannel: 4,
			type: Uint8Array,
			bytesPerPoint: 1,
			size:Math.pow(2,4)
		};
	//Default Grid information, the size of each square where the pixel will be located
	var GridInfo = {
			viewSize:3
	};
	//Box object
	var Box = {
		black:{
			point: new THREE.Vector3(0,0,0),
			color: new THREE.Color("black")
		},
		green:{
			point: new THREE.Vector3(0,1,0),
			color: new THREE.Color("green")
		},
		blue:{
			point: new THREE.Vector3(0,0,1),
			color: new THREE.Color("blue")
		},
		cyan:{
			point: new THREE.Vector3(0,1,1),
			color: new THREE.Color("cyan")
		},
		magenta:{
			point: new THREE.Vector3(1,0,1),
			color: new THREE.Color("magenta")
		},
		red:{
			point: new THREE.Vector3(1,0,0),
			color: new THREE.Color("red")
		},
		yellow:{
			point: new THREE.Vector3(1,1,0),
			color: new THREE.Color("yellow")
		},
		white:{
			point: new THREE.Vector3(1,1,1),
			color: new THREE.Color("white")
		}
	}
	
	//Histogram Factory initializer
	Histogram.factory('HistogramFactory',function(){
		
		//Histogram Data Manager
		var histogramData;
		var histogramRatio = Math.pow(2, 8-PointInfo.bytesPerChannel);
		
		//Function Initializer
		var init = function(width, height, imageData){
			if(histogramData ==null) histogramData = new PointInfo.type(Math.pow(2,3*PointInfo.bytesPerChannel)) ;
			else reset();
			//Loop around Image Data Pixels
			for(var id = 0; id < imageData.data.length;id+=4){
				 var point = convertColorToPoint([imageData.data[id],imageData.data[id+1],imageData.data[id+2]]);		
					 var index = convertPointToIndex(point);
					 histogramData[index] = histogramData[index] + 1;
			}
			//logHistory();
			return this;
		};
		//Debug function
		function logHistory(){
			var i;
			for (i = 0; i < histogramData.length; i++) {
				if(histogramData[i]>0) console.log({index:i,value:histogramData[i]});
			}
			console.log("counted: ",i-1);
		}
		//Converting cube color RGB to cube Point
		function convertColorToPoint(rgb){
			var r = rgb[0], g = rgb[1], b = rgb[2];
			var x = r/histogramRatio | 0;
			var y = g/histogramRatio | 0;
			var z = b/histogramRatio | 0;
			return [x,y,z];
		}
		//Converting from cube point to cube color
		function convertPointToColor(point){
			var r = point[0], g=point[1], b = point[2];
			r = (r+0.5)*histogramRatio;
			g = (g+0.5)*histogramRatio;
			b = (b+0.5)*histogramRatio;
			return [r,g,b];
		}
		//converting from cube point to array index
		function convertPointToIndex(point){
			var r =point[0], g=point[1],b=point[2];
			return r*PointInfo.size*PointInfo.size + g*PointInfo.size + b;//rx^2+gx+b
		}
		//converting from array index to cube point
		function convertIndexToPoint(index){//the inverse of rx^2+gx+b, going back
			var x = (index/(PointInfo.size*PointInfo.size)) | 0;
			var w = index - x*PointInfo.size*PointInfo.size;
			var y = (w / PointInfo.size) | 0;
			var z = w - y*PointInfo.size;
			return [x,y,z];
		}
		//Function to reset the array that holds the pixes for the cude
		function reset(){
			for (var i = 0; i < histogramData.length; i++) {
				histogramData[i] = 0
			}
			return this;
		}
		//Converting from array index to cube color
		function convertIndexToColor(index){
			return convertPointToColor(convertIndexToPoint(index));
		}
		//Getting point 
		function getPoint(point){
			return histogramData[convertPointToIndex(point)];
		}
		//Getting color
		function getColor(rgb){
			return getPoint(convertColorToPoint(rgb));
		}
		//Getting the pixel that most appeareds
		function getMax(){
			var max = 0;
			for (var i = 1; i < histogramData.length; i++) {
				max = Math.max(histogramData[i],max);
			}
			return max;
		}
		//Function that created the cornes of the Cube
		function cornerCreator(geometry,color,position){
			var corner = new THREE.Mesh(geometry,new THREE.MeshPhongMaterial({color:color,side:THREE.DoubleSide}));
			corner.position.set(position[0],position[1],position[2]);
			return corner;
		}
		//Function that creates the Cube in the Scene
		function createBox(boxOptions,scene){
			var light = new THREE.HemisphereLight(0xffffff, 0x808080);
			light.position.set(0,GridInfo.viewSize,0);
			scene.add(light);
			
			if(boxOptions.showBox){
				var cubeGeometry = new THREE.Geometry();
				cubeGeometry.vertices.push(
					//Black Connections
					Box.black.point,Box.green.point,
					Box.black.point,Box.blue.point,
					Box.black.point,Box.red.point,
					//Blue Connections
					Box.blue.point,Box.cyan.point,
					Box.blue.point,Box.magenta.point,
					//Red Connections
					Box.red.point,Box.yellow.point,
					Box.red.point,Box.magenta.point,
					//Green Connections
					Box.green.point,Box.yellow.point,
					Box.green.point,Box.cyan.point,
					//White Connections
					Box.white.point,Box.cyan.point,
					Box.white.point,Box.yellow.point,
					Box.white.point,Box.magenta.point
				);
				cubeGeometry.colors.push(
					//Black Connections
					Box.black.color,Box.green.color,
					Box.black.color,Box.blue.color,
					Box.black.color,Box.red.color,
					//Blue Connections
					Box.blue.color,Box.cyan.color,
					Box.blue.color,Box.magenta.color,
					//Red Connections
					Box.red.color,Box.yellow.color,
					Box.red.color,Box.magenta.color,
					//Green Connections
					Box.green.color,Box.yellow.color,
					Box.green.color,Box.cyan.color,
					//White Connections
					Box.white.color,Box.cyan.color,
					Box.white.color,Box.yellow.color,
					Box.white.color,Box.magenta.color
				);
				//Creating the lines
				var cube = new THREE.Line(cubeGeometry,new THREE.LineBasicMaterial({
					color: 0x101010,
					linewidth:2,
					transparent:true,
					opacity:0.5
				}),THREE.LinePieces);
				cube.scale.set(GridInfo.viewSize,GridInfo.viewSize,GridInfo.viewSize);
				cube.position.set(-GridInfo.viewSize/2,-GridInfo.viewSize/2,-GridInfo.viewSize/2);
				scene.add(cube);
			}
			
			var geometry = boxOptions.cornerShape =="cube"?new THREE.BoxGeometry(0.02*GridInfo.viewSize,0.02*GridInfo.viewSize,0.02*GridInfo.viewSize):
														   new THREE.SphereGeometry(0.02*GridInfo.viewSize);
			//Adding Colors Corners to the box
			scene.add(cornerCreator(geometry,0x000000,[-GridInfo.viewSize/2,-GridInfo.viewSize/2,-GridInfo.viewSize/2]));
			scene.add(cornerCreator(geometry,0x00ff00,[GridInfo.viewSize/2,-GridInfo.viewSize/2,-GridInfo.viewSize/2]));
			scene.add(cornerCreator(geometry,0x0000ff,[-GridInfo.viewSize/2,GridInfo.viewSize/2,-GridInfo.viewSize/2]));
			scene.add(cornerCreator(geometry,0x00ffff,[GridInfo.viewSize/2,GridInfo.viewSize/2,-GridInfo.viewSize/2]));
			scene.add(cornerCreator(geometry,0xff00ff,[-GridInfo.viewSize/2,GridInfo.viewSize/2,GridInfo.viewSize/2]));
			scene.add(cornerCreator(geometry,0xff0000,[-GridInfo.viewSize/2,-GridInfo.viewSize/2,GridInfo.viewSize/2]));
			scene.add(cornerCreator(geometry,0xffff00,[GridInfo.viewSize/2,-GridInfo.viewSize/2,GridInfo.viewSize/2]));
			scene.add(cornerCreator(geometry,0xffffff,[GridInfo.viewSize/2,GridInfo.viewSize/2,GridInfo.viewSize/2]));
			
			return this;
		}
		
		//Fucntion that created and display on the scene the pixels on the 3D histogram
		function histogramCreateObject(elementOptions,scene){
			//Default Variables
			var max = getMax();
			var gridNumber = Math.pow(2,PointInfo.bytesPerChannel);
			var gridSize = GridInfo.viewSize/gridNumber;
			var offset = 0.2;
			var elementIsSphere=  !!(elementOptions.style == "ball");
			var geometry = !elementIsSphere?new THREE.BoxGeometry(gridSize, gridSize, gridSize): new THREE.SphereGeometry(gridSize/2,gridNumber/2,gridNumber/2);
				//Calculating 
				var vertice,value,point_x,point_y,point_z,difference, element,elementColor;
				console.log(max,gridNumber,gridSize);
				for(var i = 0; i < histogramData.length;i++){//Loop the pixel array and analyze
					value = histogramData[i];
					var color =convertIndexToColor(i);
					point_x = color[1]/255;
					point_y = color[2]/255;
					point_z = color[0]/255; 
					difference = value/max;
					//if (i < 200)console.log(value,color,point_x,point_y,point_z);
					var opacity = !elementIsSphere?offset+(1-offset)*difference:offset+(1-offset)*(1-difference);
					vertice = createElementParticle([point_x,point_y,point_z]);
					if(value > 0){//Dont add if no pixel was found
						elementColor = new THREE.Color().setRGB(point_z,point_x,point_y);
						element = new THREE.Mesh(geometry,new THREE.MeshPhongMaterial({
							color:elementColor,
							opacity: opacity,
							wireframe:elementOptions.wireframe,
							transparent:true,
							side:THREE.DoubleSide
						}));
						element.position.copy(vertice);
						
						scene.add(element);
						console.log(element);
					}
					
				}
			return this;
		}
		//Function that creates a Particle (Pixel)
		function createElementParticle(point){
			return new THREE.Vector3(
				(point[0]-0.5)*GridInfo.viewSize,
				(point[1]-0.5)*GridInfo.viewSize,
				(point[2]-0.5)*GridInfo.viewSize
			);
		}
		return {//Factory function that can only be accessed
			init:init,
			createObjects:histogramCreateObject,
			createBox:createBox
		};
	});
})();