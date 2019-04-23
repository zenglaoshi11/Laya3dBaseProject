import BaseView from "./BaseView";
import EventMgr from "../mgrCommon/EventMgr";
import PlatformMgr from "../mgrCommon/PlatformMgr";

export default class GameOverLevel extends BaseView {
    private btnNext:Laya.Image;
    private btnHome:Laya.Image;
    private btnAgain:Laya.Image;
    private btnFight:Laya.Image;

    private imgFail:Laya.Image;
    private imgPass:Laya.Image;

    private passName:Laya.FontClip;

    private adList:Laya.List;
    private adData:any[];

    constructor() { super(); }
    
    onAwake(): void {
        super.onAwake();

        let anchorDown = this.owner.getChildByName("anchorDown") as Laya.Image;
        anchorDown.y = this.offset.y/2;

        this.btnNext = anchorDown.getChildByName("btn_next") as Laya.Image;
        this.btnHome = anchorDown.getChildByName("btn_home") as Laya.Image;
        this.btnAgain = anchorDown.getChildByName("btn_again") as Laya.Image;
        this.btnFight = anchorDown.getChildByName("btn_fight") as Laya.Image;

        let anchorUp = this.owner.getChildByName("anchorUp") as Laya.Image;

        this.imgFail = anchorUp.getChildByName("img_fail") as Laya.Image;
        this.imgPass = anchorUp.getChildByName("img_pass") as Laya.Image;

        this.imgFail.visible = false;
        this.imgPass.visible = false;


        this.adList = this.owner.getChildByName("img_ADBg").getChildByName("list_AD") as Laya.List;
        this.adList.array = [];
        this.adList.renderHandler = new Laya.Handler(this, this.onRender);
        this.adList.vScrollBarSkin = "";
        this.adData = [];
    }

    addEvent(){
        this.btnNext.on(Laya.Event.CLICK,this,()=>{
            this.closeView();
            //跳转到下一关 TODO
        });

        this.btnHome.on(Laya.Event.CLICK,this,()=>{
            EventMgr.instance.emit("goHome");
        });

        this.btnAgain.on(Laya.Event.CLICK,this,()=>{
            this.closeView();
            //在玩一次 TODO
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
        //需要获取广告
        //this.adData
        // this.adList.array = this.adData;
        // this.adList.refresh()

        let isPass = false; //是否通关 这里需要自己赋值
        this.imgFail.visible = !isPass;
        this.imgPass.visible = isPass;

        let passName = 10; //当前的关卡数，这里需要自己赋值
        this.passName.value = passName.toString();

        //适配 是数字和“关”字居中
        let length  = passName.toString().length - 1;
        this.passName.x = 339 + 24 * length;
        

    }

    onRender(cell: Laya.Box, index: number): any {
        let img = cell.getChildAt(0) as Laya.Image;
        img.skin = this.adData[index].skin;
    }

    onSelect(e:Laya.Event, index): void {
        //跳转到其他小游戏 
        if(PlatformMgr.ptAPI){
            PlatformMgr.ptAPI.navigateToMiniProgram(this.adData[index]);
        }
    }




}