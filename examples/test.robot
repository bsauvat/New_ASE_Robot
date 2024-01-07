def main() {
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
}