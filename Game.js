class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })
  }

  update(state){
      database.ref('/').update({
        gameState: state
      });
    }

    async start(){
      if(gameState === 0){
        player = new Player();
        var playerCountRef = await database.ref('playerCount').once("value");
        if(playerCountRef.exists()){
          playerCount = playerCountRef.val();
          player.getCount();
        }
        form = new Form()
        form.display();
      }

      teddy = createSprite(100,550,50,50);
      teddy.addImage("teddy_Img",teddy_Img);
      teddy.scale = 0.03 ;
      rabbit = createSprite(100,650,50,50);
      rabbit.addImage("rabbit",rabbit_Img);
      rabbit.scale = 0.2;
     animals = [teddy,rabbit];

        //giving forest vlocity
      //  forest.velocityX = -4;

     //   if (forest.x < 250){
     //   forest.x = forest.width/2;
     //   }
      
   }
   play(){
      form.hide();
      
      Player.getPlayerInfo();
      player.getplayersAtEnd();

      var ground = createSprite(750,690,10000,10);
      ground.visible = false;
      
      if(allPlayers !== undefined){

        background(forest_Img);
        imageMode(CENTER);
        image(forest_Img,750,320,displayWidth*7,displayHeight);
        
        //index of the array
        var index = 0;

        var x  ;
        var y = 550;

        drawSprites();
  
        for(var plr in allPlayers){
          //add 1 to the index for every loop
          index = index + 1 ;
          animals[index-1].collide(ground);
  
          //position the players a little away from each other in y direction
          //y = y + 200;
          //use data form the database to display the players in x direction
            x =  allPlayers[plr].distance;
          //x = 100 ;
          animals[index-1].x = 100 + x;
          //animals[index-1].y = y;

          if(keyDown("Space") && animals[player.index-1].y > 100){
             jumpBgm.play();
             animals[player.index-1].velocityY = -8   
          }

          animals[player.index-1].velocityY = animals[player.index-1].velocityY + 0.3 ;

          textSize(25);
          fill("White");
          text("Teddy Score:"+allPlayers.player1.score,50 + allPlayers.player1.distance , 100);

          text("Bunny Score:"+allPlayers.player2.score,50 + allPlayers.player2.distance , 150);

          text("Teddy Distance:"+allPlayers.player1.distance,250 + allPlayers.player1.distance , 100);

          text("Bunny Distance:"+allPlayers.player2.distance,250 + allPlayers.player2.distance , 150); 

          if(index === player.index){
            camera.position.x = animals[index-1].x;
          }

      }
    }
  if(keyIsDown(RIGHT_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
   }

   if(keyIsDown(LEFT_ARROW) && player.index !== null){
    player.distance -=10
    player.update();
   }

   if(frameCount%50 === 0){ 
     var fruitX = random(300,7000); 
     var fruitY = random(400,550);
     fruit = createSprite(fruitX,fruitY,50,50);
     var n = Math.round(random(1,5))
   if(n===1){ 
     fruit.addImage(apple_Img);
     fruit.scale = 0.3 }
    else if(n===2){ 
     fruit.addImage(banana_Img);
     fruit.scale = 0.2 }
    else if(n===3){
     fruit.addImage(grapes_Img);
     fruit.scale = 0.4 }
    else if(n===4){
     fruit.addImage(mango_Img);
     fruit.scale = 0.4 }
    else if(n===5){
     fruit.addImage(coin_Img);
     fruit.scale = 0.5 }
     fruit.lifetime = 200;
     fruitGroup.add(fruit); 
    }

    if (player.index !== null) {
      for (var i = 0; i < fruitGroup.length; i++) {
          if (fruitGroup.get(i).isTouching(animals)) {
            hitBgm.play();
              fruitGroup.get(i).destroy();
              player.score =player.score+1;
              player.update();
              
          }
          
      }
  }

  if(frameCount%200 === 0){
    var obsX = random(300,7000);
    var obsY = random(650,700)
  
  obstacle = createSprite(obsX,obsY,50,50)
  obstacle.velocityX = -2
  var n = Math.round(random(1,3))
  if(n===1){
      obstacle.addImage(stone1_Img)
      obstacle.scale = 0.2
  }
  else if(n===2){
    obstacle.addImage(stone2_Img)
    obstacle.scale = 0.5
  }
  else if(n===3){
    obstacle.addImage(porcupine_Img)
    obstacle.scale = 0.3
  }
  
  obstacle.lifetime = 200;
   obstacleGroup.add(obstacle);      

}
 
if (player.index !== null) {
  for (var i = 0; i < obstacleGroup.length; i++) {
      if (obstacleGroup.get(i).isTouching(animals)) {
         lifeloseBgm.play();
          obstacleGroup.get(i).destroy();
          player.distance = player.distance - 100
          player.update();
          
      }
      
  }
}



    if(player.distance > 5000){
      gameState = 2;
      player.rank += 1;
      Player.updateplayersAtEnd(player.rank);
      this.showRank();
     }
     
  }

  end(){
      console.log("Game Ended");
      console.log("rank :"+player.rank);
    }

    showRank() {
      if(player.rank===1){
        winBgm.play();
      swal({
        title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
        text: "You reached the finish line successfully!",
        imageUrl:
          "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "Ok"
      });
      }
      if(player.rank===2){
        gameoverBgm.play();
        swal({
          title: `Game Over`,
          text: "Oops you lost the race....!!!",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
          imageSize: "100x100",
          confirmButtonText: "Thanks For Playing"
        });
      }
    }

}