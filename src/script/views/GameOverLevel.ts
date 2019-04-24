import BaseView from "./BaseView";
import EventMgr from "../mgrCommon/EventMgr";
import PlatformMgr from "../mgrCommon/PlatformMgr";
import ConfigData from "../models/ConfigData";

export default class GameOverLevel extends BaseView {
    private btnNext:Laya.Image;
    private btnHome:Laya.Image;
    private btnAgain:Laya.Image;
    private btnFight:Laya.Image;

    private imgFail:Laya.Image;
    private imgPass:Laya.Image;

    private passNum:Laya.FontClip;

    private adList:Laya.List;
    private adData:any[];

    constructor() { super(); }
    
    onAwake(): void {
        super.onAwake();

        let anchorDown = this.owner.getChildByName("anchorDown") as Laya.Image;
        anchorDown.y = this.offset.y/2;

        this.btnNext = anchorDown.getChildByName("btnNext") as Laya.Image;
        this.btnHome = anchorDown.getChildByName("btnHome") as Laya.Image;
        this.btnAgain = anchorDown.getChildByName("btnAgain") as Laya.Image;
        this.btnFight = anchorDown.getChildByName("btnFight") as Laya.Image;

        let anchorUp = this.owner.getChildByName("anchorUp") as Laya.Image;

        this.passNum = anchorUp.getChildByName("passNum") as Laya.FontClip;
        this.imgFail = anchorUp.getChildByName("imgFail") as Laya.Image;
        this.imgPass = anchorUp.getChildByName("imgPass") as Laya.Image;

        this.imgFail.visible = false;
        this.imgPass.visible = false;


        this.adList = this.owner.getChildByName("listAd") as Laya.List;
        this.adList.array = [];
        this.adList.renderHandler = new Laya.Handler(this, this.onRender);
        this.adList.vScrollBarSkin = "";
        this.adData = ConfigData.getAdData(1005);
    }

    addEvent(){
        this.btnNext.on(Laya.Event.CLICK,this,()=>{
            this.closeView();
            //跳转到下一关 TODO
            EventMgr.instance.emit("openFighting");
        });

        this.btnHome.on(Laya.Event.CLICK,this,()=>{
            EventMgr.instance.emit("goHome");
        });

        this.btnAgain.on(Laya.Event.CLICK,this,()=>{
            this.closeView();
            //在玩一次 TODO
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

    }


    openView(data?: any){
        super.openView(data);
        data = data || {
            passNum:10,//当前的关卡数
            isPass:(Math.random() > 0.5),//是否通关
        }
        //需要获取广告
        this.adList.array = this.adData;
        this.adList.refresh();

        this.imgFail.visible = !data.isPass;
        this.imgPass.visible = data.isPass;

        this.passNum.value = data.passNum.toString();

        //适配 是数字和“关”字居中
        let length  = data.passNum.toString().length - 1;
        this.passNum.x = 339 + 24 * length;
        

    }

    onRender(cell: Laya.Box, index: number): any {
        let img = cell.getChildAt(0) as Laya.Image;
        img.skin = this.adData[index].param;
    }

    onSelect(e:Laya.Event, index): void {
        //跳转到其他小游戏 
        if(PlatformMgr.ptAPI){
            PlatformMgr.ptAPI.navigateToMiniProgram(this.adData[index]);
        }
    }




}