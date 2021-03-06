//m_euc ninebot one c/e/p
euc.tmp={count:0,loop:0};
euc.cmd=function(no){
	switch (no) {
    case 0:case 3:case 6:case 9:case 12:case 15:case 18:
	  return [85,170,3,9,1,80,2,160,255]; //Current Amperage with sign if v[80] > 32768 I = v[80] - 65536 else I = v[80] in Amperes * 100
	case 1:case 4:case 7:case 10:case 13:case 16:case 19:
	  return [85,170,3,9,1,38,2,202,255]; //Current Speed in Km/h*1000d
	case 2:return [85,170,3,9,1,62,2,178,255]; //Temperature numeric positive C * 10
	case 5:return [85,170,3,9,1,71,2,169,255]; //Voltage numeric positive V * 100
	case 8:return [85,170,3,9,1,185,2,55,255]; //Single Mileage numeric positive in meters
	case 11:return [85,170,3,9,1,58,2,182,255]; //Single Runtime numeric positive seconds
	case 14:return [85,170,3,9,1,37,2,203,255]; //remaining mileage in Km*100
	case 17:return [85,170,3,9,1,182,2,58,255]; //Average speed numeric positive m/h
	case 20:return [85,170,3,9,1,112,2,128,255]; //Lock status
	case 21:return [85,170,3,9,3,112,1,127,255]; //21- lock
	case 22:return [85,170,3,9,3,112,0,128,255]; //22- unlock
	case 23:return [85,170,3,9,1,210,2,30,255]; //23 get Riding Mode
	case 24:return [85,170,4,9,2,210,0,0,30,255]; //24 set Riding Mode 0
	case 25:return [85,170,4,9,2,210,1,0,29,255]; //25 set Riding Mode 1
	case 26:return [85,170,3,9,2,210,2,29,255]; //26 set Riding Mode 2
	case 27:return [85,170,3,9,2,210,3,28,255]; //27 set Riding Mode 3
	case 28:return [85,170,3,9,2,210,4,27,255]; //28 set Riding Mode 4
	case 29:return [85,170,3,9,2,210,5,26,255]; //29 set Riding Mode 5
	case 30:return [85,170,3,9,2,210,6,25,255]; //30 set Riding Mode 6
	case 31:return [85,170,3,9,2,210,7,24,255]; //31 set Riding Mode 7  
	case 32:return [85,170,3,9,2,210,8,23,255]; //32 set Riding Mode 8
	case 33:return [85,170,3,9,2,210,9,22,255];  //33 set Riding Mode 9
	}
};
//
euc.conn=function(mac){
euc.tmp.spd="-1";
euc.tmp.amp="-1";
euc.tmp.temp="-1";
euc.tmp.batt="-1";
euc.tmp.trpL="-1";  
euc.dash.spdC=0;
euc.tmp.rssi="-70";

if ( global["\xFF"].BLE_GATTS!="undefined") {
	if (set.def.cli) print("ble allready connected"); 
	if (global["\xFF"].BLE_GATTS.connected) global["\xFF"].BLE_GATTS.disconnect();
	return;
}
NRF.connect(mac,{minInterval:7.5, maxInterval:7.5})
.then(function(g) {
   return g.getPrimaryService(0xffe0);
}).then(function(s) {
  return s.getCharacteristic(0xffe1);
}).then(function(c) {
//  euc.tmp.characteristic=c;
  c.on('characteristicvaluechanged', function(event) {
  this.var = event.target.value.getUint8(5, true);
  // if off button is pressed on euc
  if (this.var==0) {
	  euc.state="WAIT";
	  digitalPulse(D16,1,200);
      //return;
  //alarm
  }else if (this.var==178) {
	  euc.tmp[this.var] = event.target.value.getUint8(6, true);

/*     if (Number(euc_val).toString(2)[1]==1 &&  euc.alertarm==0) {
        euc.alertarm=1; 
        //if (set.def.cli) console.log("euc.alertarm :",euc_val);
        digitalPulse(D16,1,[250,50,250,50,250]);
		if (face.pageCurr==-1) {
			g.clear();	
            g.setFontVector(30);
			g.drawString("!",9, 30);
			g.flip();g.on();
			face.offid=setTimeout(() => {g.off();face.offid=-1}, 2000);
		}
	    setTimeout(() => { euc.alertarm=0; }, 100);
      }
*/
//  }else if (this.var==210) {
//	euc.tmp[this.var] = event.target.value.getUint8(6, true);
//    euc.rdmd=euc.tmp[this.var];
  // rest
  }else  {  
    euc.tmp[this.var]=event.target.value.getUint16(6, true);
    euc.alert=0;
	//speed
	if (this.var==38) {
      euc.dash.spd=(euc.tmp[this.var]/1000).toFixed(1);
	  if (euc.dash.spd>=euc.dash.spd1) {
		if (euc.dash.spd>=euc.dash.spd1+5) euc.dash.spdC=3;	
		else if (euc.dash.spd>=euc.dash.spd1+2) euc.dash.spdC=2;
		else euc.dash.spdC=1;
		euc.alert=(1+(euc.dash.spd|0)-euc.dash.spd1);
      } else euc.dash.spdC=0;
    //amp
    }else  if (this.var==80) {
      if (euc.tmp[80]>32768) euc.dash.amp=((euc.tmp[80]-65536)/100).toFixed(1); 
      else euc.dash.amp=(euc.tmp[this.var]/100).toFixed(1);
	  if (euc.dash.amp>=euc.dash.ampH) {
		if  (euc.dash.amp>=euc.dash.ampH+5 ) euc.dash.ampC=3;
		else euc.dash.ampC=2;
		euc.alert=(euc.alert+1+(euc.dash.amp-euc.dash.ampH))|0;
	  }else if (euc.dash.amp>=10) { euc.dash.ampC=1;
	  }else if ( euc.dash.amp<=euc.dash.ampL) {
		if  (euc.dash.amp<=euc.dash.ampL-5 ) euc.dash.ampC=3;
		else  euc.dash.ampC=2;
		euc.alert=(euc.alert+1+(-(euc.dash.amp-euc.dash.ampL)))|0;      
		euc.alert_a=true;
	  }else if (euc.dash.amp<0) euc.dash.ampC=1; else euc.dash.ampC=0;
	//trip
    }else if (this.var==185) {
     // if (euc.dash.trpN > (euc.tmp[this.var]/100).toFixed(1)) {
     //   euc.dash.trpL=Number(euc.dash.trpL)+Number(euc.dash.trpN);
     //   if (set.def.cli) console.log("EUC_trip new :",euc.dash.trpL);
     // } 
      euc.dash.trpL=(euc.tmp[this.var]/100).toFixed(1);
	  euc.dash.trpT=(euc.tmp[this.var]/100).toFixed(1);

	  //euc.dash.trpT=Number(euc.dash.trpL)+Number(euc.dash.trpN);
      //tt=euc.tmp[this.var];
    //battery fixed
    }else  if (this.var==71) {
      euc.dash.bat=(((euc.tmp[this.var]/100)-51.5)*10|0); 
	  if ((euc.dash.bat) >= euc.dash.batH) euc.dash.batC=0;
      else  if ((euc.dash.bat) >= euc.dash.batM) euc.dash.batC=1;
      else  if ((euc.dash.bat) >= euc.dash.batL) euc.dash.batC=2;
      else  {
		euc.dash.batC=3;
		euc.alert++;
	  }
    //remaining
    }else if (this.var==37) {
      euc.dash.trpR=(euc.tmp[this.var]/100).toFixed(1);
     //temp
    }else if (this.var==62) {
      euc.dash.tmp=(euc.tmp[this.var]/10).toFixed(1);
      if (euc.dash.tmp>=euc.dash.tmpH ) {
		if (euc.dash.tmp>=65) euc.dash.tmpC=3;
		else euc.dash.tmpC=2;
		euc.alert++;
	  } else if (euc.dash.tmp>=50 ) euc.dash.tmpC=1; else euc.dash.tmpC=0;	  
	 //average
    }else if (this.var==182) {
      euc.dash.spdA=(euc.tmp[this.var]/1000).toFixed(1);
    }//runtime
    else if (this.var==58) {
      euc.dash.time=(euc.tmp[this.var]/60).toFixed(0);
	}//riding Mode
	else if (this.var==210 ) {
	  if (euc.tmp[this.var] >=10)  digitalPulse(D16,1,[100,80,100]);  
	  else euc.dash.mode=euc.tmp[this.var];
    } //lock
    else if (this.var==112 && euc.tmp[this.var]!=euc.lock) {
      euc.lock=euc.tmp[this.var];
	  if (euc.lock==1) {
		euc.dash.spdC=0;
		euc.dash.ampC=0;
		euc.dash.tmpC=0;
		euc.dash.batC=0;
        euc.tmp.spd="-1";
		euc.tmp.amp="-1";
		euc.tmp.temp="-1";
		euc.tmp.batt="-1";
		euc.tmp.trpL="-1";
      }else {
		euc.dash.spdC=0;
		euc.dash.ampC=0;
		euc.dash.tmpC=0;
		euc.dash.batC=0;
		euc.tmp.spd="-1";
		euc.tmp.amp="-1";
		euc.tmp.temp="-1";
		euc.tmp.batt="-1";
		euc.tmp.trpL="-1";
      }
    }
	//alerts
      if (euc.alert!=0 && !euc.buzz) {  
         euc.buzz=1;
		var a=[200];
		var i;
		for (i = 1; i < euc.alert ; i++) {
			a.push(150,100);
		}
        digitalPulse(D16,1,a);  
        setTimeout(() => {euc.buzz=0; }, 2000);
      }
    }
  });
c.startNotifications(); 
return  c;
}).then(function(c) {
//connected 
  if (set.def.cli) console.log("EUC connected"); 
  euc.state="READY"; //connected
  digitalPulse(D16,1,[90,40,150,40,90]);
  euc.tmp.count=22;// else euc.tmp.count=0;  //unlock	
  setTimeout(function(){  euc.wri(c); },100); 
//on disconnect
  global["\u00ff"].BLE_GATTS.device.on('gattserverdisconnected', function(reason) {
    if (set.def.cli) console.log("EUC Disconnected :",reason);
    if (euc.state!="OFF") {  
	 if (set.def.cli) console.log("EUC restarting");
     euc.state="WAIT"; 
     setTimeout(() => {  euc.conn(euc.mac); }, 1500);
    }else {
	  if (set.def.cli) console.log("Destroy euc (reason):",reason);
      if (euc.tmp.loop!==-1) clearInterval(euc.tmp.loop);
	  global["\xFF"].bleHdl=[];
	  global.BluetoothDevice=undefined;
	  global.BluetoothRemoteGATTServer=undefined;
	  global.BluetoothRemoteGATTService=undefined;
	  global.BluetoothRemoteGATTCharacteristic=undefined;
	  global.Promise=undefined;
	  global.Error=undefined;
//	  euc.wri=undefined;
//	  euc.conn=undefined;
//	  euc.cmd=undefined;
//	  euc.tmp=undefined;
//	  DataView=undefined;
	  //NRF.setTxPower(0);
    }
  });
//reconect
}).catch(function(err)  {
  if (set.def.cli) console.log("EUC", err);
//  global.error.push("EUC :"+err);
  clearInterval(euc.tmp.loop);euc.tmp.loop=-1;
  if (euc.state!="OFF") {
    if (set.def.cli) console.log("not off");
    if ( err==="Connection Timeout"  )  {
	  if (euc.reconnect) clearTimeout(euc.reconnect); 
	  if (set.def.cli) console.log("retrying :timeout");
	  euc.state="LOST";
	  if (euc.lock==1) digitalPulse(D16,1,250);
	  else digitalPulse(D16,1,[250,200,250,200,250]);
	  euc.reconnect=setTimeout(() => {
		euc.reconnect=0;
	    euc.conn(euc.mac); 
	  }, 5000);
	}else if ( err==="Disconnected"|| err==="Not connected")  {
	  if (euc.reconnect) clearTimeout(euc.reconnect);
      if (set.def.cli) console.log("retrying :",err);
      euc.state="FAR";
	 // if (euc.lock==1) digitalPulse(D16,1,100);
	 // else digitalPulse(D16,1,[100,150,100]);
      euc.reconnect=setTimeout(() => {
        euc.reconnect=0;
	    euc.conn(euc.mac); 
      }, 500);
    }
  } else {
	  if (euc.tmp.loop!=-1) {
		clearInterval(euc.tmp.loop);
		euc.tmp.loop=-1;
	  }
      if (euc.tmp.loop!==-1) clearInterval(euc.tmp.loop);
	  global["\xFF"].bleHdl=[];
      global.BluetoothDevice=undefined;
	  global.BluetoothRemoteGATTServer=undefined;
	  global.BluetoothRemoteGATTService=undefined;
	  global.BluetoothRemoteGATTCharacteristic=undefined;
	  global.Promise=undefined;
	  global.Error=undefined;
  }
});
};
//function eRea() {
//}
//main loop
euc.wri= function(ch) {
 
  var euc_still_tmr=0;
  var euc_still=false;
  var busy = false;
  var euc_near=0;
  var euc_far=0;
  //gatt.setRSSIHandler();
  if (euc.tmp.loop >= 0) {clearInterval(euc.tmp.loop); euc.tmp.loop=-1;}
  euc.tmp.loop = setInterval(function() {
    if (busy  ) return;
	//check if still
    if (euc.dash.spd==0 && euc_still==false) {
      euc_still=3;
      //if (typeof euc_still_tmr !== "undefined") {clearTimeout(euc_still_tmr);}
      euc_still_tmr=(setTimeout(() => { 
        euc_still=true;
      },5000));
    }else if (euc.dash.spd>=1 && euc_still!=false) {
      clearTimeout(euc_still_tmr);
      euc_far=0;
      euc_still=false;
      changeInterval(euc.tmp.loop,100); 
    }
	//proximity auto lock 
    if (euc.alck===1) {
    global["\xFF"].BLE_GATTS.setRSSIHandler(function(rssi) {euc.tmp.rssi=rssi; });
    if (euc.tmp.rssi< -(euc.far) && euc_still==true && euc.lock==0) {
//      if (set.def.cli) console.log("far start");
	  euc_far++;
	  euc_near=0;
	  if (euc_far > 8 && euc.lock==0 ) {
		if (busy ) return;
     		busy = true;
			ch.writeValue(euc.cmd(21)).then(function() {
				euc.lock=1;
				busy = false;
		        euc.dash.spdC=0;
		        euc.dash.ampC=0;
		        euc.dash.tmpC=0;
		        euc.dash.batC=0;
				euc.tmp.spd="-1";
				euc.tmp.spd[1]="-1";
				euc.tmp.amp="-1";
				euc.tmp.temp="-1";
				euc.tmp.batt="-1";
				euc.tmp.trpL="-1";
				digitalPulse(D16,1,[90,60,90]);
			});
      }
	}else if  (euc.tmp.rssi> -(euc.near) && euc.dash.spd<=5 && euc.lock==1 ) {
		euc_far=0;
			if (busy ) return;
			busy = true;
			ch.writeValue(euc.cmd(22)).then(function() {
			  busy = false;
			  euc_near=0;
			  euc.lock=0;
		        euc.dash.spdC=0;
		        euc.dash.ampC=0;
		        euc.dash.tmpC=0;
		        euc.dash.batC=0;
				euc.tmp.spd="-1";
				euc.tmp.spd[1]="-1";
				euc.tmp.amp="-1";
				euc.tmp.temp="-1";
				euc.tmp.batt="-1";
				euc.tmp.trpL="-1";
			    digitalPulse(D16,1,100);
				if (set.def.cli) console.log("unlock");
            });
	} else  { euc_far=0; euc_near=0; }
    }
	//send command
    if (busy ) return;
	//only alarms when locked
    if (euc.lock==1 && euc.tmp.count<=21 && euc.dash.spd==0) {euc.tmp.count=20;changeInterval(euc.tmp.loop,2000);}
	//only get alarms-speed when still
//	else if (euc_still==true && euc.tmp.count<19 ) {euc.tmp.count=19;changeInterval(euc.tmp.loop,500);}
    else if (euc_still==true && euc.tmp.count<19 ) {changeInterval(euc.tmp.loop,500);}
    else if  ( euc_still!=true && euc.dash.spd<=2)  {changeInterval(euc.tmp.loop,200);	}
	else if  (euc.dash.spd>2 && face.appCurr==set.dash[set.def.dash])  {changeInterval(euc.tmp.loop,30);}
//    else if  (euc.dash.spd>2 && face.pageCurr!=-1)  {changeInterval(euc.tmp.loop,100);}
    else changeInterval(euc.tmp.loop,100);
	busy = true;
//	print("cmd:",euc.tmp.count);
	ch.writeValue(euc.cmd(euc.tmp.count)).then(function() {
		euc.tmp.count++;
		if (euc.tmp.count>=21) euc.tmp.count=0;
		if (euc.state=="OFF"){
			if (set.def.cli) console.log("EUCstartOff");
			clearInterval(euc.tmp.loop);
			euc.tmp.loop=-1;
			euc.lock=1;
			digitalPulse(D16,1,120);
			euc.tmp.count=21;
			ch.writeValue(euc.cmd(euc.tmp.count)).then(function() {
			global["\xFF"].BLE_GATTS.disconnect();
			});
			return;
		}
		busy = false;

    });

  }, 100);  
};  
