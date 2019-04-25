import BaseView from "./BaseView";
import EventMgr from "../mgrCommon/EventMgr";
import PlatformMgr from "../mgrCommon/PlatformMgr";
import ConfigData from "../models/ConfigData";
import MyUtils from "../tools/MyUtils";

export default class GameOverLevel extends BaseView {
    private btnNext:Laya.Image;
    private btnHome:Laya.Image;
    private btnAgain:Laya.Image;
    private btnFight:Laya.Image;

    private imgFail:Laya.Image;
    private imgPass:Laya.Image;
    private btnAnchor:Laya.Image;

    private passNum:Laya.FontClip;

    private adList:Laya.List;
    private adData:any[];

    constructor() { super(); }
    
    onAwake(): void {
        super.onAwake();

        let content = this.owner.getChildByName("content") as Laya.Image;
        let btnAnchor = content.getChildByName("btnAnchor") as Laya.Image;
        this.btnAnchor = btnAnchor;

        this.btnNext = btnAnchor.getChildByName("btnNext") as Laya.Image;
        this.btnHome = btnAnchor.getChildByName("btnHome") as Laya.Image;
        this.btnAgain = btnAnchor.getChildByName("btnAgain") as Laya.Image;
        this.btnFight = btnAnchor.getChildByName("btnFight") as Laya.Image;


        this.passNum = content.getChildByName("passNum") as Laya.FontClip;
        this.imgFail = content.getChildByName("imgFail") as Laya.Image;
        this.imgPass = content.getChildByName("imgPass") as Laya.Image;

        this.imgFail.visible = false;
        this.imgPass.visible = false;


        this.adList = content.getChildByName("listAd") as Laya.List;
        this.adList.array = [];
        this.adList.renderHandler = new Laya.Handler(this, this.onRender);
        this.adList.vScrollBarSkin = "";
        this.adData = ConfigData.getAdData(1005);
    }
    
    goFighting(){
        //再次挑战 TODO       
        EventMgr.instance.emit("openFighting"); 
        this.closeView();
    }

    goHome(){
        EventMgr.instance.emit("goHome");
        this.closeView();
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
        this.btnNext.on(Laya.Event.CLICK,this,this.goFighting);
        this.btnHome.on(Laya.Event.CLICK,this,this.goHome);
        this.btnAgain.on(Laya.Event.CLICK,this,this.goFighting);
        this.btnFight.on(Laya.Event.CLICK,this,this.goShare);
        super.addEvent();
    }

    public removeEvent() {
        this.btnNext.off(Laya.Event.CLICK,this,this.goFighting);
        this.btnHome.off(Laya.Event.CLICK,this,this.goHome);
        this.btnAgain.off(Laya.Event.CLICK,this,this.goFighting);
        this.btnFight.off(Laya.Event.CLICK,this,this.goShare);
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
        // this.passNum.x = 246 + 26 * length;
        
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