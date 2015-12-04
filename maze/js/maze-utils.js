/*
 * Copyright (c) Joe Martella All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function doubleTimesSum(x,y){
    return x*x + y*y; 
}

function distance(x1,y1,x2,y2) {
    return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
