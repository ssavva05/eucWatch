//	//this.maker=require("Storage").readJSON("dash.json",1)['slot'+require("Storage").readJSON("dash.json",1).slot+'Maker'];
//	//this.mac=require("Storage").readJSON("dash.json",1)['slot'+require("Storage").readJSON("dash.json",1).slot+'Mac'];

global.euc= {
	state: "OFF",
	reconnect:0,
    busy:0,
    chrg:0,
	updateDash:function(slot){require('Storage').write('eucSlot'+slot+'.json', euc.dash);},
	tgl:function(){ 
		if (this.state!="OFF" ) {
			digitalPulse(D16,1,[90,60,90]);  
			if (!set.def.acc) acc.off();
			this.seq=1;
			this.state="OFF";
			this.updateDash(require("Storage").readJSON("dash.json",1).slot);
			face.go(set.dash[set.def.dash],0);return;
		}else {
			NRF.setTxPower(4);
			digitalPulse(D16,1,100); 
			this.mac=require("Storage").readJSON("dash.json",1)["slot"+require("Storage").readJSON("dash.json",1).slot+"Mac"];
			if(!this.mac) {
				face.go('dashScan',0);return;
		    }else {
				eval(require('Storage').read('euc'+require("Storage").readJSON("dash.json",1)["slot"+require("Storage").readJSON("dash.json",1).slot+"Maker"]));
				this.state="ON";
				if (!set.def.acc) acc.on();
				this.seq=1;
				this.conn(this.mac); 
				face.go(set.dash[set.def.dash],0);return;
            }
		}
	} 
};
//init
if (Boolean(require("Storage").read('eucSlot'+require("Storage").readJSON("dash.json",1).slot+'.json'))) { 
euc.dash=require("Storage").readJSON('eucSlot'+require("Storage").readJSON("dash.json",1).slot+'.json',1);
}else euc.dash=require("Storage").readJSON("eucSlot.json",1);
