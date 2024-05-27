//kingsong  set options2
face[0] = {
	offms: (set.def.off[face.appCurr])?set.def.off[face.appCurr]:5000,
	g:w.gfx,
	init: function(){
		if (euc.state!=="READY") {face.go(set.dash[set.def.dash.face],0);return;}
		this.g.setColor(0);
		this.g.fillRect(0,98,239,99);
        this.g.flip();	
		this.g.fillRect(120,0,121,195);
        this.g.flip();
		this.g.setColor(0);
		this.g.fillRect(0,205,239,239);
		this.g.setColor(15);
		this.g.setFont("Vector",20);
		this.g.drawString("MORE",120-(this.g.stringWidth("MORE")/2),217); 
		this.g.flip(); 
		this.g.setColor(0);
		this.g.fillRect(0,196,239,204);
		this.g.setColor(2);
      	this.g.fillRect(75,200,165,204);
		this.g.flip();
        this.g.setColor(15);
      	this.g.fillRect(120,200,143,204);
		this.g.flip(); 
        this.btn(euc.dash.aLck,"AUTO",18,60,15,7,1,0,0,119,97,"LOCK",28,60,50);
        //this.btn((euc.dash.hapS||euc.dash.hapA||euc.dash.hapT||euc.dash.hapB),"HAPTIC",25,185,37,4,6,122,0,239,97);	
		this.btn(0,"",22,185,17,4,1,122,0,239,97,"",22,185,55);		
        this.btn(euc.dash.aOff,"AUTO",18,60,115,7,1,0,100,119,195,"OFF",30,60,150);
        this.btn(euc.dash.ks.aLift,"AUTO",18,185,115,7,1,122,100,239,195,"LIFT",30,185,150);		
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
				t.g.fillRect(0,205,239,239);
				t.g.setColor(15);
				t.g.setFont("Vector",20);
		        t.g.drawString("MORE",120-(t.g.stringWidth("MORE")/2),217); 
				t.g.flip();
				t.g.setColor(0);
				t.g.fillRect(0,196,239,204);
				t.g.setColor(2);
				t.g.fillRect(75,200,165,204);
				t.g.flip();
				t.g.setColor(15);
				t.g.fillRect(120,200,143,204);
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
		face.go("dashKingsongOpt",0);
		return true;
	},
	clear: function(){
		return true;
	},
};	
//touch
touchHandler[0]=function(e,x,y){ 
	switch (e) {
      case 5: //tap event
		if ( x<=120 && y<100 ) { //auto lock
			euc.dash.aLck=1-euc.dash.aLck;
            face[0].btn(euc.dash.aLck,"AUTO",18,60,15,7,1,0,0,119,97,"LOCK",28,60,50);
            face[0].ntfy("DISCONNECT -> LOCK","AUTO LOCK DISABLED",18,1,euc.dash.aLck);
			buzzer(ew.pin.BUZZ,0,[30,50,30]);
		}else if ( 120<=x && y<=100 ) { //watch alerts
			buzzer(ew.pin.BUZZ,0,40);						
			//face.go("dashAlerts",0);
		}else if ( x<=120 && 100<=y ) { //auto off
			euc.dash.aOff=1-euc.dash.aOff;
            face[0].btn(euc.dash.aOff,"AUTO",18,60,115,7,1,0,100,119,195,"OFF",30,60,150);
            face[0].ntfy("DISCONNECT->POWER OFF","AUTO OFF DISABLED",16,1,euc.dash.aOff);
			buzzer(ew.pin.BUZZ,0,[30,50,30]);		
		}else if  (120<=x && 100<=y ) { //auto lift
			euc.dash.ks.aLift=1-euc.dash.ks.aLift;
            face[0].btn(euc.dash.ks.aLift,"AUTO",18,185,115,7,1,122,100,239,195,"LIFT",30,185,150);	
            face[0].ntfy("CONNECT -> LIFT OFF","AUTO LIFT DISABLED",18,1,euc.dash.ks.aLift);
			buzzer(ew.pin.BUZZ,0,[30,50,30]);						
		}else buzzer(ew.pin.BUZZ,0,[30,50,30]);
		face.off();
		break;
	case 1: //slide down event
		//face.go("main",0);
		face.go(set.dash[set.def.dash.face],0);
		return;	 
	case 2: //slide up event
		if ( 200<=y && x<=50) { //toggles full/current brightness on a left down corner swipe up. 
			if (w.gfx.bri.lv!==7) {this.bri=w.gfx.bri.lv;w.gfx.bri.set(7);}
			else w.gfx.bri.set(this.bri);
			buzzer(ew.pin.BUZZ,0,[30,50,30]);
		}else //if (y>100) {
			if (Boolean(require("Storage").read("settings"))) {face.go("settings",0);return;}  
		//} else {buzzer(ew.pin.BUZZ,0,40);}
		face.off();
		break;
	case 3: //slide left event
		face.go("dashKingsongAdv",0);
		return;
	case 4: //slide right event (back action)
		face.go("dashKingsongOpt",0);
		return;
	case 12: //hold event
		if ( x<=120 && y<100 ) { //auto lock
			euc.dash.aLck=1-euc.dash.aLck;
            face[0].btn(euc.dash.aLck,"AUTO",18,60,15,7,1,0,0,119,97,"LOCK",28,60,50);
            face[0].ntfy("DISCONNECT -> LOCK","AUTO LOCK DISABLED",18,1,euc.dash.aLck);
			buzzer(ew.pin.BUZZ,0,[30,50,30]);
		}else if ( 120<=x && y<=100 ) { //watch alerts
			buzzer(ew.pin.BUZZ,0,40);						
			//face.go("dashAlerts",0);
		}else if ( x<=120 && 100<=y ) { //auto off
			euc.dash.aOff=1-euc.dash.aOff;
            face[0].btn(euc.dash.aOff,"AUTO",18,60,115,7,1,0,100,119,195,"OFF",30,60,150);
            face[0].ntfy("DISCONNECT->POWER OFF","AUTO OFF DISABLED",16,1,euc.dash.aOff);
			buzzer(ew.pin.BUZZ,0,[30,50,30]);		
		}else if  (120<=x && 100<=y ) { //auto lift
			euc.dash.ks.aLift=1-euc.dash.ks.aLift;
            face[0].btn(euc.dash.ks.aLift,"AUTO",18,185,115,7,1,122,100,239,195,"LIFT",30,185,150);	
            face[0].ntfy("CONNECT -> LIFT OFF","AUTO LIFT DISABLED",18,1,euc.dash.ks.aLift);
			buzzer(ew.pin.BUZZ,0,[30,50,30]);						
		}else buzzer(ew.pin.BUZZ,0,[30,50,30]);
		face.off();
		break;
  }
};
