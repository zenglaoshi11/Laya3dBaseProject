import BaseView from "./BaseView";
import ConfigData, { SORTTYPE } from "../models/ConfigData";
import MyUtils from "../tools/MyUtils";
import PlatformMgr from "../mgrCommon/PlatformMgr";
import EventMgr from "../mgrCommon/EventMgr";
import ViewMgr from "../mgrCommon/ViewMgr";
import SoundMgr from "../mgrCommon/SoundMgr";
import GameFighting from "./GameFighting";
import AdListLoop from "./AdListLoop";

export default class MainViewLandscape extends BaseView {
    private btnSound:Laya.Button;
    private btnVirbort:Laya.Button;
    private soundOpen: Laya.Image;
    private soundClose: Laya.Image;
    private virbortOpen: Laya.Image;
    private virbortClose: Laya.Image;

    private title:Laya.Image;
    private btnInvite:Laya.Button;
    private btnService:Laya.Button;
    private btnRank:Laya.Button;
    private btnCollect:Laya.Button;

    private btnStart:Laya.Button;

    private adPlane:AdListLoop;
    constructor() { 
        super(); 
    }
    
    onAwake(): void {
        super.onAwake();
        this.btnSound = this.owner.getChildByName("btnSound") as Laya.Button;
        this.soundOpen = this.btnSound.getChildByName("open") as Laya.Image;
        this.soundClose = this.btnSound.getChildByName("close") as Laya.Image;

        this.btnVirbort = this.owner.getChildByName("btnVirbort") as Laya.Button;
        this.virbortOpen = this.btnVirbort.getChildByName("open") as Laya.Image;
        this.virbortClose = this.btnVirbort.getChildByName("close") as Laya.Image;

        this.soundClose.visible = !ConfigData.isSound;
        this.soundOpen.visible = ConfigData.isSound;

        this.virbortClose.visible = !ConfigData.isVirbort;
        this.virbortOpen.visible = ConfigData.isVirbort;

        this.title = this.owner.getChildByName("title") as Laya.Image;
        this.btnInvite = this.owner.getChildByName("btnInvite") as Laya.Button;
        this.btnService = this.owner.getChildByName("btnService") as Laya.Button;
        this.btnRank = this.owner.getChildByName("btnRank") as Laya.Button;
        this.btnCollect = this.owner.getChildByName("btnCollect") as Laya.Button;
        
        this.btnStart = this.owner.getChildByName("btnStart") as Laya.Button;
        this.adPlane = this.owner.getChildByName("ADPlane").getComponent(AdListLoop);
        this.btnInvite.y += this.offset.y/2;
        this.btnService.y += this.offset.y/2;
        this.btnRank.y += this.offset.y/2;
        this.btnCollect.y += this.offset.y/2;
        this.btnStart.y += this.offset.y/2;

        MyUtils.autoScreenSize([this.btnSound,this.btnVirbort]);

        if(PlatformMgr.ptAdMgr){
            PlatformMgr.ptAdMgr.showBannerAdHome();
        }
        Laya.timer.frameOnce(2,this,()=>{
            this.adPlane.init({
                _cellWidth: 130,
                _cellHeight:156,
                _spaceX:22
            });
            this.adPlane.start(ConfigData.getAdData(1003));
        })
    }  

    public addEvent() {
        super.addEvent();
        this.btnSound.on(Laya.Event.CLICK, this, this.soundBtnClick);
        this.btnVirbort.on(Laya.Event.CLICK, this, this.virbortBtnClick);
        
        this.btnRank.on(Laya.Event.CLICK, this, this.btnRankFunc);
        this.btnService.on(Laya.Event.CLICK, this, this.btnServiceFunc);
        this.btnInvite.on(Laya.Event.CLICK, this, this.btnInviteFunc);
        this.btnCollect.on(Laya.Event.CLICK, this, this.btnCollectFunc);

        this.btnStart.on(Laya.Event.CLICK, this, this.btnStartFunc);

        if(PlatformMgr.ptAdMgr){
            let self = this;
            Laya.timer.frameOnce(20, this, function () {
                let arr = [self.btnStart,self.btnRank,self.btnService,self.btnInvite,self.btnCollect];
                for (let index = 0; index < arr.length; index++) {
                    const btn = arr[index];
                    PlatformMgr.ptAPI.createAuthorizationButton({
                        x: btn.x,
                        y: btn.y - this.offset.y,
                        width: btn.width,
                        height: btn.height,
                        successBack: self[btn.name+"Func"],
                        failBack: self[btn.name+"Func"]
                    });
                }
            });
        }
    }
    
    private btnCollectFunc() {
        Laya.loader.load([{ url: "res/atlas/collet.atlas", type: Laya.Loader.ATLAS }], Laya.Handler.create(this, () => {
            ViewMgr.instance.openView({
                viewName: "Collect.scene",
                closeAll: true,
            });
        }))
    }

    private virbortBtnClick() {
        ConfigData.isVirbort = !ConfigData.isVirbort;
        this.virbortClose.visible = !ConfigData.isVirbort;
        this.virbortOpen.visible = ConfigData.isVirbort;
        ConfigData.setVirbort(ConfigData.isVirbort ? "" : "1");
    }

    private soundBtnClick() {
        ConfigData.isSound = !ConfigData.isSound;
        this.soundClose.visible = !ConfigData.isSound;
        this.soundOpen.visible = ConfigData.isSound;
        if(ConfigData.isSound){
            ConfigData.setSound("");
            SoundMgr.instance.playBGM()
        }else{
            ConfigData.setSound("1");
            SoundMgr.instance.stopBGM();
        }
    }

    private btnInviteFunc() {
        if (this._isClick) {
            return;
        }
        this._isClick = true;
        Laya.timer.once(500, this, () => {
            this._isClick = null;
        });

        let _d = {
            caller:this,
            callback:(res)=>{
                if(!res.success){
                    EventMgr.instance.emit("openTip","分享失败");
                }
            },
        };
        if(PlatformMgr.ptAPI)
            PlatformMgr.ptAPI.shareAppMessage(_d,0);
    }

    private btnServiceFunc() {
        if (this._isClick) {
            return;
        }
        this._isClick = true;
        Laya.timer.once(500, this, () => {
            this._isClick = null;
        });
        if(PlatformMgr.ptAPI)
            PlatformMgr.ptAPI.openCustomerServiceConversation();
    }

    private btnRankFunc() {
        if (this._isClick) {
            return;
        }
        this._isClick = true;
        Laya.timer.once(500, this, () => {
            this._isClick = null;
        });
        EventMgr.instance.emit("openRank",{_type:SORTTYPE.ENDLESS}); 
    }

    private btnStartFunc() {
        if (this._isClick) {
            return;
        }
        if(PlatformMgr.ptAPI)
            PlatformMgr.ptAPI.destoryAuthorization();
        if(PlatformMgr.ptAdMgr)
            PlatformMgr.ptAdMgr.destoryAllBannerAd();
        this._isClick = true;
        Laya.timer.once(500, this, () => {
            this._isClick = null;
        });
        EventMgr.instance.emit("openFighting");
        EventMgr.instance.emit("gameStart");
    }

    public removeEvent() {
        this.btnSound.off(Laya.Event.CLICK, this, this.soundBtnClick);
        this.btnVirbort.off(Laya.Event.CLICK, this, this.virbortBtnClick);
        
        this.btnRank.off(Laya.Event.CLICK, this, this.btnRankFunc);
        this.btnService.off(Laya.Event.CLICK, this, this.btnServiceFunc);
        this.btnInvite.off(Laya.Event.CLICK, this, this.btnInviteFunc);
        this.btnCollect.off(Laya.Event.CLICK, this, this.btnCollectFunc);

        this.btnStart.off(Laya.Event.CLICK, this, this.btnStartFunc);
        super.removeEvent();
    }

}