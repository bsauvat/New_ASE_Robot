const SOCKET_URL = "ws://localhost:3003";

let webSocket = new WebSocket(SOCKET_URL);

webSocket.onopen = () => {
    console.info("web socket open");
};

export function sendCode(code) {
    const msg = {
        type: "code",
        text: code,
        date: Date.now(),
    };

    webSocket.send(JSON.stringify(msg));
}

export function sendParseAndValidate(codeToParse) {
    const msg = {
        type: "parseAndValidate",
        text: codeToParse,
        date: Date.now(),
    };
    webSocket.send(JSON.stringify(msg));
}

webSocket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
        case "robot":
            const robotData = message.data;
            window.p5robot.turn(robotData.angle);
            window.p5robot.move(robotData.dist);
            break;
        case "scene":
            const scene = message.data.scene;
            window.setupSimulator(scene);
        case "parseAndValidate":
            console.log("code to parse \n",message.text);
            break;
        default:
            console.log("default");
            break;
    }
}
