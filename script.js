let model = {
    boardSize : 7,
    numShips: 3,
    shipSunks : 0,
    shipLength: 3,

    ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },
             { locations: [0, 0, 0], hits: ["", "", ""] },
             { locations: [0, 0, 0], hits: ["", "", ""] } ],

    fire: function(guess){
        for(let i = 0; i < this.numShips ; i++){
            let ship = this.ships[i]
            let index = ship.locations.indexOf(guess)

            if(ship.hits[index] === "hit"){
                view.displayMessage("Oops! You have already hit that location")
                return true
            }
            else if(index >= 0){
                ship.hits[index] = "hit"
                view.displayHit(guess)
                view.displayMessage("HIT!")
                if(this.isSunk(ship)){
                    this.shipSunks++
                    view.displayMessage("You sank my battleship!")
                }
                return true
            }
        }
        view.displayMiss(guess)
        view.displayMessage("You missed.")
        return false
    },

    isSunk : function(ship){
        for(let i = 0; i < this.shipLength ; i++){
            if(ship.hits[i] !== "hit"){
                return false
            } 
        }
        return true 
    },
    
    generateShipLocations: function(){
        let locations
        for(let i = 0; i < this.numShips; i++){
            do{
                locations = this.generateShip()
            }
            while(this.collision(locations))
                this.ships[i].locations = locations
        }
    },

    generateShip : function(){
        let direction = Math.floor(Math.random() * 2)
        let row, col
        //if direction = 1, ship is placed horizontal
        if (direction === 1){
            row = Math.floor(Math.random() * this.boardSize)
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1))
        }
        //if direction = 0, ship is placed vertical
        else{
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1))
            col = Math.floor(Math.random() * this.boardSize)
        }

        let newShipLocations = []
            for(let i = 0; i < this.shipLength; i++){
                if(direction === 1){
                    newShipLocations.push(row + "" + (col + i))
                }
                else{
                    newShipLocations.push((row + i) + "" + col)
                }
            }
            return newShipLocations
    },

    collision: function(locations){
        for(let i = 0; i < this.numShips; i++){
            let ship = this.ships[i]
            for(let j = 0; j < locations.length; j++){
                if(ship.locations.indexOf(locations[j]) >= 0){
                    return true
                } 
            }
        }
        return false
    }
}

let view = {
    displayMessage: function(msg){
        let messageArea = document.getElementById("message-area")
        messageArea.innerHTML = msg
    },
    displayHit: function(location){
        let cell = document.getElementById(location)
        cell.setAttribute('class','hit')
    },
    displayMiss: function(location){
        let cell = document.getElementById(location)
        cell.setAttribute('class','miss')
    }
}

let controller = {
    guesses : 0,
    processGuess : function(guess){
        let location = parseGuess(guess)
        if(location){
            this.guesses++
            let hit = model.fire(location)
            if (hit && model.shipSunks === model.numShips){
                view.displayMessage("You sank my all ships in," + this.guesses + " guesses")
            }
        }
    }
}

function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"]
    if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.")
    } else {
    firstChar = guess.charAt(0)
    let row = alphabet.indexOf(firstChar)
    let column = guess.charAt(1)

        if ( isNaN(row) || isNaN(column) ){
            alert("Oops! that isn't on the board")
        }
        else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
            alert("Oops! that's off the board")
        }
        else{
            return row + column
        }
    }
    return null
}

function handleFireBtn(){
    let guess = document.getElementById("guess-input").value
    controller.processGuess(guess)

    guess = ""
}

function handleKeyPress(e) {
    let fireButton = document.getElementById("fire-btn");
    if (e.key === 'Enter') {
    fireButton.click();
    return false;
    }
   }

window.onload = init


function init(){
    document.getElementById("fire-btn").addEventListener('click',() => {
        handleFireBtn()
    })
    let guessInput = document.getElementById("guess-input")
    guessInput.onkeydown = handleKeyPress

    model.generateShipLocations()
}





