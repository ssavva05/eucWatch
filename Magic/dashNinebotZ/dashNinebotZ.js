//dash  Alerts
face[0] = {
	offms: (set.def.off[face.appCurr])?set.def.off[face.appCurr]:5000,
	g:w.gfx,
	init: function(){
		if (euc.state!=="READY"&&face.appPrev!=="dashGarage") {face.go(set.dash[set.def.dash.face],0);return;}
        this.g.setColor(0);
		//if (!face.appPrev.startsWith("dash")) this.g.clear();
		//else {
			this.g.drawLine (0,98,239,98);
			this.g.drawLine (0,99,239,99);
			this.g.flip(); 
			this.g.drawLine (120,0,120,195);
			this.g.drawLine (121,0,121,195);
			this.g.flip(); 
		//}	
		this.g.fillRect(0,196,239,239);
		this.g.setColor(15);
		this.g.setFont("Vector",20);
		this.g.drawString("HAPTIC ALERTS",120-(this.g.stringWidth("HAPTIC ALERTS")/2),217); 
		this.g.flip(); 
		this.btn(euc.dash.hapS,"SPEED",25,60,37,4,6,0,0,119,97);
		this.btn(euc.dash.hapA,"AMP",25,185,37,4,6,122,0,239,97);
		this.btn(euc.dash.hapT,"TEMP",25,60,136,4,6,0,100,119,195);
        this.btn(euc.dash.hapB,"BATT",25,185,136,4,6,122,100,239,195);			
        this.run=true;
	},
	show : function(){
		if (euc.state!=="READY"&&face.appPrev!=="dashGarage") {face.go(set.dash[set.def.dash.face],0);return;}
		if (!this.run) return; 
        this.tid=setTimeout(function(t,o){
		  t.tid=-1;
		  t.show();
        },1000,this);
	},
    btn: function(bt,txt1,size1,x1,y1,clr1,clr0,rx1,ry1,rx2,ry2,txt2,size2,x2,y2){
			this.g.setColor((bt)?clr1:clr0);
			this.g.fillRect(rx1,ry1,rx2,ry2);
			this.g.setColor(15);
			this.g.setFont("Vector",size1);	
          this.g.drawString(txt1,x1-(this.g.stringWidth(txt1)/2),y1); 
   			if (txt2){this.g.setFont("Vector",size2);	
            this.g.drawString(txt2,x2-(this.g.stringWidth(txt2)/2),y2);}
			this.g.flip();
    },
    ntfy: function(txt1,txt0,size,clr,bt){
            this.g.setColor(clr);
			this.g.fillRect(0,198,239,239);
			this.g.setColor(15);
			this.g.setFont("Vector",size);
     		this.g.drawString((bt)?txt1:txt0,120-(this.g.stringWidth((bt)?txt1:txt0)/2),214); 
			this.g.flip();
			if (this.ntid) clearTimeout(this.ntid);
			this.ntid=setTimeout(function(t){
                t.ntid=0;
				t.g.setColor(0);
				t.g.fillRect(0,196,239,239);
				t.g.setColor(15);
				t.g.setFont("Vector",20);
		        t.g.drawString("HAPTIC ALERTS",120-(t.g.stringWidth("HAPTIC ALERTS")/2),217); 
				t.g.flip();

			},1000,this);
    },
	tid:-1,
	run:false,
	clear : function(){
		//this.g.clear();
		this.run=false;
		if (this.tid>=0) clearTimeout(this.tid);this.tid=-1;
   		if (this.ntid) clearTimeout(this.ntid);this.ntid=0;
		return true;
	},
	off: function(){
		this.g.off();
		this.clear();
	}
};
//loop face
face[1] = {
	offms:1000,
	init: function(){
		return true;
	},
	show : function(){
		face.go(set.dash[set.def.dash.face],0);
		return;
	},
	clear: function(){
		return true;
	},
};	
//touch
touchHandler[0]=function(e,x,y){ 
	switch (e) {
	case 5: //tap event
		if (face[0].set) { 
			buzzer(ew.pin.BUZZ,0,[30,50,30]);
			if (face[0].set=="spd") { 
				if (y<=120){ //spd
					if (require("Storage").readJSON("dash.json",1)["slot"+require("Storage").readJSON("dash.json",1).slot+"Maker"]!="Kingsong") {
						if (x<=120){ if (15<euc.dash.spd1) euc.dash.spd1--;
						}else if (euc.dash.spd1<45) euc.dash.spd1++;
                        euc.dash.haSv="spd1";
					}else {
						if (euc.dash.haSv=="spd1") euc.dash.haSv="spd2";
						else if (euc.dash.haSv=="spd2") euc.dash.haSv="spd3";
						else euc.dash.haSv="spd1";
					}
                    face[0].btn(1,"SPEED (IN Km/h)",18,120,8,1,0,0,0,239,97,euc.dash[euc.dash.haSv],50,120,40);
					face[0].ntfy("HAPTIC STARTS AT:","",18,1,1);
				}else{ //RESOLUTION
					if (x<=120){ if (1<euc.dash.spdS) euc.dash.spdS--;
					}else if (euc.dash.spdS<5) euc.dash.spdS++;
			        face[0].btn(1,"RESOLUTION (IN Km/h)",18,120,110,2,0,0,100,239,195,euc.dash.spdS,50,120,140);
					face[0].ntfy("ONE PULSE PER:","",18,1,1);
				}  
			}else if (face[0].set=="amp") { //amp
				if (y<=65){ //uphill
					if (120<=x&&euc.dash.ampH<35) euc.dash.ampH++;
					else if (x<=120&&15<euc.dash.ampH) euc.dash.ampH--;
                    face[0].btn(1,"UPHILL:",20,60,23,2,0,0,0,239,63,euc.dash.ampH+" A",35,180,16);
					face[0].ntfy("HAPTIC STARTS AT:","",18,1,1);
				}else if (65<=y&&y<=133){//braking
					if (x<=120&&euc.dash.ampL<-5) euc.dash.ampL++;
					else if (120<=x&&-15<euc.dash.ampL) euc.dash.ampL--;
			        face[0].btn(1,"BRAKING:",20,60,90,1,0,0,66,239,132,euc.dash.ampL+ " A",35,182,84);
					face[0].ntfy("HAPTIC STARTS AT::","",18,1,1);                    
				}else {//RESOLUTION
					if (120<=x&&euc.dash.ampS<3) euc.dash.ampS++;
					else if (x<=120&&1<euc.dash.ampS) euc.dash.ampS--;
			        face[0].btn(1,"RESOLUTION:",17,70,157,2,0,0,135,239,195,euc.dash.ampS+ " A",35,190,150);
					face[0].ntfy("ONE PULSE PER:","",18,1,1);
				}
            }else if (face[0].set=="temp") { //temp
              if (y<=120){ //
					if (120<=x&&euc.dash.tmpH<70) euc.dash.tmpH++;
   			  		else if (x<=120&&50<euc.dash.tmpH) euc.dash.tmpH--;
                    face[0].btn(1,"SET HI-TEMP:",18,120,8,1,0,0,0,239,97,euc.dash.tmpH,50,120,41);
					face[0].ntfy("HAPTIC STARTS AT:","",18,1,1);
				}else{ //back
					face[0].set=0;face[0].init();
                }
            }else if (face[0].set=="batt") { //temp
              if (y<=120){ //
					if (120<=x&&euc.dash.batL<30) euc.dash.batL++;
   			  		else if (x<=120&&5<euc.dash.batL) euc.dash.batL--;
                    face[0].btn(1,"SET LOW-BATT:",18,120,8,1,0,0,0,239,97,euc.dash.batL,50,120,41);
					face[0].ntfy("HAPTIC STARTS AT:","",18,1,1);
				}else{ //back
					face[0].set=0;face[0].init();
                }
              
			}else  {buzzer(ew.pin.BUZZ,0,40);face[0].set=0;face[0].init();}
        }else{
			if (x<=120&&y<100) { //Speed
				euc.dash.hapS=1-euc.dash.hapS;
				face[0].btn(euc.dash.hapS,"SPEED",25,60,37,4,6,0,0,119,97);
				face[0].ntfy("HOLD -> SET SPEED","HOLD -> SET SPEED",18,1,1);
				buzzer(ew.pin.BUZZ,0,[30,50,30]);
			}else if (120<=x&&y<=100) { //Ampere
				euc.dash.hapA=1-euc.dash.hapA;
				face[0].btn(euc.dash.hapA,"AMP",25,185,37,4,6,122,0,239,97);
				face[0].ntfy("HOLD -> SET AMPERE","",18,1,1);
				buzzer(ew.pin.BUZZ,0,[30,50,30]);
			}else if (x<=120&&100<=y) { //Temp
				euc.dash.hapT=1-euc.dash.hapT;
				face[0].btn(euc.dash.hapT,"TEMP",25,60,136,4,6,0,100,119,195);
				face[0].ntfy("HOLD -> SET TEMP","",18,1,1);
				buzzer(ew.pin.BUZZ,0,[30,50,30]);		
			}else if (120<=x&&100<=y) { //Batt
				euc.dash.hapB=1-euc.dash.hapB;
				face[0].btn(euc.dash.hapB,"BATT",25,185,136,4,6,122,100,239,195);
				face[0].ntfy("HOLD -> SET BATTERY","",18,1,1);
				buzzer(ew.pin.BUZZ,0,[30,50,30]);						
			}else buzzer(ew.pin.BUZZ,0,[30,50,30]);
        }
		face.off();
		break;
	case 1: //slide down event
		//face.go("main",0);
		face.go(set.dash[set.def.dash.face],0);
		return;	 
	case 2: //slide up event
		if (y>200&&x<50) { //toggles full/current brightness on a left down corner swipe up. 
			if (w.gfx.bri.lv!==7) {this.bri=w.gfx.bri.lv;w.gfx.bri.set(7);}
			else w.gfx.bri.set(this.bri);
			buzzer(ew.pin.BUZZ,0,[30,50,30]);
		}else //if (y>100) {
			if (Boolean(require("Storage").read("settings"))) {face.go("settings",0);return;}  
		//} else {buzzer(ew.pin.BUZZ,0,40);}
		face.off();
		break;
	case 3: //slide left event
		buzzer(ew.pin.BUZZ,0,40);
		break;
	case 4: //slide right event (back action)
        if (face[0].set) {
       		//face.off();
  			face[0].set=0;face[0].init();
			return;
        }else {
			    face.go(set.dash[set.def.dash.face],0);
			return;
		    }
      break;
	case 12: //hold event
		if (face[0].set) { 
			face[0].set=0;face[0].init();
			buzzer(ew.pin.BUZZ,0,[30,50,30]);	
        }else if (x<=120&&y<100) { //spd
			face[0].set="spd";
            buzzer(ew.pin.BUZZ,0,[30,50,30]);
            face[0].btn(1,"SPEED (IN Km/h)",18,120,8,1,0,0,0,239,97,euc.dash[euc.dash.haSv],50,120,40);
			face[0].btn(1,"RESOLUTION (IN Km/h)",18,120,110,2,0,0,100,239,195,euc.dash.spdS,50,120,140);
		}else if (120<=x&&y<=100) { //amp
			face[0].set="amp";
			buzzer(ew.pin.BUZZ,0,[30,50,30]);
            w.gfx.setColor(0);
	    	w.gfx.fillRect(0,0,239,195);
    		w.gfx.flip();
            face[0].btn(1,"UPHILL:",20,60,23,2,0,0,0,239,63,euc.dash.ampH+" A",35,180,16);
			face[0].btn(1,"BRAKING:",20,60,90,1,0,0,66,239,132,euc.dash.ampL+ " A",35,182,84);
			face[0].btn(1,"RESOLUTION:",17,70,157,2,0,0,135,239,195,euc.dash.ampS+ " A",35,190,150);
		}else if (x<=120&&100<=y) { //temp
			face[0].set="temp";
            buzzer(ew.pin.BUZZ,0,[30,50,30]);
            face[0].btn(1,"SET HI-TEMP:",18,120,8,1,0,0,0,239,97,euc.dash.tmpH,50,120,40);
		}else if (120<=x&&100<=y) { //batt
			face[0].set="batt";
            buzzer(ew.pin.BUZZ,0,[30,50,30]);
            face[0].btn(1,"SET LOW-BATT:",18,120,8,1,0,0,0,239,97,euc.dash.batL,50,120,40);
		}else buzzer(ew.pin.BUZZ,0,[30,50,30]);		
		face.off();
		break;
  }
};
