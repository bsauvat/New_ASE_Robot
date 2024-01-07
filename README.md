# Robot project - ASE

Developed by Quentin Legrand & Bastien Sauvat

## 💻 Presentation

For this project we developed ASE_Robot, a language to define the behavior of a small robot.
This DSL include modeling domain and the associated tooling , an interpretor and a compiler. 

**Major part chosen for notation: interpreter**

## 🔨 Architecture

Here is the model we created and relied on for our DSL.
<img src="model.png">

## 📝 Running

To use the DSL, you need to :
- install these precise versions of Langium and Yo
```bash
npm install -g yo@4.3.1 generator-langium@2.0.0
```
- clone this repository
```bash 
git clone https://github.com/bsauvat/New_ASE_Robot.git
```
- place yourself in the robot directory
```bash 
cd robot
```
- build the project
```bash 
npm run build:web
```
- run the server
```bash 
npm run serve
```
- open port 3000 : 
http://localhost:3000/

## 💻 Interpreter

We tried 2 possibilities to develop our interpreter :
- **classic method following langium web tutorial**
- **web sockets method**

We encountered **errors for both solutions** that we did not arrive to resolve that are the following ones :

For the **classic method following langium web tutorial** :

<img src="./assets/msg_error_web.png">

The error message **"Dynamic require of "util" is not supported"** appears in the web console after lunching the command : npm run serve.
Unfortunately, we never managed to resolve this bug even when trying to change dependencies and versions.

When clicking on **Execute simulation** on the web page, we get the error **"Uncaught (in promise) Error: command 'parseAndGenerate' not found** 


For the **web sockets method** :

<img src="./assets/msg_error_websocket.png">


