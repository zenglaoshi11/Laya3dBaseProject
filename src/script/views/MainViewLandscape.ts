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

    private gameFighting:Laya.Scene;
    private gameFightingCom:GameFighting;

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


        Laya.Scene.load("GameFighting.scene",Laya.Handler.create(this,(scene:Laya.Scene)=>{
            this.gameFighting = scene;
            this.gameFightingCom = scene.getComponent(GameFighting);
            scene.visible = false;
            this.gameFighting.active = false;
            Laya.stage.addChild(scene);
        }))

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
                _spaceX:23
            });
            this.adPlane.start(ConfigData.getAdData(1003));
        })
    }  

    public addEvent() {
        this.btnSound.on(Laya.Event.CLICK, this, this.soundBtnClick);
        this.btnVirbort.on(Laya.Event.CLICK, this, this.virbortBtnClick);
        
        this.btnRank.on(Laya.Event.CLICK, this, this.rankClick);
        this.btnService.on(Laya.Event.CLICK, this, this.serviceClick);
        this.btnInvite.on(Laya.Event.CLICK, this, this.inviteClick);
        this.btnCollect.on(Laya.Event.CLICK, this, this.collectClick);

        this.btnStart.on(Laya.Event.CLICK, this, this.startClick);

        if(PlatformMgr.ptAdMgr){
            let self = this;

            Laya.timer.frameOnce(20, this, function () {
                PlatformMgr.ptAPI.createAuthorizationButton({
                    x: self.btnStart.x,
                    y: self.btnStart.y +  self.btnStart.height - this.offset.y,
                    isFull: true,
                    width: this.btnStart.width,
                    height: this.btnStart.height,
                    successBack: new Laya.Handler(self, self.startClick),
                    failBack: new Laya.Handler(self, self.startClick)
                });

                PlatformMgr.ptAPI.createAuthorizationButton({
                    x: self.btnRank.x,
                    y: self.btnRank.y +  self.btnRank.height - this.offset.y,
                    isFull: true,
                    width: this.btnRank.width,
                    height: this.btnRank.height,
                    successBack: new Laya.Handler(self, self.rankClick),
                    failBack: new Laya.Handler(self, self.rankClick)
                });

                PlatformMgr.ptAPI.createAuthorizationButton({
                    x: self.btnService.x,
                    y: self.btnService.y +  self.btnService.height - this.offset.y,
                    isFull: true,
                    width: this.btnService.width,
                    height: this.btnService.height,
                    successBack: new Laya.Handler(self, self.serviceClick),
                    failBack: new Laya.Handler(self, self.serviceClick)
                });

                PlatformMgr.ptAPI.createAuthorizationButton({
                    x: self.btnInvite.x,
                    y: self.btnInvite.y +  self.btnInvite.height - this.offset.y,
                    isFull: true,
                    width: this.btnInvite.width,
                    height: this.btnInvite.height,
                    successBack: new Laya.Handler(self, self.inviteClick),
                    failBack: new Laya.Handler(self, self.inviteClick)
                });

                PlatformMgr.ptAPI.createAuthorizationButton({
                    x: self.btnCollect.x,
                    y: self.btnCollect.y +  self.btnCollect.height - this.offset.y,
                    isFull: true,
                    width: this.btnCollect.width,
                    height: this.btnCollect.height,
                    successBack: new Laya.Handler(self, self.collectClick),
                    failBack: new Laya.Handler(self, self.collectClick)
                });
            });
        }
    }
    
    private collectClick() {
        // this.gameFightingCom.openProvocationOther(SORTTYPE.ENDLESS);
        // ViewMgr.instance.openView({
        //     viewName: "Resurgence.scene",
        // });
        // return;
        ViewMgr.instance.openView({
            viewName: "Collect.scene",
            closeAll: true,
        });
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

    private inviteClick() {
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

    private serviceClick() {
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

    private rankClick() {
        if (this._isClick) {
            return;
        }
        this._isClick = true;
        Laya.timer.once(500, this, () => {
            this._isClick = null;
        });
        ViewMgr.instance.openView({
            viewName: "Rank.scene",
            closeAll: false,
        });
    }

    private startClick() {
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
        // this.closeView();
        // ViewMgr.instance.hideView(this.);
        EventMgr.instance.emit("gameStart");
        this.gameFighting.visible = true;
        this.gameFighting.active = true;
    }

    public removeEvent() {
        super.removeEvent();
    }

}