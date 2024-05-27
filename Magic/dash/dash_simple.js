//dash simple 
face[0] = {
	offms: (set.def.off[face.appCurr])?set.def.off[face.appCurr]:10000,
	g:w.gfx,
	spd:[],
	init: function(){
		if ( euc.day[0] < Date().getHours() && Date().getHours() < euc.day[1] ) euc.night=0; else euc.night=1;
		this.g.setColor(0);
		this.g.drawLine(120,0,120,60);
		this.g.drawLine(121,0,121,60);
		this.g.fillRect(0,61,239,64);
		this.g.fillRect(0,221,239,279);
		this.spdC=[0,13,7,7];
		this.ampC=[1,2992,7,7];
		this.tmpC=[1,2992,7,7];
		this.batC=[4,1,7,7];
		this.spd=-1;
		this.amp=-1;
		this.tmp=-1;
		this.time=-1;
		this.bat=-1;
		this.volt=-1;
		this.conn=0;
		this.lock=2;
		this.spdF=euc.dash.spdF*((set.def.dash.mph)?0.625:1);
		this.trpF=euc.dash.trpF*((set.def.dash.mph)?0.625:1);
		this.run=true;
	},
	show : function(o){
		"ram";
		if (!this.run) return;
		if (euc.state=="READY") {
			this.g.setColor(0);
			//this.g.fillRect(0,0,0,0);
			//this.g.flip();
			if (this.spd!=Math.round(euc.dash.spd)) this.spdf();
			if (!set.def.dash.clkS){	
				if (this.tmp!=euc.dash.tmp.toFixed(1))	this.tmpf();}
			else if (60 < getTime()-this.time )	
				this.clkf();
			if (set.def.dash.batS){	if (this.bat!=euc.dash.bat)	this.batf();}
			else  if (this.volt!=euc.dash.volt.toFixed(1)) this.vltf();
		} else if (euc.state=="OFF")  {
			setTimeout(function(){
				face.go("dashOff",0);
			},150);
			return;
		//rest
		} else  {
			if (euc.state!=this.conn) {
				this.conn=euc.state;
				this.g.setColor(0);
				this.g.fillRect(0,0,239,239);
				this.g.setColor(15);
				this.g.setFont("Vector",50);
				this.g.drawString(euc.state,(125-this.g.stringWidth(euc.state)/2),95);
				//this.g.flip();
				this.spd=-1;this.time=0;this.amp=-1;this.tmp=-1;this.volt=-1;this.bat=-1;this.trpL=-1;this.conn=0;this.lock=2;this.run=true;}
		}
		this.g.flip();
		//refresh 
		this.tid=setTimeout(function(t){
			t.tid=-1;
			t.show();
		},100,this);
	},
	tmpf: function(){
		"ram";
		this.tmp=euc.dash.tmp.toFixed(1);
		this.g.setColor(this.tmpC[euc.dash.tmpC]);
		this.g.fillRect(0,0,119,60);       
		this.g.setColor(15);
		this.g.setFontVector(50);
		let temp=(set.def.dash.farn)?this.tmp*1.8+32:this.tmp;
		temp=(temp<100)?Number(temp).toFixed(1):Math.round(temp);
		let size=this.g.stringWidth(temp);
		this.g.drawString(temp, 0,3); 
		this.g.setFontVector(13);
		this.g.drawString("o",size-3,2); 
		this.g.setFontVector(16);
		this.g.drawString((set.def.dash.farn)?"F":"C",size+5,5); 
		//this.g.flip();
	},
	clkf: function(){
		"ram";
		this.time=getTime();
		this.g.setColor(1);
		this.g.fillRect(0,0,119,60);       
		this.g.setColor(14);
		this.g.setFontVector(45);
		let d=(Date()).toString().split(' ');
		let t=(d[4]).toString().split(':');
		this.time=(t[0]+":"+t[1]);
		this.g.drawString(this.time,0,5); 
		//this.g.setFontVector(13);
		//this.g.drawString("CLOCK",1,40);
		//this.g.flip();
	},
	batf: function(){
		"ram";
		this.bat=euc.dash.bat;
		this.g.setColor(this.batC[euc.dash.batC]);
		this.g.fillRect(122,0,239,60);
//		this.g.setColor(15);
		this.g.setColor(15);
		this.g.setFontVector(60);
		this.g.drawString(this.bat,225-(this.g.stringWidth(this.bat)),4);
		this.g.setFontVector(20);
		this.g.drawString("%",227,37);
		//this.g.flip();
	},
	vltf: function(){
		"ram";
		this.volt=euc.dash.volt.toFixed(1);
		this.g.setColor(this.batC[euc.dash.batC]);
		this.g.fillRect(122,0,239,60);
		this.g.setColor(15);
		this.g.setFontVector((this.volt<100)?53:47);
		this.g.drawString(this.volt,(this.volt<100)?135:125,10); 
		this.g.setFontVector(13);
		//this.g.drawString("V",202,10);
		//this.g.drawString("VOLT",202,40);
		//this.g.flip();
	},
	spdf: function(){
		"ram";
		//"ram";
		this.spd=Math.round(euc.dash.spd);
		this.g.setColor((euc.dash.spdC==1)?0:this.spdC[euc.dash.spdC]);
		this.g.fillRect(0,65,239,220);
		this.g.setColor((euc.dash.spdC==1)?13:15);
		if (100 <= this.spd) {
			if (120 < this.spd)  this.spd=120;
			this.g.setFontVector(140);
		}else 
			this.g.setFontVector(200);	  
		this.g.drawString(Math.round(this.spd*this.spdF),132-(this.g.stringWidth(Math.round(this.spd*this.spdF))/2),65); 
		//this.g.flip();
	},
	ampf: function(){
		"ram";
		this.amp=(euc.dash.amp);
		this.g.setColor(this.ampC[euc.dash.ampC]);
		this.g.fillRect(80,0,160,60); //amp 
		this.g.setColor(15);
		this.g.setFontVector(33);
		this.g.drawString(this.amp|0,(122-(this.g.stringWidth(this.amp|0)/2)),5); 
		//this.g.flip();
	},
	tid:-1,
	run:false,
	clear : function(){
		this.run=false;
		if (this.tid>=0) clearTimeout(this.tid);
		this.tid=-1;
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
		if (euc.state=="OFF") face.go("main",0); else {face.pageCurr=0;face.go(set.dash[set.def.dash.face],-1);}
	return true;
	},
	clear: function(){
		return true;
	},
	off: function(){
		return true;
	},
};	
face.dash_simple={"0":face[0],"1":face[1]};

//touch-main
touchHandler[0]=function(e,x,y){
	"ram";
	switch (e) {
	case 5: //tap event
		if (x < 120 && y < 60){//temp/clock
			if (set.def.dash.clkS==undefined) set.def.dash.clkS=0;
			set.def.dash.clkS=1-set.def.dash.clkS;
			face[0].time=-1;face[0].tmp=-1;
			buzzer(ew.pin.BUZZ,0,[30,50,30]);
		}else if (120 < x && y < 60){//batery percentage/voltage
			if (set.def.dash.batS==undefined) set.def.dash.batS=0;
			set.def.dash.batS=1-set.def.dash.batS;
			face[0].bat=-1;face[0].volt=-1;
			buzzer(ew.pin.BUZZ,0,[30,50,30]);
		}
		else{	
			buzzer(ew.pin.BUZZ,0,40);
		}
		face.off();
		break;
    case 1: //slide down event
		if (set.def.dash.face+1>=set.dash.length) set.def.dash.face=0; else set.def.dash.face++;
		face.go(set.dash[set.def.dash.face],0);
		return;
    case 2: //slide up event
		if (y>160&&x<50) {
			if (w.gfx.bri.lv!==7) {this.bri=w.gfx.bri.lv;w.gfx.bri.set(7);}
			else w.gfx.bri.set(this.bri);
			buzzer(ew.pin.BUZZ,0,[30,50,30]);
			face.off();
		}else if (Boolean(require("Storage").read("settings"))) {face.go("settings",0);return;}
        face.off();
		break;
    case 3: //slide left event
		(euc.state=="READY")?face.go('dash'+require("Storage").readJSON("dash.json",1)['slot'+require("Storage").readJSON("dash.json",1).slot+'Maker'],0):(euc.state=="OFF")?face.go("dashGarage",0):buzzer(ew.pin.BUZZ,0,40);
		return;
    case 4: //slide right event (back action)
		face.go("main",0);
		return;
    case 12: //touch and hold(long press) event
		buzzer(ew.pin.BUZZ,0,40);
		face.off();
		break;
    }
};
touchHandler.dash_simple={"0":touchHandler[0]};
