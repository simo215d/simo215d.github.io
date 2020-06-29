var game = { id:"null", isO:false, currentTurn:"N", state:"NNNNNNNNN", totalPlayers:0};
var gameOver = false;

//notify opponent that we left, so that the game doesn't allow him to place and then delete the game.
// this way we can close both tabs at the same time
window.onbeforeunload = function(event) {
    if (game.id!=="null") {
        updateGame(game.state, game.currentTurn, game.totalPlayers - 1);
        getfirebase().database().ref("games/" + game.id).remove();
    }
};

function create(ID) {
    //if we were in a game: //notify opponent that we left
    if (game.id!=="null"){
        getfirebase().database().ref("games/"+game.id).remove();
    }
    //check if the game exists
    var gamesList = [];
    var ref = getfirebase().database().ref("games");
    ref.once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            var newGame = {ID: childData.ID, gameState: childData.state, turn:childData.turn, totalPlayers:childData.totalPlayers};
            gamesList.push(newGame);
        });
        //alert("IT IS OVER. games found: "+gamesList.length);
        for (var i = 0; i < gamesList.length; i++) {
            if (ID===gamesList[i].ID){
                alert("That game already exists, try another");
                return false;
            }
        }
        game.id=ID;
        game.isO=true;
        game.totalPlayers=1;
        game.state="NNNNNNNNN";
        game.currentTurn="X";
        gameOver=false;
        clearBoard();
        updateGame(game.state, "X", game.totalPlayers);
        listenToChange();
    });
    return false;
}

function join(ID)   {
    //if we were in a game: //notify opponent that we left
    if (game.id!=="null"){
        getfirebase().database().ref("games/"+game.id).remove();
    }
    var gamesList = [];
    var ref = getfirebase().database().ref("games");
    ref.once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            var newGame = {ID: childData.ID, gameState: childData.state, turn:childData.turn, totalPlayers:childData.totalPlayers};
            gamesList.push(newGame);
            //alert(newGame.ID+newGame.gameState+newGame.turn+newGame.totalPlayers);
        });
        //alert("IT IS OVER. games found: "+gamesList.length);
        for (var i = 0; i < gamesList.length; i++) {
            //alert("we found a game and are testing if: "+ID+"=="+gamesList[i].ID+" is the same");
            if (ID===gamesList[i].ID){
                //this can be a separate method for entering a game
                //alert("Valid game id; now entering");
                if (gamesList[i].totalPlayers>=2){
                    alert("lobby is full...");
                    return false;
                }
                game.isO=false;
                game.id=ID;
                clearBoard();
                listenToChange();
                //alert("updating game with data: state: "+gamesList[i].gameState+" turn: "+gamesList[i].turn+" totalPlayers: "+(gamesList[i].totalPlayers+1));
                updateGame(gamesList[i].gameState, gamesList[i].turn, gamesList[i].totalPlayers+1);
                gameOver=false;
                break;
            } else {
                //alert("Invalid game id");
            }
            alert("Game with the id \""+ID+"\" does not exist! Try another");
        }
        if (gamesList.length===0){
            alert("Game with the id \""+ID+"\" does not exist! Try another");
        }
    });
    return false;
}

function place(blockID) {
    if (gameOver){
        alert("Game is over; create or join a new game");
        return;
    }
    if (game.id==="null"){
        alert("You need to join or create a game");
        return;
    }
    if (game.totalPlayers<2){
        alert("You need at least 2 players to begin");
        return;
    }
    if (game.isO && game.currentTurn==="X"){
        alert("It is not your turn");
        return;
    }
    if (!game.isO && game.currentTurn==="O"){
        alert("It is not your turn");
        return;
    }
    if (document.getElementById(blockID+"Label").innerText!=="N"){
        alert("Block has already been taken");
        return;
    }
    if (game.isO){
        //alert("O placed in: "+blockID);
        //change state
        if (blockID==="r1c1"){
            game.state="O"+game.state.substr(1);
        }
        if (blockID==="r1c2"){
            game.state=game.state.substr(0,1)+"O"+game.state.substr(2);
        }
        if (blockID==="r1c3"){
            game.state=game.state.substr(0,2)+"O"+game.state.substr(3);
        }
        if (blockID==="r2c1"){
            game.state=game.state.substr(0,3)+"O"+game.state.substr(4);
        }
        if (blockID==="r2c2"){
            game.state=game.state.substr(0,4)+"O"+game.state.substr(5);
        }
        if (blockID==="r2c3"){
            game.state=game.state.substr(0,5)+"O"+game.state.substr(6);
        }
        if (blockID==="r3c1"){
            game.state=game.state.substr(0,6)+"O"+game.state.substr(7);
        }
        if (blockID==="r3c2"){
            game.state=game.state.substr(0,7)+"O"+game.state.substr(8);
        }
        if (blockID==="r3c3"){
            game.state=game.state.substr(0,8)+"O";
        }
        updateGame(game.state, "X", game.totalPlayers);
    } else {
        //alert("X placed in: "+blockID);
        //change state
        if (blockID==="r1c1"){
            game.state="X"+game.state.substr(1);
        }
        if (blockID==="r1c2"){
            game.state=game.state.substr(0,1)+"X"+game.state.substr(2);
        }
        if (blockID==="r1c3"){
            game.state=game.state.substr(0,2)+"X"+game.state.substr(3);
        }
        if (blockID==="r2c1"){
            game.state=game.state.substr(0,3)+"X"+game.state.substr(4);
        }
        if (blockID==="r2c2"){
            game.state=game.state.substr(0,4)+"X"+game.state.substr(5);
        }
        if (blockID==="r2c3"){
            game.state=game.state.substr(0,5)+"X"+game.state.substr(6);
        }
        if (blockID==="r3c1"){
            game.state=game.state.substr(0,6)+"X"+game.state.substr(7);
        }
        if (blockID==="r3c2"){
            game.state=game.state.substr(0,7)+"X"+game.state.substr(8);
        }
        if (blockID==="r3c3"){
            game.state=game.state.substr(0,8)+"X";
        }
        updateGame(game.state, "O", game.totalPlayers);
    }
}

function updateGame(state, currentTurn, totalPlayers) {
    //alert("STATE: "+state);
    game.state=state;
    game.currentTurn=currentTurn;
    game.totalPlayers=totalPlayers;
    getfirebase().database().ref("games/"+game.id).set({
        "ID": game.id,
        "state": state,
        "turn": currentTurn,
        "totalPlayers": totalPlayers
    });
    //update html: btw this happens when we locally call to update AND when we listen and notice a change
    updateInfoLabels();
    updateBoard();
    //win?
    winCondition();
}

function updateInfoLabels() {
    document.getElementById("currentGameLabel").innerHTML="Current game: "+game.id;
    switch (game.isO) {
        case true: document.getElementById("currentTypeLabel").innerHTML="You are: O"; break;
        case false: document.getElementById("currentTypeLabel").innerHTML="You are: X"; break;
    }
    document.getElementById("playersLabel").innerHTML="Total players: "+game.totalPlayers;
    if (game.currentTurn==="O") {
        document.getElementById("currentTurnLabel").innerHTML = "It is currently O's turn";
    } else document.getElementById("currentTurnLabel").innerHTML = "It is currently X's turn";
}

function updateBoard() {
    for (var i = 0; i < 9; i++) {
        var currentSquare = "";
        switch (i) {
            case 0: currentSquare="r1c1"; break;
            case 1: currentSquare="r1c2"; break;
            case 2: currentSquare="r1c3"; break;
            case 3: currentSquare="r2c1"; break;
            case 4: currentSquare="r2c2"; break;
            case 5: currentSquare="r2c3"; break;
            case 6: currentSquare="r3c1"; break;
            case 7: currentSquare="r3c2"; break;
            case 8: currentSquare="r3c3"; break;
        }
        if (game.state.charAt(i)==="X"){
            document.getElementById(currentSquare+"Label").style.color="black";
            document.getElementById(currentSquare+"Label").style.fontSize="100px";
            document.getElementById(currentSquare+"Label").innerHTML="X";
        } else if (game.state.charAt(i)==="O"){
            document.getElementById(currentSquare+"Label").style.color="black";
            document.getElementById(currentSquare+"Label").style.fontSize="100px";
            document.getElementById(currentSquare+"Label").innerHTML="O";
        }
    }
}

function clearBoard() {
    for (var i = 1; i <= 3; i++) {
        for (var j = 1; j <= 3; j++) {
            var label = "r"+i+"c"+j+"Label";
            document.getElementById(label).style.color="#552b28";
            document.getElementById(label).innerHTML="N";
            //alert("cleared label: "+label);
        }
    }
}

function winCondition() {
    whoWon("X");
    whoWon("O");
    function whoWon(type) {
        //r1
        if (game.state.charAt(0)===type && game.state.charAt(1)===type && game.state.charAt(2)===type){
            win(type);
        }
        //r2
        if (game.state.charAt(3)===type && game.state.charAt(4)===type && game.state.charAt(5)===type){
            win(type);
        }
        //r3
        if (game.state.charAt(6)===type && game.state.charAt(7)===type && game.state.charAt(8)===type){
            win(type);
        }
        //c1
        if (game.state.charAt(0)===type && game.state.charAt(3)===type && game.state.charAt(6)===type){
            win(type);
        }
        //c2
        if (game.state.charAt(1)===type && game.state.charAt(4)===type && game.state.charAt(7)===type){
            win(type);
        }
        //c3
        if (game.state.charAt(2)===type && game.state.charAt(5)===type && game.state.charAt(8)===type){
            win(type);
        }
        //d048
        if (game.state.charAt(0)===type && game.state.charAt(4)===type && game.state.charAt(8)===type){
            win(type);
        }
        //d246
        if (game.state.charAt(2)===type && game.state.charAt(4)===type && game.state.charAt(6)===type){
            win(type);
        }
    }
}

function win(type) {
    gameOver = true;
    if (game.isO && type==="O") {
        //alert("O Won! THAT'S YOU!")
    }
    if (game.isO && type==="X") {
        //alert("X Won! THAT'S NOT YOU!")
    }
    if (!game.isO && type==="O") {
        //alert("O Won! THAT'S NOT YOU!")
    }
    if (!game.isO && type==="X") {
        //alert("X Won! THAT'S YOU!")
    }
    document.getElementById("currentGameLabel").innerHTML=type+" WON!";
    switch (game.isO) {
        case true: document.getElementById("currentTypeLabel").innerHTML="You are: O"; break;
        case false: document.getElementById("currentTypeLabel").innerHTML="You are: X"; break;
    }
    document.getElementById("playersLabel").innerHTML=type+" WON!";
    document.getElementById("currentTurnLabel").innerHTML=type+" WON!";
}

function listenToChange() {
    getfirebase().database().ref("games/"+game.id).on('value', function (datasnapshot) {
        //alert("updating game with data: state: "+datasnapshot.val().state+" turn: "+datasnapshot.val().turn+" totalPlayers: "+datasnapshot.val().totalPlayers);
        updateGame(datasnapshot.val().state, datasnapshot.val().turn, datasnapshot.val().totalPlayers);
    });
}
