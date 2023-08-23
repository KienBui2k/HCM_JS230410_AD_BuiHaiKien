class Player {
    id: number;
    name: string;
    point: number;
    constructor(
        name: string,
        point: number = 0,
        id: number = Date.now() * Math.random()
    ) {
        this.name = name;
        this.point = point;
        this.id = id;
    }
}
class playerManagger {
    listPlayer: Player[] = [];
    constructor() {
        let listPlayerLocal = JSON.parse(
            localStorage.getItem("listPlayer") ?? "[]"
        );
        let listPlayerTemp = [];
        for (let i in listPlayerLocal) {
            listPlayerTemp.push(
                new Player(
                    listPlayerLocal[i].name,
                    listPlayerLocal[i].point,
                    listPlayerLocal[i].id
                )
            );
        }
        this.listPlayer = listPlayerTemp;
        this.render();
        this.TotalPoints();
        this.TotalPlayer();
    }
    createPlayer(newPlayer: Player) {
        this.listPlayer.push(newPlayer);

        localStorage.setItem("listPlayer", JSON.stringify(this.listPlayer));
        this.render();
        
        this.TotalPlayer();
        const toastElement = document.getElementById("toastSuccess") as HTMLElement;
        toastElement.innerText = "Add player successfully!";
        toastElement.style.visibility = "visible";
        setTimeout(() => {
            toastElement.style.visibility = "hidden";
        }, 2000); 
    }
    hasPlayers(): boolean {
        return this.listPlayer.length > 0;
    }
    render(): void {
        let renderEl = document.querySelector(".body_game") as HTMLElement;
        let playerString = ``;
        
        if(this.hasPlayers()) {
        this.listPlayer.map((player) => {
            const highestScoringPlayers = this.kingPlayer();

            const isHighestScoring =
                highestScoringPlayers.length > 0 &&
                highestScoringPlayers.some(
                    (highestPlayer) => player.point == highestPlayer.point
                );
            const crownClass = isHighestScoring ? "ranking" : "";

            playerString += `
                    <div class="player">
                        <div class="player_edit">
                            <div class="delete_pl">
                                <i onclick="handleDeletePlayer(${player.id})" class="fa-solid fa-x"></i>
                            </div>
                            <div class="rank_pl">
                                <i class="fa-solid fa-crown kingPlayer ${crownClass}"></i>
                            </div>
                        </div>
                        <div class="player_name">
                            <h3>${player.name}</h3>
                        </div>
                        <div class="player_points">
                            <span onclick="handleDecreasePoint(${player.id})" ><i class="fa-solid fa-minus"></i></span>
                            <span class="point">${player.point}</span>
                            <span onclick="handleIncreasePoint(${player.id})"><i class="fa-solid fa-plus"></i></span>
                        </div>
                    </div>
                `;
        });
        // renderEl.innerHTML = playerString;
    }else {
       playerString += `<div class="no_player" >No players yet</div>`;
    }
     renderEl.innerHTML = playerString;
    }
    deletePlayer(id: number) {
        this.listPlayer = this.listPlayer.filter((player) => player.id != id);
        localStorage.setItem("listPlayer", JSON.stringify(this.listPlayer));
        this.render();
        this.TotalPoints();
        this.TotalPlayer();       
        const toastElement = document.getElementById("toastSuccess") as HTMLElement;
        toastElement.innerText = "Delete player successfully!";
        toastElement.style.visibility = "visible";
        setTimeout(() => {
            toastElement.style.visibility = "hidden";
        }, 2000); 

    }
    decreasePoint(id: number) {
        this.listPlayer = this.listPlayer.map((player) => {
            if (player.id === id) {
                if (player.point > 0) {
                    player.point -= 1;
                }
            }
            return player;
        });
        localStorage.setItem("listPlayer", JSON.stringify(this.listPlayer));
        this.render();
        this.TotalPoints();
    }
    increasePoint(id: number) {
        this.listPlayer = this.listPlayer.map((player) => {
            if (player.id === id) {
                player.point += 1;
            }
            return player;
        });
        localStorage.setItem("listPlayer", JSON.stringify(this.listPlayer));
        this.render();
        this.TotalPoints();
    }
    TotalPoints(): number {
        const totalPointsElement = document.getElementById(
            "total_points_number"
        ) as HTMLElement;
        let totalPoints = this.listPlayer.reduce((total, player) => {
            return total + player.point;
        }, 0);
        totalPointsElement.innerText = totalPoints.toString();
        return totalPoints;
    }
    TotalPlayer() {
        const totalPlayersElement = document.getElementById(
            "total_player_number"
        ) as HTMLElement;
        totalPlayersElement.innerHTML = this.listPlayer.length.toString();
    }
    kingPlayer() {
        if (this.listPlayer.length == 0) {
            return [];
        }
        const highestScore = this.listPlayer.reduce((highest, player) => {
            return Math.max(highest, player.point);
        }, 0);
        if (highestScore == 0) {
            return [];
        }

        return this.listPlayer.filter((player) => player.point == highestScore);
    }

}

const listPlayer = new playerManagger();

function createNewPlayer() {
    if (
        (document.getElementById("add_player") as HTMLInputElement).value != ""
    ) {
        let playerValue = (
            document.getElementById("add_player") as HTMLInputElement
        ).value;
        let newPlayer = new Player(playerValue);
        listPlayer.createPlayer(newPlayer);
        (document.getElementById("add_player") as HTMLInputElement).value = "";
    } else {
        const toastElement = document.getElementById("toastError") as HTMLElement;
        toastElement.innerText = "Please enter a name";
        toastElement.style.visibility = "visible";
        setTimeout(() => {
            toastElement.style.visibility = "hidden";
        }, 2000); 
      
    }
}
function handleDeletePlayer(id: number) {
    if (confirm("Do you want to delete player")) {
        listPlayer.deletePlayer(id);
    }
}
function handleDecreasePoint(id: number) {
    listPlayer.decreasePoint(id);
}
function handleIncreasePoint(id: number) {
    listPlayer.increasePoint(id);
}
