var game = {
	coins: new Decimal(0),
	prestiges: [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
	options: {
		notation:"Scientific"
	}
};

function getGain() {
	var gain = 1
	for (var i = 0; i<10; i++) {
	gain *= Math.floor(Math.pow((1+game.prestiges[i][0]), (1+game.prestiges[i][1])));
	}
	return Math.floor(gain*100)/100;
}

function getRequirement(id) {
	if (id === 0) {
		return Math.floor(Math.pow(1.5 - (game.prestiges[0][2]*0.1),game.prestiges[0][0])*10);
	} else {
		return Math.pow(id+1,game.prestiges[id][0]+1)
	}
}

function canActivatePrestige(id) {
	if (id===0) {
		return (game.coins >= getRequirement(0));
	} else {
		return (game.prestiges[id-1][0] >= getRequirement(id));
	}
}

function activatePrestige(id) {
	if (canActivatePrestige(id)) {
			game.coins = 0;
			for (var i = 0; i < id; i++) {
				game.prestiges[i][0] = 0;
			}
			game.prestiges[id][0]++;
	}
	draw();
}

function update() {
	game.coins += getGain()/30;
	localStorage.whydididothis = JSON.stringify(game);
}
function boostMac(tier) {
	if (tier === 0) {
	var boost1 = Math.log2(game.prestiges[tier][0]*(game.prestiges[0][2]+1))/3;
	
	game.prestiges[tier][0] = 0;
	if (boost1 >= 2 && game.prestiges[0][2] === 0) {
		game.prestiges[0][2] = 1;
		game.prestiges[0][0] = 0;
	}
	if (boost1 > game.prestiges[tier][1]) game.prestiges[tier][1] = boost1
	}
}
function draw() {
	document.getElementById("coins").innerHTML = Math.round(game.coins);
	document.getElementById("gain").innerHTML = getGain();
	//To hide the boost machine
	var boostT1 = document.getElementsByClassName("boost");
	if(game.prestiges[2][0] > 0) {
	for(var i = 0; i < boostT1.length; i++) {
	boostT1[i].style.display = "";
	}
	}else {
	for(var i = 0; i < boostT1.length; i++) {
	boostT1[i].style.display = "none";
	}}
	
	for(var i = 0; i < 10; i++) {
		document.getElementById("tier"+(i+1)+"cost").innerHTML = getRequirement(i);
		document.getElementById("tier"+(i+1)+"a").innerHTML = game.prestiges[i][0];
		document.getElementById("tier"+(i+1)+"mul").innerHTML = "x"+(Math.floor(Math.pow((1+game.prestiges[i][0]), (1+game.prestiges[i][1]))));
		if (canActivatePrestige(i)) {
			document.getElementById("tier"+(i+1)+"btn").disabled = false;
		} else {
			document.getElementById("tier"+(i+1)+"btn").disabled = true;
		}
	}
	document.getElementById("tier1b").innerHTML = "^"+((Math.floor(game.prestiges[0][1]*100)/100)+1);
	
}

window.addEventListener("load",function () {
	if (localStorage.whydididothis) {
		game = JSON.parse(localStorage.whydididothis)
	}
	draw();
	for (var i = 0; i < 10; i++) {
		document.getElementById("tier"+(i+1)+"btn").addEventListener(
			"click",
			(function(n) {
				return (function () {
					activatePrestige(n);
				})
			}(i))
		);
	}
	setInterval(function () {
		update();
		draw();
	}, 33);
	console.log("interval loaded")
})
