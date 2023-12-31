import { MonacoEditorLanguageClientWrapper, vscode } from "./monaco-editor-wrapper/index.js";
import { buildWorkerDefinition } from "./monaco-editor-workers/index.js";
import monarchSyntax from "./syntaxes/robot.monarch.js";

buildWorkerDefinition('./monaco-editor-workers/workers', new URL('', window.location.href).href, false);

MonacoEditorLanguageClientWrapper.addMonacoStyles('monaco-editor-styles');

const wrapper = new MonacoEditorLanguageClientWrapper();
const editorConfig = wrapper.getEditorConfig();
editorConfig.setMainLanguageId('robot-language');

editorConfig.setMonarchTokensProvider(monarchSyntax);

let code = `def entry() {
    square();
    round_trip();
  }
  
  def move(int distance, int speed) {
    setspeed speed;
    forward distance m;
  }

  def square(){
    int cpt = 1;
    while (cpt< 5){
        move (20,cpt*5);
        turnright(90);
        cpt = cpt+1;
    }
  }

  def control_speed(int speed) {
    if speed > 0 {
      setspeed speed;
    } else {
      setspeed 0;
    }
  }
  
  def round_trip() {
    control_speed(50);
    forward 20 cm;
    control_speed(-50);
    forward 20 cm;
  }`

editorConfig.setMainCode(code);

editorConfig.theme = 'vs-dark';
editorConfig.useLanguageClient = true;
editorConfig.useWebSocket = false;

const typecheck = (async () => {
    console.info('typechecking current code...');

    if(errors.length > 0){
        const modal = document.getElementById("errorModal");
        modal.style.display = "block";
    } else {
        const modal = document.getElementById("validModal");
        modal.style.display = "block";
    }
});

const parseAndValidate = (async () => {
    console.info('validating current code...');
    const code = wrapper.editor.getValue();
    const errors = await vscode.commands.executeCommand('parseAndValidate', code);

    if(errors.length > 0){
        const modal = document.getElementById("errorModal");
        modal.style.display = "block";
        errors.forEach((error) => {
            const errorDiv = document.createElement("div");
            errorDiv.innerHTML = error;
            modal.getElementsByClassName("modal-body")[0].appendChild(errorDiv);
        });
    } else {
        const modal = document.getElementById("validModal");
        modal.style.display = "block";
    }
    
});

const execute = (async () => {
    console.info('running current code...');
    const codeToExecute = wrapper.getEditor().getValue();
    const simulatorDiv = document.querySelector('.simulator');
    // Execute custom LSP command, and receive the response
    const scene = await vscode.commands.executeCommand('parseAndGenerate', [codeToExecute, simulatorDiv.clientWidth, simulatorDiv.clientHeight])
    window.setupSimulator = setupSimulator(scene); 
});

const setupSimulator = (scene) => {

    const wideSide = max(scene.size.x, scene.size.y);
    let factor = 1000 / wideSide;

    window.scene = scene;

    scene.entities.forEach((entity) => {
        if (entity.type === "Wall") {
            window.entities.push(new Wall(
                (entity.pos.x)*factor,
                (entity.pos.y)*factor,
                (entity.size.x)*factor,
                (entity.size.y)*factor
                ));
        }
        if (entity.type === "Block") {
            window.entities.push(new Wall(
                (entity.pos.x)*factor,
                (entity.pos.y)*factor,
                (entity.size.x)*factor,
                (entity.size.y)*factor
                ));
        }
    });

    window.p5robot = new Robot(
        factor,
        scene.robot.pos.x,
        scene.robot.pos.y,
        scene.robot.size.x * factor,
        scene.robot.size.y * factor,
        scene.robot.rad
    );
}

window.execute = execute;
window.typecheck = typecheck;
window.parseAndValidate = parseAndValidate;

var errorModal = document.getElementById("errorModal");
var validModal = document.getElementById("validModal");
var closeError = document.querySelector("#errorModal .close");
var closeValid = document.querySelector("#validModal .close");

closeError.onclick = function() {
    errorModal.style.display = "none";
}
closeValid.onclick = function() {
    validModal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == validModal) {
        validModal.style.display = "none";
    }
    if (event.target == errorModal) {
        errorModal.style.display = "none";
    }
  } 

const workerURL = new URL('./robot-server-worker.js', import.meta.url); // WARNING Dependent of your project
console.log(workerURL.href);

const lsWorker = new Worker(workerURL.href, {
    type: 'classic',
    name: 'Robot Server'
});
wrapper.setWorker(lsWorker);

// keep a reference to a promise for when the editor is finished starting, we'll use this to setup the canvas on load
const startingPromise = wrapper.startEditor(document.getElementById("monaco-editor-root"));





  
  