//	//this.maker=require("Storage").readJSON("dash.json",1)['slot'+require("Storage").readJSON("dash.json",1).slot+'Maker'];
//	//this.mac=require("Storage").readJSON("dash.json",1)['slot'+require("Storage").readJSON("dash.json",1).slot+'Mac'];
				
global.euc= {
	state: "OFF",
	reconnect:0,
    busy:0,
    chrg:0,
	kill:0,
	night:1,
	buzz:0,
	day:[7,19],
	emuZ:{
		checksum:function(packet){
			var end = packet[2] + 7;
			var sum = 0;
			for(var i = 2; i < end; i++)
			sum += packet[i];
			return (sum & 0xFFFF) ^ 0xFFFF;
		},
		send:function(data){
			var packetLen = 2 + data.byteLength;
			var packet = new Uint8Array(packetLen);
			packet.set(data, 0);
			var check = euc.emuZ.checksum(data);
			packet[packetLen - 2] = check & 0xFF;
			packet[packetLen - 1] = (check >> 8) & 0xFF;
			//return packet;
			return Bluetooth.write(packet);
		},
		last:getTime(),
	},
	updateDash:function(slot){require('Storage').write('eucSlot'+slot+'.json', euc.dash);},
	tgl:function(){ 
		ampL=[];batL=[];almL=[];
		if (this.state!="OFF" ) {
			digitalPulse(D16,1,[90,60,90]);  
			set.def.accE=0;
			if (!set.def.acc) {acc.off();}
			this.seq=1;
			this.state="OFF";
   			//face.go(set.dash[set.def.dash],0);
			face.go("dashOff",0);
			//if (this.kill) clearTimout(this.kill);
			//this.kill=setTimeout(()=>{
			//if (euc.dash.emu) {set.def.atc=0;set.upd();}
			euc.wri("end");
			if (euc.busy)euc.busy=0;
			setTimeout(()=>{euc.updateDash(require("Storage").readJSON("dash.json",1).slot);},500);
			return;
		}else {
			NRF.setTxPower(4);
			digitalPulse(D16,1,100); 
			//if (euc.dash.emu){set.def.atc=1;set.def.gb=0;set.def.cli=0;set.def.hid=0;set.upd();}
			this.mac=require("Storage").readJSON("dash.json",1)["slot"+require("Storage").readJSON("dash.json",1).slot+"Mac"];
			if(!this.mac) {
				face.go('dashScan',0);return;
		    }else {
				eval(require('Storage').read('euc'+require("Storage").readJSON("dash.json",1)["slot"+require("Storage").readJSON("dash.json",1).slot+"Maker"]));
				this.state="ON";
				if (!set.def.acc) {set.def.accE=1;acc.on();}
				this.seq=1;
				if (euc.dash.bms==undefined) euc.dash.bms=1.5;
				if (euc.dash.maker=="Begobe"||euc.dash.maker=="NinebotZ")euc.dash.spdM=0;
				this.conn(this.mac); 
				face.go(set.dash[set.def.dash],0);return;
            }
		}
	} 
};
//emu

function checksum(packet){
	var sum = 0;
	packet.forEach(function(val){
		sum += val;
	});
	return (sum & 0xFFFF) ^ 0xFFFF;
}					
					
function emuS(data){
	global.lastTime=getTime();
	var packetLen = 4 + data.byteLength;
	var packet = new Uint8Array(packetLen);
	packet[0]=0x5a;
	packet[1]=0xa5;
	packet.set(data, 2);
	var check = checksum(data);
	packet[packetLen - 2] = check & 0xFF;
	packet[packetLen - 1] = (check >> 8) & 0xFF;
	//return packet;
	return Bluetooth.write(packet);
}	

function d2h(i) {
   return (i+0x10000).toString(16).substr(-4);
}
function emuG(l){ 
var resp;
switch (l) {
	case "U\xAA\3\x11\1\x1A\2\xCE\xFF":
		global.emuD=0;
		//print(1,l.charCodeAt(0));
		return;
	case "Z\xA5\1>\x14\1\xB0\x20\xDB\xFE": //live
		return emuS([ 32, 20, 62, 4, 176, 0, 0, 0, 0, 72, 152, 0, 0, euc.dash.bat, 0, "0x"+(euc.dash.spd*100+0x10000).toString(16).substr(3), "0x"+(euc.dash.spd*100+0x10000).toString(16).substr(1,2), 0, 0, 24, 56, 37, 0, 0, 0, 59, 0,euc.dash.tmp,0,parseInt((euc.dash.volt*100).toString(16).substr(2),16), parseInt((euc.dash.volt*100).toString(16).substr(0,2),16), euc.dash.amp, 0, 0, 0, 0, 0]);
	case "Z\xA5\1>\x14\1\x25\x0c\x7a\xFF":  //live2
		return emuS([0x0c,0x14,0x3e,0x04,0x25,0xf0,0x15,0x08,0xe5,0xd2,0x93,0x7b,0x56,0xa2,0xb8,0x7d,0xf6]);  
	case  "Z\xA5\1>\x14\1\x61\x04\x46\xFF": //live3
		return emuS([0x04,0x14,0x3e,0x04,0x61,0x00,0x00,0x08,0xe5]);  
	case "Z\xA5\1>\x14\1\x1A\2\x8F\xFF": //firmware
		if (set.bt!=4) {
			set.bt=4;
			handleInfoEvent({"src":"BT","title":"EUC PHONE","body":"CONNECTED"});
		}
		return emuS([0x02,0x14,0x3e,0x04,0x1a,0x07,0x11]);  
	case "Z\xA5\1>\x14\1\x68\2\x41\xFF": //start
		return emuS([0x02,0x14,0x3e,0x04,0x68,0x01,0x01]);  
	case "Z\xA5\1>\x14\1\x10\x0e\x8d\xFF": //info
		return emuS([0x0e,0x14,0x3e,0x04,0x10,0x4e,0x33,0x4f,0x54,0x43,0x31,0x38,0x33,0x33,0x54,0x30,0x30,0x33,0x38]);  
//		return emuS([0x0e,0x14,0x3e,0x04,0x10,0x4e,0x33,0x4f,0x54,0x43,0x31,0x38,0x33,0x33,0x54,0x30,0x30,0x30,0x30]);  
	case "Z\xA5\1>\x14\1\x66\6\x3f\xFF":
		return emuS([0x06,0x14,0x3e,0x04,0x66,0x17,0x01,0x17,0x01,0x01,0x01]);  
	case "Z\xA5\0>\x16\x5b\0\x50\xFF":
		return emuS([0x10,0x16,0x3e,0x5b,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00]);  
	case "Z\xA5\1>\x14\1\x10\x0E\x8D\xF7":
		return emuS([0x0e,0x14,0x3e,0x04,0x10,0x4e,0x33,0x47,0xb1,0x69,0xb3,0x43,0x65,0x13,0x6e,0x64,0xc6,0x33,0x38]);  
	case "Z\xA5\1>\x14\1\xD2\x04\xD5\xFE":
		return emuS([ 4, 20, 62, 4, 210, 0, 0, 18, 229]);  
	case "Z\xA5\1>\x14\1\xC6\x02\xE3\xFE":
		return emuS([0x02,0x14,0x3e,0x04,0xc6,0x01,0x00]) ; 
	case "Z\xA5\1>\x14\1\xF5\x02\xB4\xFE":
		return emuS([0x02,0x14,0x3e,0x04,0xf5,0xe2,0x03]) ; 
	case "Z\xA5\1>\x14\1\x7c\x08\x27\xFF":
		return emuS([0x08,0x14,0x3e,0x04,0x7c,0x04,0x00,0x24,0xe4,0xfa,0x85,0xef,0x47]);
	case "Z\xA5\1>\x14\1\x72\x06\x33\xFF":
		return emuS([0x06,0x14,0x3e,0x04,0x72,0x00,0x00,0x28,0xab,0x3a,0xa5])  ;
	case "Z\xA5\1>\x14\1\x69\x02\x40\xFF":
		return emuS([0x02,0x14,0x3e,0x04,0x69,0x5c,0x26]);  
	case "Z\xA5\1>\x11\1\x10\x1a\x84\xFF":
		return emuS([0x1a,0x11,0x3e,0x04,0x10,0x34,0x39,0x51,0xa0,0x7b,0xb3,0x43,0x1e,0x11,0x6b,0x64,0xc5,0x30,0x30,0x17,0x01,0x80,0x25,0x88,0xc0,0xc6,0x91,0x3d,0x56,0x87,0x3a]);  
	case "Z\xA5\1>\x11\1\x3b\x02\x71\xFF":
		return emuS([0x02,0x11,0x3e,0x04,0x3b,0x62,0x00]);  
	case "Z\xA5\1>\x11\1\x20\x02\x8c\xFF":
		return emuS([0x02,0x11,0x3e,0x04,0x20,0x01,0x25]) ; 
	case "Z\xA5\1>\x12\1\x10\x1a\x83\xFF":
		return emuS([0x1a,0x12,0x3e,0x04,0x10,0x34,0x39,0x51,0xa0,0x7b,0xb3,0x43,0x1e,0x11,0x6b,0x64,0xc5,0x30,0x30,0x17,0x01,0x80,0x25,0x88,0xc0,0xc6,0x91,0x38,0x56,0x87,0x3a]);  
	case "Z\xA5\1>\x12\1\x3b\x02\x70\xFF":
		return emuS([0x02,0x12,0x3e,0x04,0x3b,0x62,0x00]) ; 
	case "Z\xA5\1>\x12\1\x20\x02\x8b\xFF":
		return emuS([0x02,0x12,0x3e,0x04,0x20,0x01,0x25]);  
	case "Z\xA5\1>\x14\1\x3e\x02\x6b\xFF": //temp
		return emuS([0x02,0x14,0x3e,0x04,0x3e,0x8a,0x01]);  
	case "Z\xA5\1>\x14\1\x43\x0a\x5e\xFF":
		return emuS([0x0a,0x14,0x3e,0x04,0x43,0x72,0x01,0x08,0xe5,0x2a,0x82,0x7b,0x56,0x5d,0x2e]);  
	case "Z\xA5\1>\x14\1\xd2\x04\xd5\xFF":
		return emuS([0x04,0x14,0x3e,0x04,0xd2,0x00,0x00,0x12,0xe5]);  
	case "Z\xA5\1>\x11\1\x30\x0e\x70\xFF":
		return emuS([0x0e,0x11,0x3e,0x04,0x30,0x01,0x00,0xd0,0xf2,0x15,0x82,0x7b,0x56,0xb4,0x2e,0x63,0xc0,0x00,0x20]);  
	case "Z\xA5\1>\x11\1\x40\x1e\x50\xFF": 
		return emuS([0x1e,0x11,0x3e,0x04,0x40,0xa2,0x0e,0xae,0xeb,0x8d,0x8c,0xdc,0x58,0x86,0x34,0xe3,0xf8,0xbd,0x0e,0xba,0x0e,0xbd,0x0e,0xb6,0xeb,0x92,0x8c,0xc2,0x58,0xe1,0x34,0x95,0xf8,0x00,0x00]);  
	case "Z\xA5\1>\x12\1\x30\x0e\x6f\xFF": 
		return emuS([0x0e,0x12,0x3e,0x04,0x30,0x01,0x00,0x88,0xf2,0x14,0x82,0x7e,0x56,0xac,0x2e,0x62,0xc3,0x00,0x00]);  
	case "Z\xA5\1>\x12\1\x40\x1e\x4f\xFF":
		return emuS([0x1e,0x12,0x3e,0x04,0x40,0xa7,0x0e,0x93,0xeb,0x8b,0x8c,0xd7,0x58,0x88,0x34,0xe5,0xf8,0xb2,0x0e,0xaf,0x0e,0xb5,0x0e,0xba,0xeb,0x85,0x8c,0xcc,0x58,0x96,0x34,0xec,0xf8,0x00,0x00]);  
	default: 
		//print("Unknown",l);
		return emuS([0x20,0x14,0x3e,0x04,0xb0,0x00,0x00,0x00,0x00,0x48,0x98,0x00,0x00,0x41,0x00,0x00,0x00,0x00,0x00,0x18,0x38,0x25,0x00,0x00,0x00,0x3b,0x00,0xbe,0x00,0xa2,0x14,0x08,0x00,0x00,0x00,0x00,0x00]);
    }
}
//init
if (Boolean(require("Storage").read('eucSlot'+require("Storage").readJSON("dash.json",1).slot+'.json'))) { 
euc.dash=require("Storage").readJSON('eucSlot'+require("Storage").readJSON("dash.json",1).slot+'.json',1);
}else euc.dash=require("Storage").readJSON("eucSlot.json",1);
