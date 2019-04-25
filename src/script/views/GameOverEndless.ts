import BaseView from "./BaseView";
import PlatformMgr from "../mgrCommon/PlatformMgr";
import ConfigData, { SORTTYPE } from "../models/ConfigData";
import AdListLoop from "./AdListLoop";
import ViewMgr from "../mgrCommon/ViewMgr";
import EventMgr from "../mgrCommon/EventMgr";
import UserData from "../models/UserData";
import GameMgr from "../mgr3d/GameMgr";

export default class GameOverEndless extends BaseView {
    private wxOpenData:Laya.WXOpenDataViewer;
    private btnAgain:Laya.Image;
    private btnHome:Laya.Image;
    private btnFight:Laya.Image;
    private btnRank:Laya.Label;
    private score:Laya.FontClip;
    private center:Laya.Image;

    private ADPlane:AdListLoop;
    
    constructor() { super(); }
    
    onAwake(){
        super.onAwake();
        this.center = this.owner.getChildByName("center") as Laya.Image;
        // this.wxOpenData = center.getChildByName("wxOpenData") as Laya.WXOpenDataViewer;
        this.ADPlane = this.center.getChildByName("ADPlaneBG").getChildByName("ADPlane").getComponent(AdListLoop);
        let btnAnchor = this.center.getChildByName("btnAnchor") as Laya.Image;
        this.btnAgain = btnAnchor.getChildByName("btn_again") as Laya.Image;
        this.btnHome = btnAnchor.getChildByName("btn_home") as Laya.Image;
        this.btnFight = btnAnchor.getChildByName("btn_fight") as Laya.Image;
        this.btnRank = this.center.getChildByName("lbl_rank") as Laya.Label;
        this.score = this.center.getChildByName("clipScore") as Laya.FontClip;


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
        super.openView(data);
        this.openGameOver();
        // this.score.value = GameMgr.instance.getGameData().score.toString();
        this.score.value = "0";
        // if(ConfigData.ctrlInfo.isGoldeggs){
            EventMgr.instance.emit("openGoldenEggView");
        // }
    }

    openGameOver(){
        if(PlatformMgr.subDomain){
            this.wxOpenData = new Laya.WXOpenDataViewer();
            this.wxOpenData.width = 630;
            this.wxOpenData.height = 286;
            this.center.addChild(this.wxOpenData);
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