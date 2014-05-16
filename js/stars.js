
var WIDTH;
var HEIGHT;
var canvas;
var con;
var g;
var rint = 40;
var stars;
var delay = true;
var counter = 0;
setInterval(function () {
  ++counter;
  if (counter > 0) {
  	delay = false;
  }
}, 1000);

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                              
var pxs = [];

$(document).ready(function(){

  bigBang(); // creating life and the universe and stuff

  $( window ).resize(function() {
    WIDTH = $('#area').width();
    $(canvas).attr('width', WIDTH).attr('height',WIDTH);
    stars = WIDTH * .15;
  });


});

function bigBang() {
  WIDTH = $('#area').width();
  HEIGHT = $('#area').height();
  
  canvas = document.getElementById('space');
  $(canvas).attr('width', WIDTH).attr('height',HEIGHT);
  
  con = canvas.getContext('2d');
  stars = WIDTH * 0.25;
  for(var i = 0; i < stars; i++) {
    pxs[i] = new Body();
    pxs[i].reset();
  }
  
  draw();
 
}

function draw() {
  con.clearRect(0,0,WIDTH,HEIGHT);
  for(var i = 0; i < pxs.length; i++) {
    pxs[i].fadeLong();
    pxs[i].move();
    pxs[i].draw();
  }
  window.requestAnimationFrame(draw);
}

colors = [
  'rgb(249,72,78)',
  'rgb(244,200,161)',
  'rgb(138,247,189)',
  'rgb(114,249,119)',
  
  'rgb(184,214,212)',
  'rgb(216,223,211)',
  'rgb(243,227,210)',
  'rgb(249,191,166)',
  'rgb(251,163,163)'
  
  ];

function Body() {
  var planet, x, y, r, dx, dy, dr, life, superfar, dying, fadeIn, opacity, color, moons = [];
  
  this.reset = function(kill) {
  	planet = (Math.random() <= 0.05);
    x = (WIDTH*Math.random());
    y = (HEIGHT*Math.random());
    r = Math.random() * 3 + .1;
    
    if(planet){
      r = Math.random() * 5 + 1.0;
      color = colors[~~(Math.random() * 20) % colors.length];
      this.createMoons();
    }
    
    var shooting_star = (Math.random() <= 0.04);

  	if (shooting_star==true) {
  		dx = (Math.random() > 0.5 ? -1 : 1) * Math.random() * 8;
      dy = (Math.random() > 0.5 ? -1 : 1) * Math.random() * 8;
  	}
  	else {
  		dx = (Math.random() > 0.5 ? -1 : 1) * Math.random() * 0.2;
      dy = (Math.random() > 0.5 ? -1 : 1) * Math.random() * 0.2;
  	}
    
    dr = 0;
    if(Math.random() < 0.05){
      dr = (Math.random() > 0.5 ? -1 : 1 ) * Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
    life = true;
    dying = 0 + (Math.random() * (1000 - 0));
    fadeIn = true;
   	opacity = Math.random();
   	
   	superfar = (Math.random() < 0.1);
  };
  
  this.createMoons = function(){
    var num = ~~(Math.random() * 4);
    var dis = 8;
    for(var i = 0 ; i < num ; i++){
      moons.push(new Moon( dis, ~~(Math.random() * r/2.0) + (r/3.0)));
      dis += 5;
    }
  };
  
  this.fadeLong = function() {
    if(superfar) return;
    if (fadeIn) {
      if (opacity >= 1) {
        fadeIn = false;
      }
      else {
        var push = 0.001 * (Math.random() * 2 + 0.1);
        opacity += push;
      }
    }
    else {
      if (opacity <= 0) {
        fadeIn = true;
        this.reset(true);
      }
      else {
        var push = 0.001 * (Math.random() * 2 + 0.1);
        opacity -= push;
      }
    }
  
  };
  
  this.draw = function() {
    con.beginPath();
     
    if (planet===true) {
      con.fillStyle = color;
      con.shadowColor   = 'rgba(166,40,34,1)';
      con.arc(x - 5, y - 5, 5, 0, 2 * Math.PI, false);
    }
    else {
      con.fillStyle = 'rgba(226,225,142,'+opacity+')';
      con.shadowColor   = 'rgba(226,225,142,1)';
     // con.rect(x,y,r,r);
      con.arc(x - r, y - r, r, 0, 2 * Math.PI, false);
    }
    
    con.closePath();
    con.shadowOffsetX = 0;
    con.shadowOffsetY = 0;
    con.shadowBlur    = 10;
    con.fill();
    
    if(moons){
        moons.forEach(function(moon){
          moon.draw();
        });
      }
  };
  
  this.move = function() {
    if(superfar) return;
    x += dx;
    y += dy;
    r += dr;
    if(moons){
      moons.forEach(function(moon){
          moon.move(this);
        }, this);
    }
    if(r < 0 || r > 30)
      opacity-=0.025;
    if(x > WIDTH || x < 0 || opacity <= 0 || r < 0) this.reset(kill=true);
    if(y > HEIGHT || y < 0) this.reset(kill=true);
  };

  this.getX = function() { return x - 2*r; }
  this.getY = function() { return y - 2*r; }
}

var Moon = function(r, size){

  var angle = 0, da = Math.sqrt((2*Math.PI)/(300*r)), x, y, moonR;
  this.setup = function(){
      moonR = size/2.0;
  }();
  
  this.move = function(mom){
    x = mom.getX() + Math.cos(angle) * r;
    y = mom.getY() + Math.sin(angle) * r;
    angle += da;
  };
  
  this.draw = function(){
    con.beginPath();
    con.fillStyle = 'white';
    con.shadowColor   = 'rgba(166,40,34,1)';
    con.arc(x - moonR, y - moonR, moonR, 0, 2 * Math.PI, false);
    
    con.closePath();
    con.shadowOffsetX = 0;
    con.shadowOffsetY = 0;
    con.shadowBlur    = 10;
    con.fill();
  };
};