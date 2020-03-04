var game = {
	coins: new Decimal(0),
	prestiges: [[new Decimal(0),0,0],[new Decimal(0),0,0],[new Decimal(0),0,0],[new Decimal(0),0,0],[new Decimal(0),0,0],[new Decimal(0),0,0],[new Decimal(0),0,0],[new Decimal(0),0,0],[new Decimal(0),0,0],[new Decimal(0),0,0]],
	options: {
		notation:"Scientific"
	}
};

function getGain() {
	var gain = new Decimal(1)
	for (var i = 0; i<10; i++) {
	gain = gain.times(game.prestiges[i][0].pow(game.prestiges[i][1].plus(1)));
	}
	return gain.floor();
}

function getRequirement(id) {
	if (id === 0) {
		return new Decimal(1.5 - (game.prestiges[0][2]*0.1)).pow(game.prestiges[0][0]).times(10);
	} else {
		return new Decimal(id+1).pow(game.prestiges[id][0]+1)
	}
}

function canActivatePrestige(id) {
	if (id===0) {
		return (game.coins.cmp(getRequirement(0)));
	} else {
		return (game.prestiges[id-1][0].cmp(getRequirement(id)));
	}
}

function activatePrestige(id) {
	if (canActivatePrestige(id) === 1) {
			game.coins = new Decimal(0);
			for (var i = 0; i < id; i++) {
				game.prestiges[i][0] = new Decimal(0);
			}
			game.prestiges[id][0].plus(1);
	}
	draw();
}

function update() {
	game.coins.plus(getGain().div(30));
	localStorage.whydididothis = JSON.stringify(game);
}
function boostMac(tier) {
	if (tier === 0) {
	var boost1 = new Decimal(game.prestiges[0].log(3));
	game.prestiges[tier][0] = new Decimal(0);
	if (boost1.cmp(2) === 1&& game.prestiges[0][2] === 0) {
		game.prestiges[0][2] = 1;
		game.prestiges[0][0] = new Decimal(0);
	}
	if (boost1 > game.prestiges[tier][1]) game.prestiges[tier][1] = boost1
	}
}
function draw() {
	document.getElementById("coins").innerHTML = shortenMoney(game.coins)
	document.getElementById("gain").innerHTML = shortenMoney(getGain());
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
		document.getElementById("tier"+(i+1)+"cost").innerHTML = shortenMoney(getRequirement(i));
		document.getElementById("tier"+(i+1)+"a").innerHTML = shortenMoney(game.prestiges[i][0]);
		document.getElementById("tier"+(i+1)+"mul").innerHTML = "x"+shortenMoney(new Decimal(1+game.prestiges[i][0]).pow(game.prestiges[i][1].plus(1))));
		if (canActivatePrestige(i) === 1) {
			document.getElementById("tier"+(i+1)+"btn").disabled = false;
		} else {
			document.getElementById("tier"+(i+1)+"btn").disabled = true;
		}
	}
	document.getElementById("tier1b").innerHTML = "^"+shortenMoney(game.prestiges[0][1]);
	
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
