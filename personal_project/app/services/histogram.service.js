"use strict";

(function(){
	var Histogram = angular.module('service.histogram',[]);
	
	
	
	
	var PointInfo = {
			bytesPerChannel: 4 | 0,
			type: Uint8Array,
			bytesPerPoint: 1,
			size:2*4
		};
	

	
	Histogram.factory('HistogramFactory',function(){
		
		
		//Histogram Data Manager
		var histogramData;
		var histogramRatio = Math.pow(2, 8-PointInfo.bytesPerChannel);
		
		var init = function(width, height, imageData){
			if(histogramData ==null) histogramData = new PointInfo.type(Math.pow(2,3*PointInfo.bytesPerChannel)) ;
			else reset();
			console.log(imageData,histogramData,histogramRatio);
			for(var x = 0; x < width;x++){
				for(var y = 0; y < height;y++){
					var id = 4 * (x + (y * width));
					 var point = convertColorToPoint([imageData.data[id],imageData.data[id+1],imageData.data[id+2]]);		
					 var index = convertPointToIndex(point);
					 histogramData[index] += 1;
					 
				}
			}
			logHistory();
			return this;
		};
		
		function logHistory(){
			for (var i = 0; i < histogramData.length; i++) {
				if(histogramData[i]>0) console.log({index:i,value:histogramData[i]});
			}
		}
		function HistogramPixels(imageData){
				
		}
		function convertColorToPoint(rgb){
			var r = rgb[0], g = rgb[1], b = rgb[2];
			r = r/histogramRatio | 0;
			g = g/histogramRatio | 0;
			b = b/histogramRatio | 0;
			return [r,g,b];
		}
		function convertPointToColor(point){
			var r = point[0], g=point[1], b = point[2];
			r = (r+0.5)*histogramRatio;
			g = (g+0.5)*histogramRatio;
			b = (b+0.5)*histogramRatio;
			return [r,g,b];
		}
		function convertPointToIndex(point){
			var r =point[0], g=point[1],b=point[2];
			return r*PointInfo.size*PointInfo.size + g*PointInfo.size + b;//rx^2+gx+b
		}
		function convertIndexToPoint(index){//the inverse of rx^2+gx+b, going back
			var x = (index/(histogramRatio*histogramRatio)) |0;
			var w = index - x*histogramRatio*histogramRatio;
			var y = (w / histogramRatio) |0;
			var z = w - y*histogramRatio;
			return [x,y,z];
		}
		function reset(){
			for (var i = 0; i < histogramData.length; i++) {
				histogramData[i] = 0
			}
			return this;
		}
		function convertIndexToColor(index){
			return convertPointToColor(convertIndexToPoint(index));
		}
		
		function getPoint(point){
				return histogramData[convertPointToIndex(point)];
		}
		function getColor(rgb){
			return getPoint(convertColorToPoint(rgb));
		}
		function getMax(){
			var max = 0;
			for (var i = 0; i < histogramData.length; i++) {
				if(histogramData[i] > max){
					max = histogramData[i];
				}
			}
			return max;
		}
		return {
			init:init
		};
	});
})();