window.addEventListener("load",function(){
    let canvas=document.getElementById("game_screen");
    let ctx=canvas.getContext("2d");
    const game_width=990;
    const game_height=500;
    var PRACTICE=true;
    
    const idles=[];
    const run_right=[];
    const run_shoot=[];
    const run_shoot_left=[];
    const run_left_frames=[];
    const standing_shoot=[];
    const stand_shoot_left=[];
    const jump_frames=[];
    const jump_frames_left=[];
    const slide_frames=[];
    const slide_left_frames=[];

    for(let i=1;i<10;i++){
        let img=document.getElementById("idle"+i);
        idles.push(img);

        let img3=document.getElementById("runShoot"+i);
        run_shoot.push(img3);

        let img4=document.getElementById("runShootLeft"+i);
        run_shoot_left.push(img4);

        let jumpImg=document.getElementById("jump"+i);
        jump_frames.push(jumpImg);

        jumpImg=document.getElementById("jumpLeft"+i);
        jump_frames_left.push(jumpImg);

        let slide_img=document.getElementById("slide"+i);
        slide_frames.push(slide_img);

        slide_img=document.getElementById("slideL"+i);
        slide_left_frames.push(slide_img);

        if(i<9){
            let img2=document.getElementById("run"+i)
            run_right.push(img2);
            
            let img4=document.getElementById("runLeft"+i);
            run_left_frames.push(img4);
        }
        if(i<5){
            if(i!=4){
                continue;
            }
            let sImg=document.getElementById("standShoot"+i);
            standing_shoot.push(sImg);
            
            let rImg=document.getElementById("standShootLeft"+i);
            stand_shoot_left.push(rImg);
        }
        let last=document.getElementById("jump10");
        jump_frames.push(last);
        last=document.getElementById("jumpLeft10");
        jump_frames_left.push(last);
        last=document.getElementById("slide10");
        slide_frames.push(last);

    }
    
    class InputHandler{
        constructor(character){
            document.addEventListener("keydown",e=>{
                if(e.key==="ArrowRight"){
                    character.idle=false;
                    character.run_right=true;
                    character.x_vel=4;
                }
                else if(e.key=="ArrowLeft"){
                    character.idle=false;
                    character.run_left=true;
                    character.x_vel=-4;
                }
                if(e.keyCode==32&&!character.sliding){
                    character.shooting=true;
                    if(character.shotCharge>=50){
                        if(!character.bullet){
                            character.bullet=new Bullet(character)
                            character.shot_count++;
                        }
                        else if(!character.bullet2){
                            character.bullet2=new Bullet(character);
                            character.shot_count++;
                        }
                        character.shotCharge-=50;
                    }
                }
                if(e.key=="ArrowUp"){
                    if(character.jump_count<2){
                        character.jump=true;
                        character.shooting=false;
                        character.y_vel=-11.5;
                        character.jump_count++;
                    }
                }
                if(e.key=="ArrowDown"&&!character.jump){
                    character.sliding=true;
                    character.shooting=false;
                }
                if(e.key==='s'&&PRACTICE){
                    PRACTICE=false;
                }
            })
            document.addEventListener("keyup",e=>{
                if(e.key=="ArrowRight"&&character.run_right==true){
                    character.run_right=false;
                    character.idle=true;
                    character.x_vel=0;
                }
                if(e.key=="ArrowLeft"&&character.run_left==true){
                    character.run_left==false;
                    character.idle=true;
                    character.x_vel=0;
                }
                if(e.keyCode==32){
                    character.shooting=false;
                }
                if(e.key=="ArrowDown"){
                    character.sliding=false;
                }
            })
        }
    }

    class Character{
        constructor(x,y,width,height,idle_frames,running_frames,run_left_frames,run_shoot_frames,run_shoot_left){
            this.x=x;
            this.y=y;
            this.width=width;
            this.height=height;

            this.x_vel=0;
            this.y_vel=0;

            this.idle=true;
            this.run_left=false;
            this.run_right=false;
            this.shooting=false;
            this.jump=false;
            this.sliding=false;
            this.jump_count=0;

            this.idle_frames=idle_frames;
            this.running_frames=running_frames;
            this.run_left_frames=run_left_frames;
            this.run_shoot_frames=run_shoot_frames;
            this.run_shoot_left=run_shoot_left;
            this.standShoot=null;
            this.standShootLeft=null;
            this.jump_frames=null;
            this.jump_frames_left=null;
            this.slide_frames=null;
            this.slide_left_frames=null;
            this.above_platform=false;

            this.frame=0;
            this.bullet=null;
            this.bullet2=null;
            this.shot_count=0;
            this.score=0;
            this.GRAVITY=1;
            this.lives=3;
            this.shotCharge=100;

        }
        update_frame(dt){
            if(this.idle){
                if(dt>=80){
                    this.frame++;
                    return true;
                }
            }
            if(!this.shooting){
                if(this.run_right&&!this.sliding){
                    if(dt>=87){
                        this.frame++;
                        return true;
                    }
                }
                if(this.run_left&&!this.sliding){
                    if(dt>=87){
                        this.frame++;
                        return true;
                    }
                }
                else{
                    if(dt>=87){
                        this.frame++;
                        return true;
                    }
                }
            }
            if(this.shooting){
                if(this.run_right){
                    if(dt>=87){
                        this.frame++;
                        return true;
                    }
                }
                if(this.run_left){
                    if(dt>=87){
                        this.frame++;
                        return true;
                    }
                }
            }
            if(this.jumping){
                if(dt>=87){
                    this.frame++;
                    return true;
                }
            }
            return false;
        }
        draw(){
            if(this.idle){
                if(!this.shooting){
                    if(this.frame>=this.idle_frames.length){
                        this.frame=0;
                    };
                    var cur_frame=this.idle_frames[this.frame];
                }
                else if(this.shooting){
                    if(this.frame>=this.standShoot.length){
                        this.frame=0;
                    }
                    var cur_frame=this.standShoot[this.frame];
                }
                if(this.jump){
                    if(this.frame>=this.jump_frames.length){
                        this.frame=0;
                    }
                    var cur_frame=this.jump_frames[this.frame];
                }
            }
            else if(this.run_right){
                if(!this.shooting){
                    if(this.frame>=this.running_frames.length){
                        this.frame=0;
                    }
                    var cur_frame=this.running_frames[this.frame];
                }
                if(this.shooting){
                    if(this.frame>=this.run_shoot_frames.length){
                        this.frame=0;
                    }
                    var cur_frame=this.run_shoot_frames[this.frame];
                }
                if(this.jump){
                    if(this.frame>=this.jump_frames.length){
                        this.frame=0;
                    }
                    var cur_frame=this.jump_frames[this.frame];
                }
                if(this.sliding){
                    if(this.frame>=this.slide_frames.length){
                        this.frame=0;
                    }
                    var cur_frame=this.slide_frames[this.frame];
                }
            }
            else if(this.run_left){
                if(!this.shooting){
                    if(this.frame>=this.running_frames.length){
                        this.frame=0;
                    }
                    var cur_frame=this.run_left_frames[this.frame];
                }
                if(this.shooting){
                    if(this.frame>=this.run_shoot_frames.length){
                        this.frame=0;
                    }
                    var cur_frame=this.run_shoot_left[this.frame];
                }
                if(this.jump){
                    if(this.frame>=this.jump_frames.length){
                        this.frame=0;
                    }
                    var cur_frame=this.jump_frames_left[this.frame];
                }
                if(this.sliding){
                    if(this.frame>=this.slide_frames.length){
                        this.frame=0;
                    }
                    var cur_frame=this.slide_left_frames[this.frame];
                }
                
            }
            ctx.drawImage(cur_frame,this.x,this.y,this.width,this.height);
        }
        move(platform){
            if(this.x>=-30&&this.x<=game_width-100){
                this.x+=this.x_vel;
                this.y+=this.y_vel;
            }
            else{
                if(this.x>game_width/2){
                    this.x=game_width-100;
                }
                else{
                    this.x=-30;
                }
            }
            if(this.jump){
                if(this.above_platform){
                    if(this.y+this.height<=platform.y){
                        this.y+=this.y_vel;
                        this.y_vel+=this.GRAVITY;
                    }
                    else{
                        this.jump=false;
                        this.y_vel=0;
                        this.y=platform.y-this.height+7;
                        this.jump_count=0;
                    }
                }
                else{
                    if(this.y<=400){
                        this.y+=this.y_vel;
                        this.y_vel+=this.GRAVITY;
                    }
                    else{
                        this.jump=false;
                        this.y_vel=0;
                        this.y=400;
                        this.jump_count=0;
                    }
                }    
            }
        }
        check_enemy_collision(enemy){
            if(this.bullet){
                if(this.bullet.speed>0){
                    if(this.bullet.x+this.bullet.width>=enemy.x&&this.x<enemy.x+enemy.width&&this.bullet.y+this.bullet.height>=enemy.y){
                        enemy.reset();
                        this.bullet=null;
                        this.score+=30;
                    }
                }
                else{
                    if(this.bullet.x<=enemy.x+enemy.width/2&&this.bullet.x>=enemy.x){
                    enemy.reset();
                    this.bullet=null;
                    this.score+=30;
                    }
                }
            }
            if(this.bullet2){
                if(this.bullet2.speed>0){
                    if(this.bullet2.x+this.bullet2.width>=enemy.x&&this.x<enemy.x+enemy.width&&this.bullet2.y+this.bullet2.height>=enemy.y){
                        enemy.reset();
                        this.bullet2=null;
                        this.score+=30;
                    }
                }
                else{
                    if(this.bullet2.x>=enemy.x+enemy.width/2&&enemy.x>=this.bullet2.x){
                        enemy.reset();
                        this.bullet2=null;
                        this.score+=30;
                    }
                }
            }
            if((this.x+this.width-40>=enemy.x&&this.x<=enemy.x+enemy.width/2&&this.y+this.height-2>=enemy.y&&this.y<=enemy.y+enemy.height/2)||(this.x+30>=enemy.x+enemy.width/2&&this.x+this.width-40<=enemy.x+enemy.width&&this.y+this.height-2>=enemy.y+enemy.height/2)){
                this.lives--;
                enemy.reset();
            }
        }
        draw_game_info(){
            ctx.fillStyle="black";
            ctx.font="35px Helvetica";
            ctx.fillText("Score: "+this.score,5,40);
            let life=document.getElementById("fullheart");
            let dead=document.getElementById("emptyheart");
            let x_coord=5;
            for(let i=0;i<this.lives;i++){
                ctx.drawImage(life,x_coord,60,40,40);
                x_coord+=40;
            }
            for(let i=0;i<3-this.lives;i++){
                ctx.drawImage(dead,x_coord,60,40,40);
                x_coord+=40;
            }
            if(PRACTICE){
                ctx.fillText("Practice Mode",game_width/2-100,150);
                ctx.fillText("Press 's' to begin...",game_width/2-90,185);
            }
        }
        recharge_shot(){
            let shot_bar_width=60;
            ctx.fillStyle="white";
            ctx.font="20px Helvetica";
            ctx.fillText("Weapon Charge: ",5,135);
            ctx.fillRect(160,125,shot_bar_width,10);
            ctx.fillStyle="black";
            ctx.fillRect(161,126,shot_bar_width*this.shotCharge/100-2,8);
        }
    }
    class Bullet{
        constructor(character){
            this.y=character.y+character.height/3+15;
            this.width=30;
            this.height=5;
            this.imgSrc=document.getElementById("bullet");

            if(character.x_vel>=0){
                this.speed=6;
                this.x=character.x+character.width;
            }
            else{
                this.speed=-6;
                this.x=character.x-this.width;
            }
        }
        update_pos(){
            this.x+=this.speed;
        }
        draw(){
            ctx.fillStyle="#FF0";
            ctx.fillRect(this.x,this.y,this.width,this.height);
        }
        out_of_bounds(char){
            if(this.x<0||this.x>=game_width){
                return true;
            }
        }
    }

    class Enemy{
        constructor(x,speed,projectile,projectile_speed){
            this.x=x;
            this.speed=speed;
            this.width=80;
            this.height=65;
            this.y=game_height-this.height;
            this.img_source=document.getElementById("enemy");
            this.projectile=projectile;
            this.projectile_speed=projectile_speed;
            this.active=false;
        }
        move(){
            this.x-=this.speed;
        }
        draw(){
            ctx.drawImage(this.img_source,this.x,this.y,this.width,this.height)
        }
        reset(){
            this.x=Math.random()*game_width*3+700;
            this.speed+=0.15;
        }
        out_of_bounds(){
            if(this.x+this.width<0){
                this.reset();
            }
        }
    }

    class Platform{
        constructor(x,y,width,height){
            this.x=x;
            this.y=y;
            this.width=width;
            this.height=height;
            this.character_on=false;
            this.imgSrc=document.getElementById("platform");
        }
        draw(){
            ctx.fillStyle="black";
            ctx.fillRect(this.x-2,this.y-2,this.width+4,this.height+4);
            ctx.drawImage(this.imgSrc,this.x,this.y,this.width,this.height);
        }
        check_collision(character){
            if(this.character_on){
                return;
            }
            if(character.x+character.width-40>=this.x&&character.x+30<=this.x+this.width&&character.jump){
                if(character.y+character.height<this.y&&character.y_vel>0){
                    character.above_platform=true;
                    this.character_on=true;
                }
            }
        }
        check_fall(character){
            if(this.character_on){
                if(character.x+character.width-40<this.x||character.x+30>this.x+this.width){
                    this.character_on=false;
                    character.jump=true;
                    character.y_vel=0;
                    character.above_platform=false;
                }
            }
        }
    }

    let char=new Character(0,400,130,100,idles,run_right,run_left_frames,run_shoot,run_shoot_left);
    let prev=Date.now();
    new InputHandler(char);
    char.standShoot=standing_shoot;
    char.standShootLeft=stand_shoot_left;
    char.jump_frames=jump_frames;
    char.jump_frames_left=jump_frames_left;
    char.slide_frames=slide_frames;
    char.slide_left_frames=slide_left_frames;
    
    let enemy1=new Enemy(1100,3)
    let enemies=[];
    enemies.push(enemy1)
    for(let i=0;i<10;i++){
        if(i<5){
            let starting_pos=Math.random()*game_width*3+game_width;
            var enemy=new Enemy(starting_pos,3);
            enemy.active=true;
        }
        else if(i<10){
            let starting_pos=Math.random()*game_width*3+450;
            var enemy=new Enemy(starting_pos,3.5);
        }
        enemies.push(enemy);
    }

    let platform=new Platform(game_width/2,290,100,20);

    function loop(){
        ctx.clearRect(0,0,game_width,game_height); 
        let deltaY=Date.now()-prev;
        if(char.update_frame(deltaY)){
            prev=Date.now();
        }

        char.move(platform);
        char.draw();
        if(char.bullet){
            char.bullet.draw();
            char.bullet.update_pos();
            if(char.bullet.out_of_bounds(char)){
                char.bullet=null;
                char.shot_count--;
            }
        }
        if(char.bullet2){
            char.bullet2.draw();
            char.bullet2.update_pos();
            if(char.bullet2.out_of_bounds(char)){
                char.bullet2=null;
                char.shot_count--;
            }
        }
        if(!PRACTICE){
            for(let e of enemies){
                if(e.active){
                    e.draw();
                    e.move();
                    e.out_of_bounds();
                    char.check_enemy_collision(e);
                }
            }
        }
        platform.draw();
        platform.check_collision(char);
        platform.check_fall(char);
        char.draw_game_info();
        char.recharge_shot();
        if(char.shotCharge<100){
            char.shotCharge+=0.2;
        }
        if(char.lives>0){
            requestAnimationFrame(loop);
        }
        else{
            localStorage.setItem("final_score",char.score);
            window.location.replace("game_over.html");
        }
    }
    loop();
})
