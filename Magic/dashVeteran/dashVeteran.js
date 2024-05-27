//Veteran settings
face[0] = {
	offms: (set.def.off[face.appCurr])?set.def.off[face.appCurr]:5000,
	g:w.gfx,
	init: function(){
		if (euc.state!=="READY") {face.go(set.dash[set.def.dash.face],0);return;}
 		//if (!this.set&&(face.appPrev.startsWith("dash_")||face.appPrev==="settings")) this.g.clear();
        this.set=0;
		this.g.setColor(0);
		this.g.fillRect(0,98,239,99);
        this.g.flip();	
		this.g.fillRect(120,0,121,195);
        this.g.flip();	
        this.g.setColor(0);
		this.g.fillRect(0,196,239,239);
		this.g.setColor(15);
		this.g.setFont("Vector",24);
		this.g.drawString("SHERMAN",120-(this.g.stringWidth("SHERMAN")/2),217); 
		this.g.flip();
		this.g.setColor(0);
		this.g.fillRect(0,196,239,204);
		this.g.setColor(2);
      	this.g.fillRect(106,200,165,204);
		this.g.flip();
        this.g.setColor(15);
      	this.g.fillRect(75,200,120,204);
		this.g.flip();
		//
        this.btn(euc.dash.light,"LIGHT",28,60,35,4,1,0,0,119,97);
		this.btn((euc.dash.hapS||euc.dash.hapA||euc.dash.hapT||euc.dash.hapB),"WATCH",22,185,17,4,1,122,0,239,97,"ALERTS",22,185,55);		
        this.btn(1,"TPMS",25,60,135,1,1,0,100,119,195); //3
		let md={"1":"SOFT","2":"MEDIUM","3":"STRONG"};
        this.btn(1,"RIDE",25,185,115,12,0,122,100,239,195,md[euc.dash.mode],25,185,155);
		this.run=true;
	},
	show : function(){
		if (euc.state!=="READY") {face.go(set.dash[set.def.dash.face],0);return;}
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
				t.g.setFont("Vector",24);
				t.g.drawString("SHERMAN",120-(t.g.stringWidth("SHERMAN")/2),217); 
				t.g.flip();
				t.g.setColor(0);
				t.g.fillRect(0,196,239,204);
				t.g.setColor(2);
				t.g.fillRect(106,200,165,204);
				t.g.flip();
				t.g.setColor(15);
				t.g.fillRect(75,200,120,204);
				t.g.flip();
			},1000,this);
    },
	tid:-1,
	run:false,
	clear : function(){
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
			face.off();
			if ( 100 < y ) {
              w.gfx.setColor(0);
              w.gfx.drawLine(120,0,120,97);
              w.gfx.drawLine(121,0,121,97);
              w.gfx.flip();
              face[0].init();return;
            }
			buzzer(ew.pin.BUZZ,0,40);
		}
		else {
			if ( x<=120 && y<100 ) { 
				euc.dash.light= 1- euc.dash.light;
				face[0].btn(euc.dash.light,"LIGHT",28,60,35,4,1,0,0,119,97);
				euc.wri((euc.dash.light)?"setLightOn":"setLightOff");
			face[0].ntfy("LIGHT ON","LIGHT OFF",22,(euc.dash.light)?4:1,euc.dash.light);
				buzzer(ew.pin.BUZZ,0,[30,50,30]);
			}else if ( 120<=x && y<=100 ) { //watch alerts
				buzzer(ew.pin.BUZZ,0,[30,50,30]);						
				face.go("dashAlerts",0);
				return;	
			}else if ( x<=120 && 100<=y ) { //tpms
				face[0].ntfy("NOT YET","",22,7,1);
				buzzer(ew.pin.BUZZ,0,[30,50,30]);	
			}else if ( 120<=x && 100<=y ) { //mode
				if (euc.dash.mode==1) {euc.dash.mode=2;euc.wri("rideMed");}
				else if (euc.dash.mode==2) {euc.dash.mode=3;euc.wri("rideStrong"); }
				else if (euc.dash.mode==3) {euc.dash.mode=1;euc.wri("rideSoft");}
				let md={"1":"SOFT","2":"MEDIUM","3":"STRONG"};
				face[0].btn(1,"RIDE",25,185,115,12,0,122,100,239,195,md[euc.dash.mode],25,185,155);
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
		if ( 200<=y && x<=50 ) { //toggles full/current brightness on a left down corner swipe up. 
			if (w.gfx.bri.lv!==7) {this.bri=w.gfx.bri.lv;w.gfx.bri.set(7);}
			else w.gfx.bri.set(this.bri);
			buzzer(ew.pin.BUZZ,0,[30,50,30]);
		}else if (Boolean(require("Storage").read("settings"))) {face.go("settings",0);return;}  
		face.off();
		break;
	case 3: //slide left event
		face.go("dashVeteranOptions",0);
		return;
	case 4: //slide right event (back action)
        if (face[0].set) {
              w.gfx.setColor(0);
              w.gfx.drawLine(120,0,120,97);
              w.gfx.drawLine(121,0,121,97);
              w.gfx.flip();
              face[0].init();
        } else {
          face.go(set.dash[set.def.dash.face],0);
          return;
        }
   		face.off();
        break;
	case 12: //long press event
		if (face[0].set) { 
			face[0].set=0;face[0].init();
			buzzer(ew.pin.BUZZ,0,[30,50,30]);	
        }else if ( x<=120 && y<100 ) { // light
			euc.dash.light= 1- euc.dash.light;
			face[0].btn(euc.dash.light,"LIGHT",28,60,35,4,1,0,0,119,97);
			euc.wri((euc.dash.light)?"setLightOn":"setLightOff");
			face[0].ntfy("LIGHT ON","LIGHT OFF",22,1,euc.dash.light);
			buzzer(ew.pin.BUZZ,0,[30,50,30]);
		}else if ( 120<=x && y<=100 ) { //watch alerts
			if (euc.dash.hapS||euc.dash.hapA||euc.dash.hapT||euc.dash.hapB) {euc.dash.hapS=0;euc.dash.hapA=0;euc.dash.hapT=0;euc.dash.hapB=0;}
			else {euc.dash.hapS=1;euc.dash.hapA=1;euc.dash.hapT=1;euc.dash.hapB=1;}
			face[0].btn((euc.dash.hapS||euc.dash.hapA||euc.dash.hapT||euc.dash.hapB),"WATCH",22,185,17,4,1,122,0,239,97,"ALERTS",22,185,55);		
            face[0].ntfy("HAPTIC ENABLED","HAPTIC DISABLED",19,1,(euc.dash.hapS||euc.dash.hapA||euc.dash.hapT||euc.dash.hapB));
			buzzer(ew.pin.BUZZ,0,[30,50,30]);
		}else if ( x<=120 && 100<=y ) { 
            face[0].ntfy("METER CLEARED","",19,4,1);
			euc.wri("clearMeter");
			buzzer(ew.pin.BUZZ,0,[30,50,30]);		
		}else if ( 120<=x && 100<=y ) { //mode
			if (euc.dash.mode==1) {euc.dash.mode=2;euc.wri("rideMed");}
			else if (euc.dash.mode==2) {euc.dash.mode=3;euc.wri("rideStrong"); }
			else if (euc.dash.mode==3) {euc.dash.mode=1;euc.wri("rideSoft");}
			let md={"1":"SOFT","2":"MEDIUM","3":"STRONG"};
			face[0].btn(1,"RIDE",25,185,115,12,0,122,100,239,195,md[euc.dash.mode],25,185,155);
			buzzer(ew.pin.BUZZ,0,[30,50,30]);	
		}else buzzer(ew.pin.BUZZ,0,[30,50,30]);
		face.off();
		break;
  }
};