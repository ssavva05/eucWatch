E.setFlags({pretokenise:1});
//touch
tcNext.replaceWith(()=>{buzzer.nav(buzzer.buzz.ok);eval(require("Storage").read("set_main"));if (UI.ntid) {clearTimeout(UI.ntid);UI.ntid=0;}face[0].bar();});
tcBack.replaceWith(()=>{buzzer.nav(buzzer.buzz.ok);eval(require("Storage").read("set_main"));if (UI.ntid) {clearTimeout(UI.ntid);UI.ntid=0;}face[0].bar();});
//
face[0].page="theme";
//
let tout=(ew.def.off[face.appRoot[0]])?ew.def.off[face.appRoot[0]]:3000;
let tm=(tout/(tout<60000?"1000":tout<3600000?"60000":"3600000"))+ (tout<60000?"''":tout<3600000?"'":"h");
UI.ele.ind(0,0,0);
UIc.start(1,0);
UI.btn.img("main","_fold",1,"themes","FACE",11,1,1);
UI.btn.c2l("main","_2x3",3,ew.def.txt?"OFF":tm,ew.def.txt?tm:"",15,1);
UI.btn.c2l("main","_2x3",4,"SIZE",UI.size.txt*100,15,1); //4
UI.btn.img("main","_2x3",5,"txt","TXT",ew.def.txt?15:3,ew.def.txt?4:1);
UI.btn.img("main","_2x3",6,"info","INFO",ew.def.info?15:3,ew.def.info?4:1);
UIc.end();
UIc.main._fold=()=>{
	buzzer.nav(buzzer.buzz.na);
};
UIc.main._2x3=(i)=>{
	if (i==3){
		buzzer.nav(buzzer.buzz.ok);
		let f=16<face.appRoot[0].length?face.appRoot[0].substr(0,16).toUpperCase()+"..":face.appRoot[0].toUpperCase();
		UI.btn.ntfy(1,3,0,"_bar",6,"TIMEOUT",f,15,6,1);
		ew.temp.bar=1;
		TC.val={cur:3,dn:3,up:100,tmp:0};
		UIc.tcBar=(a,b)=>{ 
			UI.btn.ntfy(0,2,1);
			let tout=ew.def.off[face.appRoot[0]]?ew.def.off[face.appRoot[0]]:3000;
			if (a==-1){
				if ( 1000 < tout && tout <= 15000 ) tout=tout<6000?3000:tout-3000;
				else if ( 15000 < tout && tout <= 60000 ) tout=tout-5000;
				else if (60000 < tout && tout <= 3600000 )tout=tout < 600001?60000:tout-600000; 
				else if (3600000 < tout ) tout=tout < 3600000?3600000:tout-1800000; 
				else tout=3000;
				let tm=(tout/(tout<60000?"1000":tout<3600000?"60000":"3600000"))+ (tout<60000?"''":tout<3600000?"'":"h");
				UI.btn.ntfy(0,3,1,"_bar",6,"","",15,0,1);
				UI.btn.c2l("main","_2x3",3,ew.def.txt?"OFF":tm,ew.def.txt?tm:"",15,1);
				ew.def.off[face.appRoot[0]]=tout;
			}else {
				if (1000 <= tout && tout < 15000 )	tout=tout+3000;
				else if (15000 <= tout && tout < 60000 )	tout=tout+5000;
				else if (60000 <= tout && tout < 3600000) tout=tout<600000?600000:tout+600000; 
				else if (3600000 <= tout ) tout=14400000<=tout?14400000:tout+1800000; 
				else tout=3000; //1sec
				let tm=(tout/(tout<60000?"1000":tout<3600000?"60000":"3600000"))+ (tout<60000?"''":tout<3600000?"'":"h");
				UI.btn.ntfy(0,3,1,"_bar",6,"","",15,0,1);
				UI.btn.c2l("main","_2x3",3,ew.def.txt?"OFF":tm,ew.def.txt?tm:"",15,1);
				ew.def.off[face.appRoot[0]]=tout;
			}
		};	
	}else if (i==4){
		buzzer.nav(buzzer.buzz.ok);
		UI.btn.ntfy(1,3,0,"_bar",6,"TEXT SIZE","SET",15,1,1);
		ew.temp.bar=1;
		TC.val={cur:UI.size.txt*100,dn:60,up:100,tmp:0};
		UIc.tcBar=(a,b)=>{ 
			UI.btn.ntfy(0,2,1);
			UI.btn.c2l("main","_2x3",4,"SIZE",b,15,1); //4
			UI.size.txt=b/100;
			UI.size.sca=b/100*(process.env.BOARD=="BANGLEJS2"?0.9:1.1);
			ew.def.size=b/100;
		};		
	}else if (i==5){
		buzzer.nav(buzzer.buzz.ok);
		ew.def.txt=1-ew.def.txt;
		if (ew.def.info) UI.btn.ntfy(1,0,0,"_bar",6,"TEXT UNDER","ICON",0,15);
		UI.btn.img("main","_2x3",5,"txt","TXT",ew.def.txt?15:3,ew.def.txt?4:1);
		UI.btn.img("main","_2x3",6,"info","INFO",ew.def.info?15:3,ew.def.info?4:1);
		UI.btn.c2l("main","_2x3",3,ew.def.txt?"OFF":tm,ew.def.txt?tm:"",15,1);
	}else if (i==6){
		buzzer.nav(buzzer.buzz.ok);
		ew.def.info=1-ew.def.info;
		UI.btn.ntfy(1,0,0,"_bar",6,"INFO ON","ACTIONS",0,15);
		UI.btn.img("main","_2x3",6,"info","INFO",ew.def.info?15:3,ew.def.info?4:1);
	}
};
//
