//clock settings
face[0].page="main";
UI.btn.ntfy(0,5,1,"_ele","topS", "","",15,12);
UI.ele.fill("_ele","topS",12);
UI.ele.ind("top",1,1);
UIc.start(1,0);
UI.ele.fill("_2x3",1,0);
UI.ele.fill("_2x3",2,0);
UI.btn.c2l("main","_2x3",3,set.def.hr24?"24 H":"12 H","",15,set.def.hr24?4:0);
UI.ele.fill("_2x3",4,12);
UI.btn.img("main","_2x3",5,UI.icon.power,"POWER",14,12);
UI.btn.img("main","_2x3",6,UI.icon.info,"ABOUT",14,12);
UIc.end();
UI.btn.img("bar","_bar",2,UI.icon.settings,0,14,12);
UI.btn.img("bar","_bar",3,UI.icon.dash,0,14,0);

//
UIc.main._2x3_1=()=>{buzzer(buz.ok);};
UIc.main._2x3_2=()=>{buzzer(buz.ok);};
UIc.main._2x3_3=()=>{
	buzzer(buz.ok);
	set.def.hr24=1-set.def.hr24;
	if (set.def.info) UI.btn.ntfy(1,1.5,0,"_bar",6,"CLOCK MODE",set.def.hr24?"24 HOURS":"A.M. / P.M.",15,set.def.hr24?4:0);
	UI.btn.c2l("main","_2x3",3,set.def.hr24?"24 H":"12 H","",15,set.def.hr24?4:0);
};
UIc.main._2x3_4=()=>{
	buzzer(buz.na);
};
UIc.main._2x3_5=()=>{
	buzzer(buz.ok);
	UI.btn.ntfy(0,3,1,"_bar",6,"","",15,0);
	UIc.start(0,1);
	UI.btn.c2l("bar","_bar",4,"RESTART","",15,4);
	UI.btn.c2l("bar","_bar",5,"DEVMODE","",15,7);
	UIc.end();
	UIc.bar._bar_4=()=>{
		setter.updateSettings();
		NRF.removeListener('disconnect',bdis);  
		NRF.disconnect();
		w.gfx.setColor(0,0);w.gfx.clear();w.gfx.flip();
		reset();
	};
	UIc.bar._bar_5=()=>{
		setter.updateSettings();
		NRF.disconnect();
		require("Storage").write("devmode","dev");
		w.gfx.setColor(0,0);w.gfx.clear();w.gfx.flip();
		E.reboot();
	};
	
};
UIc.main._2x3_6=()=>{
	buzzer(buz.ok);
	UI.btn.ntfy(0,10,1,"_bar",6,"","",15,0);
	UIc.start(1,1);UIc.end();
	let s=(getTime()-set.boot)|0;
	let d=0;
	let h=0;
	let m=0;
	if (s>864000) {set.boot=getTime();s=(getTime()-set.boot)|0;}
	while (s>86400) {s=s-86400;d++;}
	while (s>3600) {s=s-3600;h++;}
	while (s>60) {s=s-60;m++;}
	w.gfx.setColor(0,0);
	w.gfx.fillRect(0,20,239,279);
	w.gfx.setColor(1,14);
	w.gfx.setFont("Vector",18);
	w.gfx.drawString("MEMORY: "+process.memory().free+"/"+process.memory().total,120-(w.gfx.stringWidth("MEMORY: "+process.memory().free+"/"+process.memory().total)/2),35);  
	w.gfx.drawString("IMAGE: "+process.version,120-(w.gfx.stringWidth("IMAGE: "+process.version)/2),65);  
	w.gfx.drawString("ACC TYPE: "+set.def.acctype,120-(w.gfx.stringWidth("ACC TYPE: "+set.def.acctype)/2),95);  
	w.gfx.drawString("TOUCH TYPE: "+set.def.touchtype,120-(w.gfx.stringWidth("TOUCH TYPE: "+set.def.touchtype)/2),125);  
	w.gfx.drawString("UPTIME: "+d+"D-"+h+"H-"+m+"M",120-(w.gfx.stringWidth("UPTIME: "+d+"D-"+h+"H-"+m+"M")/2),155);  
	w.gfx.drawString("FLASH: "+require("Storage").getFree(),120-(w.gfx.stringWidth("FLASH: "+require("Storage").getFree())/2),185); 
	w.gfx.drawString("TEMPERATURE: "+E.getTemperature(),120-(w.gfx.stringWidth("TEMPERATURE: "+E.getTemperature())/2),215);  
	w.gfx.drawString("NAME: "+set.def.name,120-(w.gfx.stringWidth("NAME: "+set.def.name)/2),245);  
	w.gfx.flip();
};


/*
set.def.hr24=1-set.def.hr24;
face[0].btn(1,(set.def.hr24)?"24 H":"12 H",26,180,25,4,0,120,0,239,79);//2

}else if (face[0].set=="more") {
	if (30 <= y && y <= 80 ) {
		set.def.rstR=(set.def.rstR==165)?229:165;
		face[0].btn((set.def.rstR==165)?1:0,"TP SLEEP:",22,65,45,1,2,0,30,239,80,(set.def.rstR==165)?"P8":"P22",26,180,45);//1

*/

