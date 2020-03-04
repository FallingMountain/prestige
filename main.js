var data = {
	coins: 0,
	prestiges: [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]
};

function getGain() {
	var gain = 1
	for (var i = 0; i<10; i++) {
	gain *= Math.floor(Math.pow((1+data.prestiges[i][0]), (1+data.prestiges[i][1])));
	}
	return Math.floor(gain*100)/100;
}

function getRequirement(id) {
	if (id === 0) {
		return Math.floor(Math.pow(1.5 - (data.prestiges[0][2]*0.1),data.prestiges[0][0])*10);
	} else {
		return Math.pow(id+1,data.prestiges[id][0]+1)
	}
}

function canActivatePrestige(id) {
	if (id===0) {
		return (data.coins >= getRequirement(0));
	} else {
		return (data.prestiges[id-1][0] >= getRequirement(id));
	}
}

function activatePrestige(id) {
	if (canActivatePrestige(id)) {
			data.coins = 0;
			for (var i = 0; i < id; i++) {
				data.prestiges[i][0] = 0;
			}
			data.prestiges[id][0]++;
	}
	draw();
}

function update() {
	data.coins += getGain()/30;
	localStorage.whydididothis = JSON.stringify(data);
}
function boostMac(tier) {
	if (tier === 0) {
	var boost1 = Math.log2(data.prestiges[tier][0]*(data.prestiges[0][2]+1))/2;
	
	data.prestiges[tier][0] = 0;
	if (boost1 >= 2 && data.prestiges[0][2] === 0) {
		data.prestiges[0][2] = 1;
		data.prestiges[0][0] = 0;
	}
	if (boost1 > data.prestiges[tier][1]) data.prestiges[tier][1] = boost1
	}
}
function draw() {
	document.getElementById("coins").innerHTML = Math.round(data.coins);
	document.getElementById("gain").innerHTML = getGain();
	//To hide the boost machine
	var boostT1 = document.getElementsByClassName("boost");
	if(data.prestiges[2][0] > 0) {
	for(var i = 0; i < boostT1.length; i++) {
	boostT1[i].style.display = "";
	}
	}else {
	for(var i = 0; i < boostT1.length; i++) {
	boostT1[i].style.display = "none";
	}}
	
	for(var i = 0; i < 10; i++) {
		document.getElementById("tier"+(i+1)+"cost").innerHTML = getRequirement(i);
		document.getElementById("tier"+(i+1)+"a").innerHTML = data.prestiges[i][0];
		document.getElementById("tier"+(i+1)+"mul").innerHTML = "x"+(Math.floor(Math.pow((1+data.prestiges[i][0]), (1+data.prestiges[i][1]))));
		if (canActivatePrestige(i)) {
			document.getElementById("tier"+(i+1)+"btn").disabled = false;
		} else {
			document.getElementById("tier"+(i+1)+"btn").disabled = true;
		}
	}
	document.getElementById("tier1b").innerHTML = "^"+((Math.floor(data.prestiges[0][1]*100)/100)+1);
	
}

window.addEventListener("load",function () {
	if (localStorage.whydididothis) {
		data = JSON.parse(localStorage.whydididothis)
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
