/*


======[ KNOWN BUGS ]=======
Sometimes when clicking on a correct answer it won't update the UI but will remove the question from the valid_questions array, allowing you to skip a question by clicking the correct answer twice

Doesn't seem to remove the previous question from the valid_questions array when you click the correct answer (Noticed with the colossus and black hole questions)
*/
let canvas = null;
let context = null;
let manager = null;



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
                {Text: "Shit, let me do over", Response: "Start"}
            ]
        },
        Wrong : {
            Text: "Unfortunately that answer was incorrect. Would you like to restart?",
            Options:[
                {Text: "Sure", Response: "Start"},
                {Text: "Nah", Response: "End"}
            ]
        },
        Finished : {
            Text: "Congratulations, you answered every question correctly!",
            Options: [
                {Text: "Thank fuck", Response: "End"}
            ]
        }
    },
    Questions : [
        {
            Text: "What is the black hole at the center of the Milky Way galaxy?",
            Options: [ //1 = Correct, 0 = Incorrect
                {Text: "A. Sagittarius A*", Correct:1},
                {Text: "B. Centaurus A", Correct:0},
                {Text: "C. Messier", Correct:0},
                {Text: "D. Sagittarius A", Correct:0},
            ]
        },
        {
            Text: "What year was the Colossus computer created?",
            Options: [ //1 = Correct, 0 = Incorrect
                {Text: "A. 1940", Correct:0},
                {Text: "B. 1948", Correct:0},
                {Text: "C. 1944", Correct:1},
                {Text: "D. 1943", Correct:0},
            ]
        },
        {
            Text: "How long did the shortest war last?",
            Options: [
                {Text: "A. Less than 40 minutes", Correct:1},
                {Text: "B. 1 day", Correct:0},
                {Text: "C. 2 hours", Correct:0},
                {Text: "D. 4 days", Correct:0},
            ]
        },
        {
            Text: "In Norse Mythology, what is the name of Odin's 8 legged horse?",
            Options: [
                {Text: "A. Mistake", Correct:0},
                {Text: "B. Angrboda", Correct:0},
                {Text: "C. Aesir", Correct:0},
                {Text: "D. Sleipnir", Correct:1},
            ]
        },
        {
            Text: "In what year did the moon landing take place?",
            Options: [
                {Text: "A. 1969", Correct:1},
                {Text: "B. 1968", Correct:0},
                {Text: "C. 1970", Correct:0},
                {Text: "D. 1967", Correct:0},
            ]
        },
        {
            Text: "What was the first animal sent into space?",
            Options: [
                {Text: "A. A dog", Correct:0},
                {Text: "B. A monkey", Correct:0},
                {Text: "C. Some fruit flies", Correct:1},
                {Text: "D. Some rats", Correct:0},
            ]
        },
        /*{
            Text: "",
            Options: [
                {Text: "A. ", Correct:0},
                {Text: "B. ", Correct:0},
                {Text: "C. ", Correct:1},
                {Text: "D. ", Correct:0},
            ]
        },
        {
            Text: "",
            Options: [
                {Text: "A. ", Correct:0},
                {Text: "B. ", Correct:0},
                {Text: "C. ", Correct:1},
                {Text: "D. ", Correct:0},
            ]
        },
        {
            Text: "",
            Options: [
                {Text: "A. ", Correct:0},
                {Text: "B. ", Correct:0},
                {Text: "C. ", Correct:1},
                {Text: "D. ", Correct:0},
            ]
        },
        {
            Text: "",
            Options: [
                {Text: "A. ", Correct:0},
                {Text: "B. ", Correct:0},
                {Text: "C. ", Correct:1},
                {Text: "D. ", Correct:0},
            ]
        },*/
    ]
};

class DialogBuilder {
    constructor() {
        this.valid_Questions = []; //Table of valid questions for the game to pick from, questions get removed from here as they're asked to prevent duplicate questions showing up.
        this.current_Question_Index = 0; //Stores the index of the current qwestion in the valid_Questions array for easy removal.
        this.current_State = 0; //0 = States table, 1 = Questions table.
        this.current_Question_Info;
    }

    Start(){
        for(var x = 0; x < dialog.Questions.length; x++){
            this.valid_Questions[x] = dialog.Questions[x];
        }
        this.current_Question_Info = dialog.States.Start;
    }
    //Used to manually change dialog in cases of failed questions.
    SetStateDialog(dialogID){
        this.current_Question_Info = dialog.States[dialogID];
        console.log(this.current_Question_Info);
        manager.UI.Update();
    }

    //Used to remove a question from the valid array
    UpdateValid(){
        this.valid_Questions.splice(this.current_Question_Index, 1);
        if(this.valid_Questions.length <= 0){
            console.log("Finished all questions!");
            this.SetStateDialog("Finished");
            return;
        }
    }
    
    GrabQuestion(){
        //Grab a question via random index from valid_Questions array.
        if(this.current_State == 1){
            this.UpdateValid();
        }
        var index = Math.floor(Math.random() * this.valid_Questions.length);
        this.current_Question_Index = index;
        this.current_Question_Info = dialog.Questions[index];
        return this.valid_Questions[index];
    }
}
//#endregion Dialog

//#region UI
class UI {
    constructor(dialogBuilder) {
        this.buttons = [
            document.getElementById('firstResponse'),
            document.getElementById('secondResponse'),
            document.getElementById('thirdResponse'),
            document.getElementById('fourthResponse'),
        ];
        this.dialogBuilder = dialogBuilder;
    }
    
    
    Start(){
        /*this.buttons = [
            document.getElementById('firstResponse'),
            document.getElementById('secondResponse'),
            document.getElementById('thirdResponse'),
            document.getElementById('fourthResponse'),
            ];*/
            
            for(let x = 0; x < this.buttons.length; x++){
                const button = this.buttons[x];
                const response = this.dialogBuilder.current_Question_Info.Options[x];
                if(x >= this.dialogBuilder.current_Question_Info.Options.length){
                    button.style.display = 'none';
                }else{
                    button.style.display = 'inline-block';
                }
                try{ //Just to ignore the undefined errors for when the dialog has fewer responses than this button's position
                    button.textContent = response.Text;
                }
                catch{
                }
                button.addEventListener('click', this.HandleButtonEvent, false);
            }
        }
        //Needs to utilise the cached Manager variable at the top of the file to access the UI class' buttons, doesn't count as part of the class otherwise.
        HandleButtonEvent(event){
            var button = event.srcElement;
            var buttonArray = manager.UI.buttons;
            for(let x = 0; x < buttonArray.length; x++){
                if(buttonArray[x] != button){
                    continue;
                }
                manager.ResponseSent(manager.dialogBuilder.current_Question_Info.Options[x]);
            }
        }
        
        Draw(){
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.font = "15px Verdana";
        
            context.fillText(this.dialogBuilder.current_Question_Info.Text, 10, canvas.height * 0.75);
        
        }

        Update(){
        let currentInfo = this.dialogBuilder.current_Question_Info;
        for(var x = 0; x < this.buttons.length; x++){
            const button = this.buttons[x]
            let response = currentInfo.Options[x];
            if(x < currentInfo.Options.length){
                button.textContent = response.Text;
                button.style.display = 'inline-block'
            }else{
                button.style.display = 'none';
            }
        }
        this.Draw();
    }
}
//#endregion UI

class GameManager {
    constructor() {
        this.powersLeft = 2; //How many times they can remove 1 incorrect answer from the options during the game
        this.score = 0;
        this.max_Score = 5;
        this.dialogBuilder = new DialogBuilder();
        this.UI = new UI(this.dialogBuilder);
    }

    Start(){
        this.dialogBuilder.Start();
        this.UI.Start();
        
        this.UI.Draw();
    }
    
    Update(){

    }

    ResponseSent(response){
        if(response.Response != undefined){
            switch(response.Response){
                case "Continue":
                    this.dialogBuilder.GrabQuestion();
                    this.dialogBuilder.current_State = 1;
                    this.UI.Update();
                    break;
                case "Fail":
                    this.dialogBuilder.SetStateDialog("Fail");

                    break;
                case "Start":
                    //Reset some stuff
                    this.dialogBuilder.Start();
                    this.UI.Start();
                    this.UI.Draw();
                    break;
                case "End":
                    alert("Game Over!");
                    break;
            }
        }else {
            switch(response.Correct){
                case 0:
                    //failed
                    this.dialogBuilder.SetStateDialog("Wrong");
                    break;
                case 1:
                    //succeeded
                    console.log("Before:");
                    console.log(this.dialogBuilder.valid_Questions);
                    this.dialogBuilder.UpdateValid();
                    if(this.dialogBuilder.valid_Questions.length > 0){
                        this.dialogBuilder.GrabQuestion();
                        this.UI.Update();
                        console.log("After:");
                        console.log(this.dialogBuilder.valid_Questions);
                    }
                    break;
            }
        }
    }
}