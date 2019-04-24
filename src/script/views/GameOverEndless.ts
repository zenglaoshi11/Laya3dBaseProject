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

    private ADPlane:AdListLoop;
    
    constructor() { super(); }
    
    onAwake(){
        super.onAwake();
        this.wxOpenData = this.owner.getChildByName("wxOpenData") as Laya.WXOpenDataViewer;
        let center = this.owner.getChildByName("center") as Laya.Image;
        this.ADPlane = center.getChildByName("ADPlaneBG").getChildByName("ADPlane").getComponent(AdListLoop);

        let btnAnchor = center.getChildByName("btnAnchor") as Laya.Image;
        this.btnAgain = btnAnchor.getChildByName("btn_again") as Laya.Image;
        this.btnHome = btnAnchor.getChildByName("btn_home") as Laya.Image;
        this.btnFight = btnAnchor.getChildByName("btn_fight") as Laya.Image;
        this.btnRank = center.getChildByName("lbl_rank") as Laya.Label;
        this.score = center.getChildByName("clipScore") as Laya.FontClip;


        this.ADPlane.start(ConfigData.getAdData(1003));
    }


    addEvent(){
        this.btnHome.on(Laya.Event.CLICK,this,()=>{
            EventMgr.instance.emit("goHome");
        });

        this.btnAgain.on(Laya.Event.CLICK,this,()=>{
            this.closeView();
            //再次挑战 TODO       
            EventMgr.instance.emit("openFighting");     
        });

        this.btnFight.on(Laya.Event.CLICK,this,()=>{
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
        });

        this.btnRank.on(Laya.Event.CLICK,this,()=>{
            //打开排行榜
            ViewMgr.instance.openView({
                viewName: "Rank.scene",
                closeAll: false,
            });
        });

    }

    
    openView(data?: any){
        super.openView(data);
        this.wxOpenData.visible = true;
        if(PlatformMgr.subDomain){
            PlatformMgr.subDomain.setOpenView(this.wxOpenData);
            PlatformMgr.subDomain.openGameOver(SORTTYPE.ENDLESS);
        }
        // this.score.value = GameMgr.instance.getGameData().score.toString();
        this.score.value = "0";
    }
}