//kingsong euc module 
//euc.conn(euc.mac);
//euc.wri("lightsOn")
//temp

if (!global.dash.live.ks) global.dash.live.ks={};
if (global.dash.live.ks.ver!=5) global.dash.live.ks={ "ver":5,"lift":1,"aLiftC":0,"aRideC":0,"aVoiceC":2,"aLiftD":0,"aRideD":0,"aVoiceD":0,"HL":0,"aHLC":3,"aHLD":2,"aOff":0,"aLock":0,"aUnlock":0,"city":0,"offT":0};
euc.tmp={};
//commands
euc.wri=function(i) {if (euc.dbg) console.log("not connected yet"); if (i=="end") euc.off(); return;};
euc.cmd=function(no,val){
	switch (no) {
		//euc.wri("getParamA");
		case "manual":return val; 
		case "getModel":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,155,20,90,90]; 
		case "getSerial":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,99,20,90,90]; 
		case "getAlarms":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,20,90,90]; 
		case "doHorn":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,136,20,90,90]; 
		case "doBeep":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,124,20,90,90]; 
		case "getVoice":return [170,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,74,20,90,90];
		case "setVoiceOnOff":return [170,85,val?val:0,val?0:1,0,0,0,0,0,0,0,0,0,0,0,0,115,20,90,90];
		default:
			return val?val:[];
    }
};
//
euc.tmp.one=function(inpk){
	"ram";
	//speed
	dash.live.spd=(inpk[5] << 8 | inpk[4])/100; 
	this.amp=inpk[11] << 8 | inpk[10];
	//City lights 
	if ( dash.live.ks.city && dash.live.spd) { 
		euc.tmp.city();
	}
					
};
euc.tmp.two=function(inpk){
	"ram";
	dash.live.ks.charge=inpk[13];
};
euc.tmp.thre=function(inpk){
	"ram";
	dash.live.spdL=(inpk[3] << 8 | inpk[2])/100;
	dash.live.alrm=(dash.live.spdL < dash.live.spdT && dash.live.spdL-5 < dash.live.spd)?1:0;
	almL.unshift(dash.live.alrm);
	if (20<almL.length) almL.pop();
	//haptic
	if (dash.live.alrm) euc.alert=20;
};
//
euc.tmp.resp=function(inpk){
	"ram";
	if ( inpk[16] == 63 ) 
		dash.live.ks.offT=inpk[5] << 8 | inpk[4];
	else if ( inpk[16] == 110 ) 	
		dash.live.ks.ride=1-inpk[2];
	else if ( inpk[16] == 181 ){
		if (inpk[4]==0||inpk[4]==255) dash.live.limE[0]=0;
		else {
			dash.live.lim[0]=inpk[4];
			dash.live.limE[0]=1;
		}
		if (inpk[6]==0) dash.live.limE[1]=0; 
		else {
			dash.live.lim[1]=inpk[6];
			dash.live.limE[1]=1;
		}
		dash.live.lim[2]=inpk[8];
		dash.live.lim[3]=inpk[10];
	}
};

//start
euc.conn=function(mac){
	"ram";
	if ( global["\xFF"].BLE_GATTS&&global["\xFF"].BLE_GATTS.connected ) {
		if (euc.dbg) console.log("ble allready connected"); 
		global["\xFF"].BLE_GATTS.disconnect();return;
	}
	//connect 
	NRF.connect(mac,{minInterval:7.5, maxInterval:7.5})
	.then(function(g) {
	   return g.getPrimaryService(0xffe0);
	}).then(function(s) {
	  return s.getCharacteristic(0xffe1);
	//read
	}).then(function(c) {
		var inpk=new Uint8Array(20);
		c.on('characteristicvaluechanged', function(event) {
			inpk.set(event.target.value.buffer);
            if (inpk[0]==188){if (euc.dbg)  print("drop",inpk); return;}
            //if (euc.busy||inpk[0]==188){if (euc.dbg)  print("drop",inpk); return;}
			if (set.bt==4) 	euc.proxy.w(event.target.value.buffer);
			euc.alert=0;
			if (8<euc.dbg) console.log("INPUT :",inpk);
			if (inpk[16] == 169){
				if (euc.dbg==4) console.log("INPUT :",inpk);
				euc.tmp.one(inpk);
			}else if (inpk[16] == 185){//trip-time-max_speed
				if (euc.dbg==5) console.log("INPUT :",inpk);
				euc.tmp.two(inpk);
			}else if (inpk[16] == 245){
				if (euc.dbg==6) console.log("INPUT :",inpk);
				dash.live.pwr=inpk[15];
			}else if (inpk[16] == 246){
				if (euc.dbg==7) console.log("INPUT :",inpk);
				euc.tmp.thre(inpk);
			}else
				euc.tmp.resp(inpk);
			//haptic
		});
		//on disconnect
		global["\u00ff"].BLE_GATTS.device.on('gattserverdisconnected', function(reason) {
		euc.off(reason);
		});
		return  c;
	//write
	}).then(function(c) {
		if (euc.dbg) console.log("EUC Kingsong connected"); 
		euc.wri= function(n,v) {
			if (euc.busy) { clearTimeout(euc.busy);euc.busy=setTimeout(()=>{euc.busy=0;},100);return;} 
			euc.busy=setTimeout(()=>{euc.busy=0;},150);
			if (n=="hornOn"){
				euc.horn=1;
				if (euc.tmp.horn) {clearTimeout(euc.tmp.horn);euc.tmp.horn=0;}
				c.writeValue(euc.cmd("doHorn")).then(function() {
					return c.writeValue(euc.cmd("setStrobeOnOff",1));
				}).then(function() {
					if (euc.tmp.horn) {clearInterval(euc.tmp.horn);euc.tmp.horn=0;}
					euc.tmp.horn=setInterval(() => {
						if (!BTN1.read()){
							if (euc.tmp.horn) {clearInterval(euc.tmp.horn);euc.tmp.horn=0;}
							c.writeValue(euc.cmd("setStrobeOnOff",0)).then(function() {		
								euc.horn=0;
							});
						}
					}, 200); 
				});
			} else if (n=="hornOff") {
				euc.horn=0;
				if (euc.busy) {clearTimeout(euc.busy);euc.busy=0;}
				return;
			} else if (n==="start") {
				euc.state="READY";
				c.startNotifications().then(function() {
					return c.writeValue(euc.cmd("getModel"));
				}).then(function() {
					return c.writeValue(euc.cmd("getAlarms"));	
				}).then(function() {
					if (!dash.live.ks.serial) {
						return c.writeValue(euc.cmd("getSerial"));
					}
				}).catch(function(err)  {
					if (global["\xFF"].BLE_GATTS&&global["\xFF"].BLE_GATTS.connected) global["\xFF"].BLE_GATTS.disconnect();
					else euc.off("err-start");
				});
			}else if (euc.state=="OFF") {
				if (global['\xFF'].BLE_GATTS && global['\xFF'].BLE_GATTS.connected) {
					if (euc.busy) {clearTimeout(euc.busy);euc.busy=0;}
					if (global["\xFF"].BLE_GATTS&&global["\xFF"].BLE_GATTS.connected) global["\xFF"].BLE_GATTS.disconnect();
					else euc.off("err-off");
				}else {
					if (euc.busy) {clearTimeout(euc.busy);euc.busy=0;}
					euc.off("not connected");
					return;
				}
			}else if (n==="proxy") {
				c.writeValue(v).then(function() {
                    clearTimeout(euc.busy);euc.busy=0;
					return;
				}).catch(function(err)  {
					clearTimeout(euc.busy);euc.busy=0;euc.off("err-fwd");
				});
			}else { 
				c.writeValue(euc.cmd(n,v)).then(function() {
					if (euc.busy) {clearTimeout(euc.busy);euc.busy=0;}
				}).catch(function(err)  {
					if (euc.busy) {clearTimeout(euc.busy);euc.busy=0;}
					euc.off("err-rest");
				});
			}
			return true;
		};
		if (!set.read("dash","slot"+set.read("dash","slot")+"Mac")) {
			dash.live.mac=euc.mac; dash.live.batF=420;dash.live.batE=320;
			euc.updateDash(require("Storage").readJSON("dash.json",1).slot);
			set.write("dash","slot"+set.read("dash","slot")+"Mac",euc.mac);
		}
		if (global["\xFF"].bleHdl && global["\xFF"].bleHdl[54] && global["\xFF"].bleHdl[54].value.buffer[0]==170 && global["\xFF"].bleHdl[54].value.buffer[1]==85) {
			setTimeout(()=>{ 
				if (euc.dbg)  print("EUC: ks is initialized");
				euc.state="READY";
				c.startNotifications().then(function() {
					return dash.live.ks.aVoiceC?euc.wri("setVoiceOnOff",2- dash.live.ks.aVoiceC):"ok";
				});
			},500);
		}else {
			buzzer([90,40,150]);
			euc.wri("start");
		}
	//reconect
	}).catch(function(err)  {
		euc.off(err);
	});
};
//catch
euc.off=function(err){
	"ram";
	if (euc.dbg) console.log("EUC.off :",err);
	if (euc.reconnect) {clearTimeout(euc.reconnect); euc.reconnect=0;}
	if (euc.state!="OFF") {
		if (euc.dbg) console.log("EUC: Restarting");
		if ( err==="Connection Timeout"  )  {
			euc.state="LOST";
			if ( set.def.dash.rtr < euc.run) {
				euc.tgl();
				return;
			}
			euc.run=euc.run+1;
			if (dash.live.lock==1) buzzer(250);
			else  buzzer([250,200,250,200,250]);
			euc.reconnect=setTimeout(() => {
				euc.reconnect=0;
				if (euc.state!="OFF") euc.conn(euc.mac); 
			}, 5000);
		}else if ( err==="Disconnected"|| err==="Not connected")  {
			euc.state="FAR";
			euc.reconnect=setTimeout(() => {
				euc.reconnect=0;
				if (euc.state!="OFF") euc.conn(euc.mac); 
			}, 1000);
		} else {
			euc.state="RETRY";
			euc.reconnect=setTimeout(() => {
				euc.reconnect=0;
				if (euc.state!="OFF") euc.conn(euc.mac); 
			}, 2000);
		}
	} else {
		if (euc.dbg) console.log("EUC OUT:",err);
		if (euc.busy) { clearTimeout(euc.busy);euc.busy=0;} 
		euc.off=function(err){if (euc.dbg) console.log("EUC off, not connected",err);};
		euc.wri=function(err){if (euc.dbg) console.log("EUC write, not connected",err);};
		euc.conn=function(err){if (euc.dbg) console.log("EUC conn, not connected",err);};
		euc.cmd=function(err){if (euc.dbg) console.log("EUC cmd, not connected",err);};
		euc.run=0;
		euc.tmp=0;
		global["\xFF"].bleHdl=[];
		NRF.setTxPower(set.def.rfTX);
    }
};
