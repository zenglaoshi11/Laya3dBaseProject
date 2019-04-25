import BaseView from "./BaseView";
import PlatformMgr from "../mgrCommon/PlatformMgr";
import ConfigData, { SORTTYPE } from "../models/ConfigData";
import AdListLoop from "./AdListLoop";
import ViewMgr from "../mgrCommon/ViewMgr";
import EventMgr from "../mgrCommon/EventMgr";
import UserData from "../models/UserData";
import GameMgr from "../mgr3d/GameMgr";
import MyUtils from "../tools/MyUtils";

export default class GameOverEndless extends BaseView {
    private wxOpenData:Laya.WXOpenDataViewer;
    private btnAgain:Laya.Image;
    private btnHome:Laya.Image;
    private btnFight:Laya.Image;
    private btnRank:Laya.Label;
    private score:Laya.FontClip;
    private content:Laya.Image;
    private btnAnchor:Laya.Image;
    private ADPlane:AdListLoop;
    
    constructor() { super(); }
    
    onAwake(){
        super.onAwake();
        this.content = this.owner.getChildByName("content") as Laya.Image;
        // this.wxOpenData = content.getChildByName("wxOpenData") as Laya.WXOpenDataViewer;
        this.ADPlane = this.content.getChildByName("ADPlaneBG").getChildByName("ADPlane").getComponent(AdListLoop);
        let btnAnchor = this.content.getChildByName("btnAnchor") as Laya.Image;
        this.btnAgain = btnAnchor.getChildByName("btnAgain") as Laya.Image;
        this.btnHome = btnAnchor.getChildByName("btnHome") as Laya.Image;
        this.btnFight = btnAnchor.getChildByName("btnFight") as Laya.Image;
        this.btnRank = this.content.getChildByName("btnRank") as Laya.Label;
        this.score = this.content.getChildByName("clipScore") as Laya.FontClip;

        this.btnAnchor = btnAnchor;
        this.ADPlane.start(ConfigData.getAdData(1003));
    }

    goHome(){
        EventMgr.instance.emit("goHome");
    }

    goFighting(){
        //再次挑战 TODO       
        EventMgr.instance.emit("openFighting"); 
    }

    goShare(){
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

    addEvent(){
        super.addEvent();
        this.btnHome.on(Laya.Event.CLICK,this,this.goHome);
        this.btnAgain.on(Laya.Event.CLICK,this,this.goFighting);
        this.btnFight.on(Laya.Event.CLICK,this,this.goShare);
        this.btnRank.on(Laya.Event.CLICK,this,this.openRank);
    }

    removeEvent(){
        this.btnHome.off(Laya.Event.CLICK,this,this.goHome);
        this.btnAgain.off(Laya.Event.CLICK,this,this.goFighting);
        this.btnFight.off(Laya.Event.CLICK,this,this.goShare);
        this.btnRank.off(Laya.Event.CLICK,this,this.openRank);
        super.removeEvent();
    }

    onEnable():void{
        super.onEnable();
        if(PlatformMgr.ptAdMgr)
            PlatformMgr.ptAdMgr.showBannerAdClassicEnd(true);
    }

    onDisable(): void {
        super.onDisable();
        if(PlatformMgr.ptAdMgr)
            PlatformMgr.ptAdMgr.destroyBannerAdClassicEnd();
    }
    
    openRank(){
         //打开排行榜
        this.closeGameOver();
        EventMgr.instance.emit("openRank",{
            _type:SORTTYPE.ENDLESS,
            callback:()=>{
                this.openGameOver();
            }
        });
    }
    
    openView(data?: any){
        data = data || {
            score : 100
        }
        super.openView(data);
        this.openGameOver();
        this.score.value = data.score.toString();

        if (ConfigData.ctrlInfo.isWudian) {
            let btnJumpY = 560;
            let randomY = MyUtils.random(btnJumpY, btnJumpY + 30);
            this.btnAnchor.y = randomY;
            Laya.timer.once(ConfigData.ctrlInfo.lateDelay, this, () => {
                if(PlatformMgr.ptAdMgr)
                    PlatformMgr.ptAdMgr.showBannerAdClassicEndFast();
                Laya.Tween.to(this.btnAnchor, {y: 340 }, 500, Laya.Ease.backOut, null, 500);
            });
        } else {
            this.btnAnchor.y = 340;
            if(PlatformMgr.ptAdMgr)
                PlatformMgr.ptAdMgr.showBannerAdClassicEndFast();
        }
        
    }

    openGameOver(){
        if(PlatformMgr.subDomain){
            this.wxOpenData = new Laya.WXOpenDataViewer();
            this.wxOpenData.width = 630;
            this.wxOpenData.height = 286;
            this.content.addChild(this.wxOpenData);
            this.wxOpenData.pos(-315,-233);
            PlatformMgr.subDomain.setOpenView(this.wxOpenData);
            PlatformMgr.subDomain.openGameOver(SORTTYPE.ENDLESS);
        }
    }

    closeGameOver(){
        if(PlatformMgr.subDomain){
            if(this.wxOpenData){
                this.wxOpenData.destroy();
                this.wxOpenData = null;
            }
            PlatformMgr.subDomain.closeGameOver(SORTTYPE.ENDLESS);
        }
    }
}