const canvas=document.querySelector("#canvas")  
let ctx=canvas.getContext("2d")
let screenWidth=window.innerWidth
canvas.height=window.innerHeight
canvas.width=screenWidth
let colors=["#348888","#010626","#091973","#4F5E8C","#8E9EBF","#010B40","#22BABB","#9EF8EE","#FA7F08","#F24405","#BF1B39","#3084F2","#022601","#F2E422","#F2E96B"]
let gravity=1
let obstacles=[]
var map = {37: false, 38: false, 39: false, 40: false};
let obsX=[300,491,561,631,701,771,631,1300,1800,2500,

    3900,3950,4000,4050,4100,4150,4200,4250,
    3950,4000,4050,4100,4150,4200,4250,
    4000,4050,4100,4150,4200,4250,
    4050,4100,4150,4200,4250,
    4100,4150,4200,4250,
    4150,4200,4250,
    4200,4250,
    4250,
    4300,4300,4300,4300,4300,4300,4300,4300,
    4650,4700
    

]
let eneX=[1300,1400,1900,2500,2800]
let mushX=[701]
let enemies=[]
const playerRightImg1 = document.getElementById('playerRight1');
const playerRightImg2 = document.getElementById('playerRight2');
const playerLeftImg1 = document.getElementById('playerLeft1');
const playerLeftImg2 = document.getElementById('playerLeft2');
const playerJumpRight = document.getElementById('playerJumpRight');
const playerJumpLeft = document.getElementById('playerJumpLeft');
const playerDead = document.getElementById('playerDead');
const bgImg= document.getElementById('bg');
const platform=document.getElementById('platform')
const castle= document.getElementById('castle');
const brick= document.getElementById('brick');
const bumpBrick= document.getElementById('bumpBrick');
const coin=document.getElementById('coin');
const pipe=document.getElementById('pipe');
const stone=document.getElementById('stone');
const winner=document.getElementById('winner');
const victoryFlag=document.getElementById('victoryFlag');
const mushroomImg= document.getElementById('mushroomImg');
const enemy1= document.getElementById('enemy1');
var mario=playerRightImg1;
var myReq;
let winnerReq
var mushroomReq;
let gameOverReq
let enemiesReq
let scrollOffset=3
let player;
let flag;
let ground=window.innerHeight-94
let roll=1
let curEnd=screenWidth
let mushroomObj

class Mario{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width
        this.height=height
        this.velocity={
            x:0,
            y:0
        }
        this.hasLanded=true
        this.leftCollision=false
        this.rightCollision=false
        this.movementDisabled=false
    
        this.currentRight=1
        this.currentLeft=0
        this.isFacingRight=true
       

    }
    draw(){
     
        ctx.drawImage(mario, 0, 0, 300, 270, this.x, this.y, this.width, this.height); 
           }
    update(){
        
        this.x+=this.velocity.x
        this.y+=this.velocity.y
        this.velocity.y+=gravity
        if(this.y+this.height>=ground){
            
            this.y=ground-this.height
            this.velocity.y=0
            this.hasLanded=true
           
           if(mario==playerJumpRight){
               mario=playerRightImg1
           }else if(mario==playerJumpLeft){
               mario=playerLeftImg1
           }
           
        }
       
            
            for(let i=0;i<obstacles.length;i++){
                
              if(this.x+this.width>=obstacles[i].x && this.x<=obstacles[i].x+obstacles[i].width && this.y+this.height>=obstacles[i].y&& this.y<=obstacles[i].y+obstacles[i].height ){
            this.velocity.y=0
            if(mario==playerJumpRight){
                mario=playerRightImg1
            }else if(mario==playerJumpLeft){
                mario=playerLeftImg1
            }
            if(this.y<obstacles[i].y&&obstacles[i].y-this.y>=this.height-20){
                this.velocity.y=0
                this.hasLanded=true
                this.y=obstacles[i].y-this.height
               
            }else if (this.y>=obstacles[i].y&&this.y-obstacles[i].y<obstacles[i].height&&this.hasLanded==false){
                this.velocity.y+=gravity+10
                if(obstacles[i].type=="coin"){
                    if(obstacles[i].isActive){
                        document.getElementById('coinSound').play();
                        obstacles[i].isActive=false
                        let newObstacle= new Obstacle(obstacles[i].x,obstacles[i].y,obstacles[i].width,obstacles[i].height,"bump",false)
                        obstacles.splice(i,1,newObstacle)
                    }
                    else{
                        document.getElementById('bump').play();
                       
                    }
                    
                }
                else if(obstacles[i].type=="brick"){
                    document.getElementById('brickBreak').play();
                    obstacles.splice(i,1)
                    obsX.splice(i,1)
                    
                }
                else if(obstacles[i].type=="mushroom"){
                    if(obstacles[i].isActive){
                        mushroomObj=new Mushroom(701,window.innerHeight-380,0,70,60,5,0)
                        document.getElementById('mushroom').play();
                        let newObstacle= new Obstacle(obstacles[i].x,obstacles[i].y,obstacles[i].width,obstacles[i].height,"bump",false)
                        obstacles.splice(i,1,newObstacle)
                        obstacles[i].isActive=false
                        animateMushroom()
                    }
                    else{
                        
                    
                        document.getElementById('bump').play();
                    }
                   
                }
                
                if((this.x<=obstacles[i].x&&obstacles[i].x-this.x<=this.width)||(this.x>=obstacles[i].x&&this.x-obstacles[i].x<=obstacles[i].width)){
                    
                    if(this.x<=obstacles[i].x){ 
                       this.leftCollision=true
                   
                        this.x=obstacles[i].x-this.width-2
                     
                    }
                    else if(this.x>obstacles[i].x){ 
                        this.rightCollision=true
                      
                        this.x=obstacles[i].x+obstacles[i].width+2
                    }
                }
                
                   
            }else{
                
                if((this.x<=obstacles[i].x&&obstacles[i].x-this.x<=this.width)||(this.x>=obstacles[i].x&&this.x-obstacles[i].x<=obstacles[i].width)){
                    
                    if(this.x<=obstacles[i].x){ 
                       this.leftCollision=true
                   
                        this.x=obstacles[i].x-this.width
                        
                    }
                    else if(this.x>obstacles[i].x){ 
                        this.rightCollision=true
                        this.x=obstacles[i].x+obstacles[i].width}
                }
                
                   
                    
                

                this.velocity.y+=gravity
            }


            
                
                  
               }
               else{
                this.rightCollision=false
                this.leftCollision=false
               }
            
            
               
            
            
            }    
                    
       for(let j=0;j<enemies.length;j++){
        
        if(enemies[j].x<-10000){

            enemies.splice(j,1)
        }
       else if(enemies[j].x+enemies[j].width>=this.x && enemies[j].x<=this.x+this.width && enemies[j].y+enemies[j].height>=this.y&& enemies[j].y<=this.y+this.height){
        if(this.y<enemies[j].y&&enemies[j].y-this.y>=this.height-20){
            document.getElementById('stomp').play();
            enemies.splice(j,1)
           
        }
        else{
           enemies[j].dx=0
          
           if(player.height==100){
            enemies.splice(j,1)
            player.height=60
            player.width=60
            document.getElementById('powerDown').play();
           }
           else{
            document.getElementById('dead').play();
            mario=playerDead
            player.height=80
            player.width=80
          
           
            stopAudio(document.getElementById('bgMusic'))
           
            cancelAnimationFrame(myReq)
            this.movementDisabled=true
            setTimeout(function(){
                alert("Game Over")
                window.location.reload()


            },3000);
            animateGameOver()
           
           
           
           }
           

        }
    }
       }   
       let  over=false        
       if(this.x+this.width>=flag.x && this.x<=flag.x+flag.width && this.y+this.height>=flag.y&& this.y<=flag.y+flag.height)
       {
           this.movementDisabled=true

over=true
this.y+=3

this.velocity.x=0
this.velocity.y=0
this.x=flag.x+flag.width
ctx.drawImage(victoryFlag, flag.x-flag.width-50,player.y,50,50); 
       
    }
    if(over&&this.y+this.height>=ground-50){
       
        stopAudio(document.getElementById('bgMusic'))
     
        
       
        document.getElementById('winner').play();
        animateVictory()
        ctx.drawImage(victoryFlag, flag.x-flag.width-50,ground-100,50,50); 
    }
        this.draw()
    }
    jump(){
        if(this.isFacingRight)mario=playerJumpRight
        else mario=playerJumpLeft
        
        if(this.hasLanded&&!this.movementDisabled){
            this.hasLanded=false
            
            this.velocity.y=-20
        
            document.getElementById('jumpMusic').play();
        }
    
     
    }
    left(){
        this.isFacingRight=false
        if(this.currentLeft==0){
            mario=playerLeftImg1
            this.currentLeft=1
        }
        else{
            mario=playerLeftImg2
            this.currentLeft=0
        }
        if(!this.rightCollision&&!this.movementDisabled){
        if(scrollOffset-20>=0){
            
            scrollOffset-=20
        
        if(!this.hasLanded){
            scrollOffset-=20
            this.x-=5
          
        }
        if(this.x>=0){
           this.x-=5
        }
      }
      else{
          scrollOffset=3
          this.x=10
      }
    }
    }
    right(){
        this.isFacingRight=true
        if(this.currentRight==0){
            mario=playerRightImg1
            this.currentRight=1
        }
        else{
            mario=playerRightImg2
            this.currentRight=0
        }
        if(!this.leftCollision&&scrollOffset+200<=5000&&!this.movementDisabled){

          
        if(!this.hasLanded){
            scrollOffset+=20
            this.x+=5
           
        }
        this.x+=5
        scrollOffset+=20
      
}
    }


}
function animateVictory(){
winnerReq=requestAnimationFrame(animateVictory)
ctx.drawImage(victoryFlag, flag.x-flag.width-50,ground-100,50,50); 
if(scrollOffset>=4305){
    cancelAnimationFrame(winnerReq)
    cancelAnimationFrame(myReq)
    
}
else{
    
    scrollOffset+=3
   
    if(scrollOffset%20==0){

        if(mario==playerRightImg1)mario=playerRightImg2
        else mario=playerRightImg1
    }

}
}
function animateGameOver(){
 
    ctx.clearRect(player.x,player.y,player.width,player.height)
    mario=playerDead
    for(let i=0;i<5;i++){
        if(i==3) ctx.drawImage(castle, (1500*i)-scrollOffset,0,1500, ground); 
        else ctx.drawImage(bgImg, (1500*i)-scrollOffset,0,1500, ground); 
        ctx.drawImage(platform, (1500*i)-scrollOffset,ground,1500, window.innerHeight+10-ground); 
    }
  
ctx.drawImage(victoryFlag, flag.x-flag.width-50,150,50,50); 
      obstacles.forEach(obs=>obs.draw())
      enemies.forEach(ene=>ene.draw())
    player.draw()
    gameOverReq=requestAnimationFrame(animateGameOver)
    if(player.y+player.height>=window.innerHeight){
        cancelAnimationFrame(gameOverReq)
        
        
    }
    else{
        
        player.y+=1
    }
    }
class Obstacle{
    constructor(x,y,width,height,type,isActive){
        this.x=x;
        this.y=y;
        this.width=width
        this.height=height
        this.type=type
        this.isActive=isActive

    }
    draw(){
      
        let object;
        switch(this.type) {
            case "brick":
              object=brick
              break;
            case "coin":
              object=coin
              break;
            case "mushroom":
                object=coin
                break;
              case "pipe":
                object=pipe
                break;
            case "stone":
                object=stone
                break;
                case "bump":
                object=bumpBrick
                break;
            default:
              object=brick
          }
        ctx.drawImage(object,this.x,this.y,this.width,this.height); 
    }

}
class Mushroom{
    constructor(x,y,index,width, height, dx,dy){
        this.x=x
        this.y=y
        this.width=width
        this.height=height
        this.velocity={x:dx,y:dy}
        this.hasLanded=false
        this.index=index
        this.dx=dx
        this.goingLeft=false

    }
    draw(){
     
        ctx.drawImage(mushroomImg,this.x, this.y, this.width, this.height); 
    }
    update(){
        if(this.goingLeft){
           
            this.velocity.x-=this.dx
        }
       else{
        
        this.velocity.x+=this.dx
       }
        this.x=mushX[this.index]+this.velocity.x-scrollOffset
      
        this.y+=this.velocity.y
        this.velocity.y+=gravity
        if(this.y+this.height>=ground){
            
            this.y=ground-this.height
            this.velocity.y=0
            this.hasLanded=true
           
           
           
        }
        for(let i=0;i<obstacles.length;i++){
            
          if(this.x+this.width>=obstacles[i].x && this.x<=obstacles[i].x+obstacles[i].width && this.y+this.height>=obstacles[i].y&& this.y<=obstacles[i].y+obstacles[i].height ){
            if(this.y<obstacles[i].y&&obstacles[i].y-this.y>=this.height-20){
                this.velocity.y=0
                this.hasLanded=true
                this.y=obstacles[i].y-this.height
            }  
            else if((this.x<obstacles[i].x&&obstacles[i].x-this.x<=this.width)||(this.x>=obstacles[i].x&&this.x-obstacles[i].x<obstacles[i].width)){
                this.goingLeft=!this.goingLeft
            }

            
        
        }
        }
        this.draw()
    }
    
}
function animateMushroom(){
    mushroomReq=requestAnimationFrame(animateMushroom)
    mushroomObj.update()
    
    if(mushroomObj.x<0){
        cancelAnimationFrame(mushroomReq)
    }
    else if(mushroomObj.x+mushroomObj.width>=player.x && mushroomObj.x<=player.x+player.width && mushroomObj.y+mushroomObj.height>=player.y&& mushroomObj.y<=player.y+player.height){
        cancelAnimationFrame(mushroomReq)
        player.width=70
        player.height=100
        document.getElementById('powerUp').play();
    }

}

class Enemy{
    constructor(x,y,index,width, height, dx,dy,type){
        this.x=x
        this.y=y
        this.index=index
        this.width=width
        this.height=height
        this.velocity={x:dx,y:dy}
        this.hasLanded=false
        this.type=type
        this.dx=dx
        this.goingLeft=true

    }
    draw(){
        
        ctx.drawImage(enemy1,this.x, this.y, this.width, this.height); 
    }
    update(){
    
        
        if(this.goingLeft){
           
            this.velocity.x-=this.dx
        }
       else{
        
        this.velocity.x+=this.dx
       }
       this.x=eneX[this.index]-this.velocity.x-scrollOffset
        this.y+=this.velocity.y
        this.velocity.y+=gravity
        
        if(this.y+this.height>=ground){
            
            this.y=ground-this.height
            this.velocity.y=0
            this.hasLanded=true
           
           
           
        }
        for(let i=0;i<obstacles.length;i++){
            
          if(this.x+this.width>=obstacles[i].x && this.x<=obstacles[i].x+obstacles[i].width && this.y+this.height>=obstacles[i].y&& this.y<=obstacles[i].y+obstacles[i].height ){
            if(this.y<obstacles[i].y&&obstacles[i].y-this.y>=this.height-20){
                this.velocity.y=0
                this.hasLanded=true
                this.y=obstacles[i].y-this.height
            }  
            else if((this.x<obstacles[i].x&&obstacles[i].x-this.x<=this.width)||(this.x>=obstacles[i].x&&this.x-obstacles[i].x<obstacles[i].width)){
          
               
               this.goingLeft=!this.goingLeft
              
               
            }

            
        
        }
        }
        
        this.draw()
        
    }
    
}
class Flag{
    constructor(x,y,width, height){
        this.x=x
        this.y=y
        this.width=width
        this.height=height
    } 
   
   
    }
function init(){
    player=new Mario(30, 100,50,50)
    enemies.push(new Enemy(1300,window.innerHeight-500,0,70,60,-3,0,"dog"),
                new Enemy(1400,window.innerHeight-500,1,70,60,-3,0,"dog"),
                new Enemy(1900,window.innerHeight-500,2,70,60,-3,0,"dog"),
                new Enemy(2500,window.innerHeight-500,3,70,60,-3,0,"dog"),
                new Enemy(2800,window.innerHeight-500,4,70,60,-3,0,"dog")
    )
    
    obstacles=[
        new Obstacle(300,window.innerHeight-300,70,60,"coin",true),
        new Obstacle(491,window.innerHeight-300,70,60,"brick",false),
        new Obstacle(561,window.innerHeight-300,70,60,"coin",true),
        new Obstacle(631,window.innerHeight-300,70,60,"brick",false),
        new Obstacle(701,window.innerHeight-300,70,60,"mushroom",true),
        new Obstacle(771,window.innerHeight-300,70,60,"brick",false),
        new Obstacle(631,window.innerHeight-480,70,60,"coin",true),
        new Obstacle(1300,window.innerHeight-255,150,160,"pipe",false),
        new Obstacle(1800,window.innerHeight-255,150,160,"pipe",false),
        new Obstacle(2500,window.innerHeight-255,150,160,"pipe",false),

        new Obstacle(3900,ground-50,50,50,"stone",false),
        new Obstacle(3950,ground-50,50,50,"stone",false),
        new Obstacle(4000,ground-50,50,50,"stone",false),
        new Obstacle(4050,ground-50,50,50,"stone",false),
        new Obstacle(4100,ground-50,50,50,"stone",false),
        new Obstacle(4150,ground-50,50,50,"stone",false),
        new Obstacle(4200,ground-50,50,50,"stone",false),
        new Obstacle(4250,ground-50,50,50,"stone",false),
       
        new Obstacle(3950,ground-100,50,50,"stone",false),
        new Obstacle(4000,ground-100,50,50,"stone",false),
        new Obstacle(4050,ground-100,50,50,"stone",false),
        new Obstacle(4100,ground-100,50,50,"stone",false),
        new Obstacle(4150,ground-100,50,50,"stone",false),
        new Obstacle(4200,ground-100,50,50,"stone",false),
        new Obstacle(4250,ground-100,50,50,"stone",false),

        new Obstacle(4000,ground-150,50,50,"stone",false),
        new Obstacle(4050,ground-150,50,50,"stone",false),
        new Obstacle(4100,ground-150,50,50,"stone",false),
        new Obstacle(4150,ground-150,50,50,"stone",false),
        new Obstacle(4200,ground-150,50,50,"stone",false),
        new Obstacle(4250,ground-150,50,50,"stone",false),

        new Obstacle(4050,ground-200,50,50,"stone",false),
        new Obstacle(4100,ground-200,50,50,"stone",false),
        new Obstacle(4150,ground-200,50,50,"stone",false),
        new Obstacle(4200,ground-200,50,50,"stone",false),
        new Obstacle(4250,ground-200,50,50,"stone",false),

        new Obstacle(4100,ground-250,50,50,"stone",false),
        new Obstacle(4150,ground-250,50,50,"stone",false),
        new Obstacle(4200,ground-250,50,50,"stone",false),
        new Obstacle(4250,ground-250,50,50,"stone",false),

        new Obstacle(4150,ground-300,50,50,"stone",false),
        new Obstacle(4200,ground-300,50,50,"stone",false),
        new Obstacle(4250,ground-300,50,50,"stone",false),

        new Obstacle(4200,ground-350,50,50,"stone",false),
        new Obstacle(4250,ground-350,50,50,"stone",false),
        new Obstacle(4250,ground-400,50,50,"stone",false),

        new Obstacle(4300,ground-400,50,50,"stone",false),
        new Obstacle(4300,ground-350,50,50,"stone",false),
        new Obstacle(4300,ground-300,50,50,"stone",false),
        new Obstacle(4300,ground-250,50,50,"stone",false),
        new Obstacle(4300,ground-200,50,50,"stone",false),
        new Obstacle(4300,ground-150,50,50,"stone",false),
        new Obstacle(4300,ground-100,50,50,"stone",false),
        new Obstacle(4300,ground-50,50,50,"stone",false),

        new Obstacle(4650,ground-50,50,50,"stone",false),
        new Obstacle(4700,ground-50,50,50,"stone",false)


    ]
    flag=new Flag(4700-scrollOffset,ground-400,5,ground-100)
    
    animate()
}
window.onload=function() {
    init();

  };

 
 
  function animate(){
      
      myReq=requestAnimationFrame(animate)
      obstacles.forEach((obstacle,i)=>obstacle.x=obsX[i]-scrollOffset)
    
    ctx.clearRect(0,0,screenWidth*10,window.innerHeight)

for(let i=0;i<5;i++){
    if(i==3) ctx.drawImage(castle, (1500*i)-scrollOffset,0,1500, ground); 
    else ctx.drawImage(bgImg, (1500*i)-scrollOffset,0,1500, ground); 
    ctx.drawImage(platform, (1500*i)-scrollOffset,ground,1500, window.innerHeight+10-ground); 
}
flag.x=4700-scrollOffset

      obstacles.forEach(obs=>obs.draw())
      enemies.forEach(ene=>ene.update())
      player.update()
  }
  document.onkeydown = function(e) {
      
      if (e.keyCode in map) {
        map[e.keyCode] = true;
        if (map[37]&&map[38]) {
            // jump left
            
            
            player.jump()
            player.left()
        }
        else if(map[38]&&map[39]){
            //jump right
            player.right()
            
          
            player.jump()
        }
        else if(map[37]){
            player.left()
        }
        else if(map[38]){
            player.jump()
        }
        else if(map[39]){
            player.right()
        }
        else if(map[40]){
            
        }
    }
    document.onkeyup = function(e) {
        if (e.keyCode in map) {
            map[e.keyCode] = false;
        }
    }
};

document.addEventListener('click', musicPlay);
function musicPlay() {
   
    document.getElementById('bgMusic').play();
 
}
window.addEventListener("resize",function(evt){
    
window.location.reload()
})
function stopAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
}