const SOCKET_URL = "ws://localhost:3003";

let webSocket = new WebSocket(SOCKET_URL);

webSocket.onopen = () => {
    console.info("web socket open");
};

export function sendCode(code) {
    console.log(typeof code);
    console.log(code);
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
    console.log(message.data);
    console.log(message.type);
    switch (message.type) {
        case "robot":
            console.log(message.data);
            const robotData = message.data;
            window.p5robot.turn(robotData.angle);
            window.p5robot.move(robotData.dist);
            break;
        case "scene":
            console.log(message.data.scene);
            const scene = message.data.scene;
            window.setupSimulator(scene);
        case "parseAndValidate":
            console.log(message.text);
            break;
        default:
            console.log("default");
            break;
    }
}
