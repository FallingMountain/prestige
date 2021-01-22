class prestige {
	constructor(amt, exp, sac, sge) {
	//Amount
	this.amt = amt;
	//Exponent
	this.exp = exp;
	//Amt Sacrificed
	this.sac = sac;
	//Amount of Powersurges
	this.sge = sge;
	}
	
	
}
const scientific = new ADNotations.ScientificNotation();
var game = {
	coins: new Decimal(0),
	nano: new prestige(new Decimal(0), 1, new Decimal(0), 0),
	micro: new prestige(new Decimal(0), 1, new Decimal(0), 0),
	mini: new prestige(new Decimal(0), 1, new Decimal(0), 0),
	small: new prestige(new Decimal(0), 1,new Decimal(0), 0)
};

function getGain() {
	var gain = new Decimal(1)
	gain = gain.times(game.nano.amt.pow(game.nano.exp).plus(1));
	gain = gain.times(game.micro.amt.pow(game.micro.exp).plus(1));
	gain = gain.times(game.mini.amt.pow(game.mini.exp).plus(1));
	return gain.floor();
}

function getRequirement(id) {
	switch(id) {
		case 0:
			return new Decimal(1.5).pow(game.nano.amt).times(10);
		break
		case 1:
			return new Decimal(2).pow(game.micro.amt.plus(1))
		break
		case 2:
			return new Decimal(3).pow(game.mini.amt.plus(1))
		break
	}
}

function activatePrestige(id) {
	switch(id) {
		case 0:
		if (game.coins.gte(getRequirement(0))) {
			game.coins = new Decimal(0);
			game.nano.amt = game.nano.amt.plus(1)
		}
		break
		case 1:
		if (game.nano.gte(getRequirement(id))); {
			game.coins = new Decimal(0);
			game.micro.amt = game.micro.amt.plus(1);
			game.nano.amt = new Decimal(0);
		}
		case 2:
		if (game.micro.gte(getRequirement(id))); {
			game.coins = new Decimal(0);
			game.mini.amt = game.mini.amt.plus(1);
			game.micro.amt = new Decimal(0);
			game.nano.amt = new Decimal(0);
		}
		break
	}
	draw();
}

function update() {
	game.coins = game.coins.plus(getGain().div(30));
	save();
}
	
function boostMac(tier) {
	switch(tier) {
	case 0:
		let boostTemp = game.nano.amt.plus(game.nano.sac).log(3);
		if (game.nano.sge > 0) boostTemp = boostTemp.times.(game.nano.sge/5)
		game.nano.sac = game.nano.sac.plus(game.nano.amt);
		game.nano.amt = new Decimal(0);
		game.money = new Decimal(0);
		game.nano.exp = boostTemp.div(10).plus(1);
	break
	    
	}
}
	
	

//Saving, loading, and exporting. I stole some code from Superspruce for this.
function objectToDecimal(object) {
    for (let i in object) {
        if (typeof(object[i]) == "string" && new Decimal(object[i]) instanceof Decimal && !(new Decimal(object[i]).sign == 0 && object[i] != "0")) {
          object[i] = new Decimal(object[i]);
        }
        if (typeof(object[i]) == "object") {
            objectToDecimal(object[i]);
        }
    }
}
function merge(base, source) {
    for (let i in base) {
        if (source[i] != undefined) {
            if (typeof(base[i]) == "object" && typeof(source[i]) == "object" && !isDecimal(base[i]) && !isDecimal(source[i])) {
                merge(base[i], source[i]);
            } else {
                if (isDecimal(base[i]) && !isDecimal(source[i])) {
                    base[i] = new Decimal(source[i]);
                } else if (!isDecimal(base[i]) && isDecimal(source[i])) {
                    base[i] = source[i].toNumber();
                } else {
                    base[i] = source[i];
                }
            }
        }
    }
}
function isDecimal(x) {
    if (x.array != undefined && x.plus != undefined) {
        return true;
    } else {
        return false;
    }
}
var savegame;
function save() {
  localStorage.setItem("whydididothis", JSON.stringify(game));
}
function load() {
	if (localStorage.getItem("whydididothis")) {
    savegame = JSON.parse(localStorage.getItem("whydididothis"));
    objectToDecimal(savegame);
    merge(game, savegame);

  }
}

function draw() {
	document.getElementById("coins").innerHTML = scientific.format(game.coins,2,2)
	document.getElementById("gain").innerHTML = scientific.format(getGain(),2,2);
	//To hide the boost machine
	var boostT1 = document.getElementsByClassName("boost");
	if(game.mini.amt.gte(0)) {
	for(var i = 0; i < boostT1.length; i++) {
	boostT1[i].style.display = "";
	}
	}else {
	for(var i = 0; i < boostT1.length; i++) {
	boostT1[i].style.display = "none";
	}}
	
	document.getElementById("tier1cost").innerHTML = scientific.format(getRequirement(0),2,2);
	document.getElementById("tier1a").innerHTML = scientific.format(game.nano.amt,2,2);
	document.getElementById("tier1mul").innerHTML = "x"+scientific.format(Decimal.pow(game.prestiges.nano.plus(1)),game.nano.exp),2,2);
	if (game.coins.gte(getRequirement(0))) {
		document.getElementById("tier1btn").disabled = false;
	} else {
		document.getElementById("tier1btn").disabled = true;
	}
	document.getElementById("tier1b").innerHTML = "^"+scientific.format(game.nano.exp,2,2);
	
	
	document.getElementById("tier2cost").innerHTML = scientific.format(getRequirement(1),2,2);
	document.getElementById("tier2a").innerHTML = scientific.format(game.micro.amt,2,2);
	document.getElementById("tier2mul").innerHTML = "x"+scientific.format(Decimal.pow(game.prestiges.micro.plus(1)),game.micro.exp),2,2);
	if (game.coins.gte(getRequirement(1))) {
		document.getElementById("tier2btn").disabled = false;
	} else {
		document.getElementById("tier2btn").disabled = true;
	}
	document.getElementById("tier3cost").innerHTML = scientific.format(getRequirement(2),2,2);
	document.getElementById("tier3a").innerHTML = scientific.format(game.mini.amt,2,2);
	document.getElementById("tier3mul").innerHTML = "x"+scientific.format(Decimal.pow(game.prestiges.mini.plus(1)),game.mini.exp),2,2);
	if (game.coins.gte(getRequirement(2))) {
		document.getElementById("tier3btn").disabled = false;
	} else {
		document.getElementById("tier3btn").disabled = true;
	}
}

window.addEventListener("load",function () {
	load();
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
