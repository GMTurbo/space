
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
    WIDTH = $('#space').width();
    $(canvas).attr('width', WIDTH).attr('height',WIDTH);
    stars = WIDTH * .15;
  });


});

function bigBang() {
  WIDTH = $('#space').width();
  HEIGHT = $('#space').height();
  
  canvas = document.getElementById('space-content');
  $(canvas).attr('width', WIDTH).attr('height',HEIGHT);
  
  con = canvas.getContext('2d');
  stars = WIDTH * 0.25;
  for(var i = 0; i < stars; i++) {
    pxs[i] = new Body();
    if(i == 0) pxs[i].makeSystem();
    else
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
  var planet, x, y, r, dx, dy, dr, life, superfar, dying, fadeIn, opacity, color, system, planets = [], moons = [];
  
  this.system = function() {
    if(Math.random() <= 0.005){
      system = true;
      this.makeSystem();
    }
  };
  
  this.makeSystem = function(){
    console.log('beep boop: make system human\n');
    //to make a system we just reuse the moon feature, we just recurse
    // on the mofo
    // we'll make the systems stationary
    system = true;
    dx = 0;//(Math.random() > 0.5 ? -1 : 1) * Math.random() * 0.2;
    dy = 0;//(Math.random() > 0.5 ? -1 : 1) * Math.random() * 0.2;
    
    var pNum = 5;
    planets = [];
    for(var i = 0 ; i < pNum ; i++){
      planets.push({
        color: colors[~~(Math.random() * 20) % colors.length],
        dis: i * 30,
        size: i == 2 ? 20 : getRandomIn(8, 16),
        moonCnt: getRandomIn(1,4),
        moons: [],
        body: null
      });
    }
    
    planets.forEach(function(plnt){
      plnt.body = new Moon( plnt.dis, plnt.size);
      var dis = 7;
      for(var i = 0 ; i < plnt.moonCnt; i++){
        var r = getRandomIn(1,4);
        plnt.moons.push(new Moon( dis, ~~(Math.random() * r/2.0) + (r/3.0)));
        dis+=5;
      }
    }, this);
    
    var center = planets[2].body;
    center.x = (WIDTH/2);
    center.y = (HEIGHT/2);
    
  };
  
  this.createPlanet = function(){
    planet = true;
    x = (WIDTH*Math.random());
    y = (HEIGHT*Math.random());
    
    r = getRandomIn(1.0, 5.0);
    color = colors[~~(Math.random() * 20) % colors.length];
    this.createMoons(1);
    
  	dx = (Math.random() > 0.5 ? -1 : 1) * Math.random() * 0.2;
    dy = (Math.random() > 0.5 ? -1 : 1) * Math.random() * 0.2;

    dr = 0;
    if(Math.random() < 0.025){
      dr = (Math.random() > 0.5 ? -1 : 1 ) * Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
    life = true;
    dying = 0 + (Math.random() * (1000 - 0));
    fadeIn = true;
   	opacity = Math.random();
   	
   	superfar = (Math.random() < 0.1);
  };
  
  this.createStar = function(){
    
    x = (WIDTH*Math.random());
    y = (HEIGHT*Math.random());
    r = getRandomIn(0.1, 3);
    
    planet = false;
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
    if(Math.random() < 0.025){
      dr = (Math.random() > 0.5 ? -1 : 1 ) * Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
    life = true;
    dying = 0 + (Math.random() * (1000 - 0));
    fadeIn = true;
   	opacity = Math.random();
   	
   	superfar = (Math.random() < 0.1);
  };
  
  this.reset = function() {
    
    // if(system === undefined)
    //   this.system();
    
    // if(system) return;
    
  	planet = (Math.random() <= 0.05);
    
    if(planet){
      this.createPlanet();
    }else{
      this.createStar();
    }

  };
  
  this.createMoons = function(number){
    var num = number ? number : ~~(Math.random() * 4);
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
    
    if(system){ this.drawSystem(); return;}
    
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
  
  this.drawSystem = function(){
    
    planets.forEach(function(p){
      
      con.beginPath();
      con.fillStyle = color;
      con.shadowColor   = p.color;
      con.arc(p.body.getX() - p.size/2, p.body.getY() - p.size/2, p.size/2, 0, 2 * Math.PI, false);
      
      con.closePath();
      con.shadowOffsetX = 0;
      con.shadowOffsetY = 0;
      con.shadowBlur    = 10;
      con.fill();
      
      if(p.moons){
          p.moons.forEach(function(moon){
            moon.draw();
          });
        }
      
    });
    
  
  };
  
  this.move = function() {
    
    if(system){ this.moveSystem(); return;}
    
    if(superfar) return;
    x += dx;
    y += dy;
    r += dr;
    if(moons){
      moons.forEach(function(moon){
          moon.move(this);
        }, this);
    }
    if(r <= 0 || r > 30)
      opacity-=0.025;
    if(x > WIDTH || x < 0 || opacity <= 0 || r <= 0) this.reset(kill=true);
    if(y > HEIGHT || y < 0) this.reset(kill=true);
  };
  
  this.moveSystem = function(){
    
    //make center planet move, others follow
    
    planets[2].body.x += dx;
    planets[2].body.y += dy;
    
    for(var i = 0 ; i < planets.length ; i++){
      if(i == 2 ) continue;
      planets[i].body.move(planets[2].body);
      planets[i].moons.forEach(function(moon){
          moon.move(this.body);
        }, planets[i]);
    }
  };
  
  this.getX = function() { return x; }
  this.getY = function() { return y; }
}

var Moon = function(r, size){

  var angle = 0, da = Math.sqrt((2*Math.PI)/(300*r));
  
  this.x = 0;
  this.y = 0;
  this.moonR = size/2.0
  
  this.move = function(mom){
    this.x = mom.getX() + Math.cos(angle) * r;
    this.y = mom.getY() + Math.sin(angle) * r;
    angle += da;
  };
  
  this.draw = function(){
    con.beginPath();
    con.fillStyle = 'white';
    con.shadowColor   = 'rgba(166,40,34,1)';
    con.arc(this.x - this.moonR, this.y - this.moonR, this.moonR, 0, 2 * Math.PI, false);
    
    con.closePath();
    con.shadowOffsetX = 0;
    con.shadowOffsetY = 0;
    con.shadowBlur    = 10;
    con.fill();
  };
  
  this.getX = function() { return this.x;}
  this.getY = function() { return this.y;}
};

var getRandomIn = function(bottom, top){
  return bottom + (Math.random())*(top - bottom);
};