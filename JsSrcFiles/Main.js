//Modules
//let dialog = require('DialogModule.js');
//import { Test } from './DialogModule.js';
//
let canvas = null;
let context = null;




function Init(){
    canvas = document.getElementById("gameCanvas");
    context = canvas.getContext('2d');
    manager = new GameManager();
    manager.Start();
    manager.Update();
}


//#region Dialog

const dialog = { //Start redoing dialog tree to contain a value to determine if the response is correct for the question || Make it so the dialog is split between Constant and Questions (so it can give a random question without potentially giving the Start or Fail dialog)
    States : { //Change these to {} instead of [], same goes for the responses below
        Start : {
                Text: "Welcome contestant, are you ready to start the quiz?",
                Options:[ //Button text. Text = Button Text, Response = Dialog ID to switch to when button clicked.
                    {Text: "Yes", Response: "Continue"},
                    {Text: "No", Response: "Fail"},
                ]
        },
        Fail : {
            Text: "Unfortunately that was a trick question, and you have already failed.",
            Options:[
                {Text: "Shit", Response: "Start"}
            ]
        },
    },
    Questions : [
        {
            Text: "Insert question here",
            Options: [ //1 = Correct, 0 = Incorrect
                {Text: "A", Correct:0},
                {Text: "B", Correct:1},
                {Text: "C", Correct:0},
                {Text: "D", Correct:0},
            ]
        },
    ]
};

class DialogBuilder {
    constructor() {
        this.valid_Questions = []; //Table of valid questions for the game to pick from, questions get removed from here as they're asked to prevent duplicate questions showing up.
        this.current_Question_Index = 0; //Stores the index of the current qwestion in the valid_Questions array for easy removal.
    }

    Start(){
        console.log(dialog);
        console.log(dialog.States);
        console.log(dialog.Questions);
        for(var x = 0; x < dialog.Questions.length; x++){
            this.valid_Questions[x] = dialog.Questions[x];
        }
        console.log(`Valid Questions:`);
        console.log(this.valid_Questions);
    }

    //Used to remove a question from the valid array
    UpdateValid(){

    }

    GrabQuestion(){
        //Grab a question via random index from valid_Questions array.
    }
}
//#endregion Dialog




class GameManager {
    constructor() {
        this.powersLeft = 2; //How many times they can remove 1 incorrect answer from the options during the game
        this.score = 0;
        this.max_Score = 5;
        this.dialogBuilder = new DialogBuilder();
    }

    Start(){
        this.dialogBuilder.Start();
    }

    Update(){

    }
}