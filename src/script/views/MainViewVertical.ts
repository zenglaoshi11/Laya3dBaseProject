import BaseView from "./BaseView";
import ConfigData from "../models/ConfigData";
import MyUtils from "../tools/MyUtils";
import PlatformMgr from "../mgrCommon/PlatformMgr";
import EventMgr from "../mgrCommon/EventMgr";
import ViewMgr from "../mgrCommon/ViewMgr";
import SoundMgr from "../mgrCommon/SoundMgr";

export default class MainViewVertical extends BaseView {
    private btnSound:Laya.Button;
    private btnVirbort:Laya.Button;
    private soundOpen: Laya.Image;
    private soundClose: Laya.Image;
    private virbortOpen: Laya.Image;
    private virbortClose: Laya.Image;

    private btnInvite:Laya.Button;
    private btnService:Laya.Button;
    private btnRank:Laya.Button;

    private btnStart:Laya.Button;

    constructor() { 
        super(); 
    }
    
    onAwake(): void {
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
    
        this.btnInvite = this.owner.getChildByName("btnInvite") as Laya.Button;
        this.btnService = this.owner.getChildByName("btnService") as Laya.Button;
        this.btnRank = this.owner.getChildByName("btnRank") as Laya.Button;
        
        this.btnStart = this.owner.getChildByName("btnStart") as Laya.Button;

        MyUtils.autoScreenSize([this.btnSound,this.btnVirbort]);
        if(PlatformMgr.ptAdMgr)
            PlatformMgr.ptAdMgr.showBannerAdHome();
    }

    public addEvent() {
        this.btnSound.on(Laya.Event.CLICK, this, this.soundBtnClick);
        this.btnVirbort.on(Laya.Event.CLICK, this, this.virbortBtnClick);
        
        this.btnInvite.on(Laya.Event.CLICK, this, this.inviteClick);
        this.btnService.on(Laya.Event.CLICK, this, this.serviceClick);
        this.btnRank.on(Laya.Event.CLICK, this, this.rankClick);

        this.btnStart.on(Laya.Event.CLICK, this, this.startClick);
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
            ConfigData.setSound("1");
            SoundMgr.instance.playBGM()
        }else{
            ConfigData.setSound("");
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
                    ViewMgr.instance.openView({
                        viewName: "uiViews/TipView.scene",
                        closeAll: false,
                        data: "分享失败",
                    });
                }
            },
        };
        if(PlatformMgr.ptAPI)
            PlatformMgr.ptAPI.shareAppMessage(_d,1);
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

        EventMgr.instance.emit("gameStart");
        ViewMgr.instance.openView({
            viewName: "GameFighting.scene",
            closeAll: true,
        });
    }

    public removeEvent() {
        super.removeEvent();
    }
}