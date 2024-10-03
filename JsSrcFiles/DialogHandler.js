let currentDialID = "Start";
let prevDialID = "None";
let responseButtons = [];

const textJSON = `
[
    {
        "Text": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        "ID": "Start",
        "Next": "Test1",
        "Responses": ["Cool", "Die"]
    },
    {
        "Text": "Goodbye World",
        "ID": "Test1",
        "Next": "Start",
        "Responses": ["Come Back"]
    }
]`
let dialTable = {};

function DialogStartup(){
    responseButtons = [
        document.getElementById("firstResponse"),
        document.getElementById("secondResponse"),
        document.getElementById("thirdResponse"),
        document.getElementById("fourthResponse")
    ]
    var json = ReadJSON();
    for(var i = 0, dial; i < json.length; i++){
        dial = json[i];
        dialTable[dial.ID] = dial;
    }
    //responseButtons[0] = document.getElementById("firstResponse");
    //responseButtons[1] = document.getElementById("secondResponse");
    DrawText(dialTable[currentDialID].Text);
}

function DrawCanvas(){
    var canvas = document.getElementById("dialCanvas");
    var context = canvas.getContext("2d");

    context.fillStyle = "#6b6961";
    context.fillRect(0, 0, canvas.width - 1, canvas.height - 1);

}

function WrapText(txt){
    //https://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
    for(var n = 0; n < txt.length; n++){
        
    }
}

function DrawText(txt){
    var canvas = document.getElementById("dialCanvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    DrawCanvas();
    context.font = "30px Verdana";
    let gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "black");

    context.fillStyle = gradient;

    context.fillText(txt, 10, canvas.height * 0.75);
}

function ReadJSON(){
    var json = JSON.parse(textJSON);
    return json;
}

function UpdateButtons(){
    var responses = dialTable[currentDialID].Responses;
    for(i = 0; i < responseButtons.length; i++){
        var button = responseButtons[i];
        if(i > responses.length){
            button.display = 'none';
            button.hidden = 'hidden';
            continue;
        }
        button.hidden = 'hidden';
        button.display = 'inline-block'
        button.textContent = responses[i];
    }
    
}

function UpdateDialog(next){ //0 = previous, 1 = next
    var txt
    if(next == 0){
        txt = dialTable[prevDialID].Text;
        prevDialID = currentDialID;
        currentDialID = prevDialID;
    }else{
        txt = dialTable[dialTable[currentDialID].Next].Text;
        prevDialID = currentDialID;
        currentDialID = dialTable[currentDialID].Next;
    }
    DrawText(txt)
    UpdateButtons();
}