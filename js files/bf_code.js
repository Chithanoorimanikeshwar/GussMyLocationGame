var view={
  hit:function(location){
    let element=document.getElementById(location);
    element.setAttribute("class","Hit");
    },
  miss:function(location){
    let element=document.getElementById(location);
    element.setAttribute("class","Miss");
    },
  displayMessage:function(message){
    let element=document.getElementById("messageArea");
    element.innerHTML=message;
  },
  gameOver:function(){
    this.displayMessage("gameOver"+"total_gusses"+model.gusses+"total_miss"+model.misses);
    let input_element=document.getElementById("gussInput");
    input_element.remove();
    let button_element=document.getElementById("fireButton");
    button_element.value="start new game";
    button_element.onclick=this.reload;
    let endgame=document.createElement("button");
    endgame.innerText="End game";
    endgame.value="End Game";
    endgame.className="endgame"
    document.getElementById('userInputs').appendChild(endgame);
  },
  reload:function(){
    window.location.reload();
 }
}


var model={
  ships:3,
  boardlength:6,
  shiplength:3,
  locations:[
    ['A1','A2','A3'],
    ['B1','B2','B3'],
    ['C1','C2','C3']
    ],
  gusses:0,
  misses:0,
  shipssink:0,
  ismatch:function(guss){
    for(var i=0;i<this.ships;i++){
        for(var j=0;j<=this.shiplength;j++){
          if(this.locations[i][j]==guss){
            return 1;
          }
        }
    }
    return -1;
  },
  fire:function(guss){
    this.gusses+=1;
    let shipstatus=this.ismatch(guss);
    if(shipstatus==1){
      view.displayMessage('u got the short');
      view.hit(guss);
      if(this.shipssink==((this.ships*this.shiplength)-1)){
        view.displayMessage('game over');
        view.gameOver();
        return -1;
      }
      this.shipssink+=1;
    }
    else{
      this.misses+=1;
      view.displayMessage('u miss the short');
      view.miss(guss); 
    }
    
  },
  shipGenerate:function(){
    let newship=new Array();
    let orientation=Math.floor(Math.random()*2);
    if(orientation==0){
      var row=Math.floor(Math.random()*(this.boardlength-3));
      var colum=Math.floor(Math.random()*this.boardlength)+1;
      for(let i=0;i<this.shiplength;i++){
        newship.push(String(row+i)+String(colum));
      }      
    }
    else {
     var row=Math.floor(Math.random()*this.boardlength);
      var colum=Math.floor(Math.random()*(this.boardlength-3))+1;
      for(let i=0;i<this.shiplength;i++){
        newship.push(String(row)+String(colum+i));
      }      
    }
    return newship;
  },
  locationsSetup:function(){
    do {
      var ship1=this.shipGenerate();
      var ship2=this.shipGenerate();
      var ship3=this.shipGenerate();
      var shipscollide=this.shipsCollision(ship1,ship2,ship3);
    }while(shipscollide); 
    this.locations[0]=this.conversion(ship1);
    this.locations[1]=this.conversion(ship2);
    this.locations[2]=this.conversion(ship3);
  },
  shipsCollision:function(ship1,ship2,ship3){
    for(let i=0;i<ship1.length;i++){
      for(let j=0;j<ship2.length;j++){
        for(let k=0;k<ship2.length;k++){
          if(ship1[i]==ship2[j] || ship1[i]==ship3[k]){
            return "true";
          }
          else if(ship2[j]==ship3[k]){
            return "true";
          }
        }
      }
    }
  },
  conversion:function(ship){ 
    var parsedship=new Array();
    for(let i=0;i<ship.length;i++){
      var row=ship[i][0];
      var colm=ship[i][1];
      var parsed=controller.rows_data[row]+colm;
      parsedship.push(parsed);
    }
    return parsedship;
  }       
}

var controller={
  columns:6,
  rows:6,
  data_array:new Array(),
  rows_data:"ABCDEF",
  validators:function(guss){
    let row=guss[0];
    let colon=guss[1];
    let dummy=this.rows_data;
    if(dummy.includes(row) && colon<=this.columns && guss.length==2){
      return 1;
    }
    else{
      view.displayMessage("enter correct guss");
    }
   },
  input:function(){
    let form=document.getElementById("gussInput");
    form.addEventListener("submit",(event)=>{
      event.preventDefault();
      event.stopPropagation();
    })
    let guss=form.value.toUpperCase();
    let alpha=controller.validators(guss);
    if(alpha==1){
      if(controller.data_array.includes(guss)){
        view.displayMessage("d'not enter the same region"+guss);
      }
      else{
        model.fire(guss);
        controller.updateDataArray(guss);
      }
    }
  },
  updateDataArray:function(guss){
    this.data_array.push(guss); 
  },
  handleKeyPress:function(e){
    let fireButton=document.getElementById("fireButton");
    if(e.key===13){
      fireButton.bind('click',function(ev){ev.preventDefault();ev.stopPropagation();}).click();
      return false;
    }
  }
}
    






function onint(){
  var fireme=document.getElementById("fireButton");
  fireme.onclick=controller.input;
  let gussInput=document.getElementById("gussInput");
  gussInput.onkeypress=controller.handleKeyPress;
  model.locationsSetup();
  console.log(model.locations);
}
onload=onint;