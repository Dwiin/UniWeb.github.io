let currentDialID = "Start";
let prevDialID = "None";
const url = "Dialog.json";

function DrawCanvas(){
    var canvas = document.getElementById("dialCanvas");
    var context = canvas.getContext("2d");

    context.fillStyle = "#6b6961";
    context.fillRect(0, 0, canvas.width - 1, canvas.width - 1);

    var txt = "Hello World";
    context.font = "30px Verdana";
    let gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "black");

    context.fillStyle = gradient;

    context.fillText(txt, 10, 90);

}

async function ReadJSON(){
    const response = await fetch("Dialog.json");
    const json = await response.json();
    console.log(json);
    /*fetch("./Dialog.json").then((res) => {
        if(!res.ok){
            alert("Shit's fucked");
        }
        console.log(res.json());
    });*/
}


function NextDial(){
}

function PrevDial(){
    if(prevDialID == "None")return;

}