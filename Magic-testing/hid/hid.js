//hid
face[0] = {
    offms: 5000,
    col: {
        txt: 15,
        txt1: 14,
        txt2: 0,
        hdr: 1,
        hdrTxt: 3,
        bck: 5,
        bck1: 3,
        bck2: 4,
        btnEn: 4,
        btnDs: 3,
        btnDs1: 12,
        btnTxt: 0,
        btnTxt1: 15
    },
    init: function() {
        var g = w.gfx;
        if (ew.def.hid != 1) {
            g.setColor(0, 0);
            //g.clearRect(1,0,239,239);
            g.setColor(1, 15);
            g.setFont("Vector", 25);
            g.drawString("HID DISABLED", 30, 0);
            g.setFont("Vector", 20);
            g.drawString("LONG PRESS", 60, 100);
            g.drawString("TOGGLE IN SETTINGS", 10, 140);
            g.drawString("TO ENABLE", 60, 200);
            g.flip();
        } else {
            //header
	    //todo:add music info from gb
            g.setColor(0, 1); //header_back
            g.fillRect(0, 0, 239, 35);
            g.setColor(1, 14); //header_txt
            g.setFont("Vector", 25);
            g.drawString("MUSIC", 4, 6);
            g.flip();
            //top
            g.setColor(1, 14);
            g.fillRect(60, 143, 179, 239); //play&oause
            g.drawImage(require("heatshrink").decompress(atob("oFAwMB/4A/AB3wAgf8v/n8EfA4X4n+B4EHCgcfwOANIYHDgAHFPoM/A40PA4kBwEDA4vgEAQHD+AgCA4f8gBJBA4f/gBJBA4nAAQIHEEAN/A4ggCA4ggCA4pJBA4pJBA4v4A43+gFwA4ggBA43AA4wXGJAIHFLAI/GQYJPLHwMPA4hOBn4HEVAQHEXAQHDDwKfFV46eCA4iuCA4geCd4oeBf5eAdwQHEfwQHD4EPA4c/wPgDwRqBn/DAoQA/ADg=")), 72, 145, {
                scale: 1.5
            });
            g.setColor(0, 0);
            g.flip();
            //right
            g.setColor(1, 6);
            g.fillRect(182, 143, 239, 190); //vol_up
            g.drawImage(require("heatshrink").decompress(atob("mEwwMB/4Ar+IFE+F/AgX++E/AoX8+EPAoX4/kHCwf/gYFC8H/wYFC4H/4IFCwANCAAMA+4ZBFwMA+Y2B/hyB+P4AofwAo0/Aod8AsQpFGohBCOwJNDKYRZDL4JlENYJxDO4OBQYiJD+CVE/ChEU4MfWYi5DYowAm")), 186, 144);
            g.fillRect(182, 190, 239, 239); //next
            g.drawImage(require("heatshrink").decompress(atob("mEwwMB/4A/AA/3AQMPAQPzAonxAonwv4FEn4FEAYIFDg4FEgYFEgAFFv4FEj4FEh4FKCIodFFIiqBIJJNFLIplFPpSJFAH4AGA==")), 186, 194);
            g.setColor(0, 15);
            g.flip();
            //left
            g.setColor(1, 6);
            g.fillRect(0, 143, 57, 190); //vol_down
            g.drawImage(require("heatshrink").decompress(atob("mEwwMB/4A394FE54FEx4FEh4ED/wFE/gFE/AFE+EPv4FC8EPn4EB4EAh8fAogYCApEHAsQvLIIQGBJoZTCLIZfBNZJ3FQYqPFTYynFWYoAsA")), 4, 144);
            g.fillRect(0, 190, 57, 239); //prev
            g.drawImage(require("heatshrink").decompress(atob("mEwwMB/4A/AA/wAQPvAonPAokPAof+Aon8AonwAongAomAAokAAof+Aon4AonwApQRF/gFEFIo1GIIpNF/BlKOIp9GRIQA/AAwA=")), 4, 194);
            g.setColor(0, 15);
            g.flip();
        }
    },
    show: function() {
        if (!this.run) return;
        var g = w.gfx;
        //loop
        this.tid = setTimeout(function(t, o) {
            t.tid = -1;
            t.show(o);
        }, 2000, this);
    },
    tid: -1,
    run: false,
    clear: function(o) {
        var g = w.gfx;
        g.clear();
        this.exit(o);
        return true;
    },
    exit: function(o) {
        this.run = false;
        if (this.tid >= 0) clearTimeout(this.tid);
        this.tid = -1;
        return true;
    },
    off: function(o) {
        var g = w.gfx;
        g.off();
        this.clear(o);
    }
};
UIc.start(1,1);
UI.ele.coord("bar","_bar",1);
//UI.ele.coord("bar","_bar",2);
UI.ele.coord("bar","_bar",3);

/*
  sendHid = function (code, cb) {
    try {
      NRF.sendHIDReport([1,code], () => {
        NRF.sendHIDReport([1,0], () => {
          if (cb) cb();
        });
      });
    } catch(e) {
      print(e);
    }
  };
  next = function (cb) { sendHid(0x01, cb); };
  prev = function (cb) { sendHid(0x02, cb); };
  toggle = function (cb) { sendHid(0x10, cb); };
  up = function (cb) {sendHid(0x40, cb); };
  down = function (cb) { sendHid(0x80, cb); };

*/
UIc.end();


UIc.bar._bar=(i)=>{ 
	buzzer.nav(buzzer.buzz.ok);
    if (i==1) {
        //down();
	    ew.is.hidM.volumeDown();
    }    else if (i==2) {
	    ew.is.hidM.playpause();
    }    else if (i==3) {
        //up();
	    ew.is.hidM.volumeUp();
    }


};

