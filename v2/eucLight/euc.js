//euc module loader
global.euc= {
	state: "OFF",
	reconnect:0,
    busy:0,
	night:1,
	day:[7,19],
	run:0,
	update:function(slot){require('Storage').write('eucSlot'+slot+'.json', dash.live);},
	start:function(){
		if (this.state!="OFF") {print(1);return;}
		NRF.setTxPower(0);
		//buzzer([100,80,100,80,100]);
		buzzer(300);

		//this.mac=require("Storage").readJSON("dash.json",1)["slot"+require("Storage").readJSON("dash.json",1).slot+"Mac"];
		this.mac=set.def.mac;
		//this.mac="64:69:4e:75:89:4d public";
		//this.mac="f8:33:31:a5:ef:fe public";
		if(!this.mac) {
			print("nomac");
			//eval(require('Storage').read('eucScan'));
			//scan.go('dash','fff0');
		}else {
			print("on");
			eval(require('Storage').read('euc'+require("Storage").readJSON("dash.json",1)["slot"+require("Storage").readJSON("dash.json",1).slot+"Maker"]));
			this.state="ON";
			if (require('Storage').read('proxy'+dash.live.maker)&&set.bt==4){
				eval(require('Storage').read('proxy'+dash.live.maker));
			}	
			//if (global.acc) acc.on(2);
			this.conn(this.mac); 
		}
	},
	end:function(){
			if (this.state=="OFF") return;
			print("off");
			//set.bt=4;
			//euc.update(require("Storage").readJSON("dash.json",1).slot);
			this.state="OFF";
			euc.wri("end");
			return;
	},
	tgl:function(){ 
		if(euc.state=="OFF")
			euc.start();
		else 
			euc.end();
	}
};
if (!global.dash) global.dash={} ;

//init
if (Boolean(require("Storage").read('eucSlot'+require("Storage").readJSON("setting.json",1).dashSlot+'.json'))) { 
dash.live=require("Storage").readJSON('eucSlot'+require("Storage").readJSON("setting.json",1).dashSlot+'.json',1);
}else dash.live=require("Storage").readJSON("eucSlot.json",1);
//
ampL=[];batL=[];almL=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
set.bt=4;
global.dash.live.maker="Kingsong";

