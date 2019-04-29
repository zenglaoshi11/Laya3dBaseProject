import PlatformMgr from "../mgrCommon/PlatformMgr";
import ConfigData, { SORTTYPE } from "../models/ConfigData";
import BaseView from "./BaseView";
import EventMgr from "../mgrCommon/EventMgr";
import MyUtils from "../tools/MyUtils";
import { SHARE_VIDEO_TYPE } from "../mgrCommon/StatisticsMgr";

export default class Resurgence extends BaseView {
    private goingSurpassOther:Laya.WXOpenDataViewer;
    private btnAnchor: Laya.Image;
    private btnShare: Laya.Image;
    private btnVideo: Laya.Image;
    private btnJump: Laya.Label;
    private reviveCount: Laya.Label;
    private progressMask: Laya.Image;
    private endAngle: number = -90;

    private isLoadAD: boolean = false; //是否正在拉取视频,防止玩家在拉取视频时进行其他操作
    private goShareAdc: boolean = false; //分享或者看视频


    constructor() { 
        super(); 
    }

    onAwake(): void {
        super.onAwake();
        this.endAngle = -90;
        this.btnAnchor = this.owner.getChildByName("btnAnchor") as Laya.Image;
        this.btnShare = this.btnAnchor.getChildByName("shareBtn") as Laya.Image;
        this.btnVideo = this.btnAnchor.getChildByName("videoBtn") as Laya.Image;
        this.btnJump = this.btnAnchor.getChildByName("skipBtn") as Laya.Label;
        let progressBg = this.owner.getChildByName("progressBg") as Laya.Image;
        this.progressMask = (progressBg.getChildByName("progressBg") as Laya.Image).mask as Laya.Image;
        this.progressMask.graphics.drawPie(149, 149, 149, -90, this.endAngle, "#ff0000");
        this.reviveCount = progressBg.getChildByName("reviveCount") as Laya.Label;
        this.btnAnchor.y = this.offset.y;
        this.isLoadAD = false;
    }

    addEvent() {
        this.btnShare.on(Laya.Event.CLICK, this, this.shareClick);
        this.btnVideo.on(Laya.Event.CLICK, this, this.videoClick);
        this.btnJump.on(Laya.Event.CLICK, this, this.jumpClick);
        super.addEvent();
    }
    
    public removeEvent() {
        this.btnShare.off(Laya.Event.CLICK, this, this.shareClick);
        this.btnVideo.off(Laya.Event.CLICK, this, this.videoClick);
        this.btnJump.off(Laya.Event.CLICK, this, this.jumpClick);
        super.removeEvent();
    }

    countDown(): void {
        if (this.goShareAdc) {
            return;
        }
        let pre = parseInt(this.reviveCount.text);
        let cur = pre - 1;
        if (cur < 1) {
            this.reviveCount.text = cur.toString();
            this.progressMask.graphics.drawPie(149, 149, 149, 250, this.endAngle, "#ff0000");
            this.openOver();
        } else {
            this.reviveCount.text = cur.toString();
            this.endAngle += 36;
            this.progressMask.graphics.drawPie(149, 149, 149, -90, this.endAngle, "#ff0000");
        }
    }

    public openView(data?: any): void {
        super.openView(data);
        this.openGoingSurpassOther(SORTTYPE.ENDLESS);
        Laya.timer.clearAll(this);
        this.reviveCount.text = "10";
        Laya.timer.loop(1000, this, this.countDown);

        this.btnVideo.visible = ConfigData.ctrlInfo.isVideo == 1;
        this.btnShare.visible = ConfigData.ctrlInfo.isShare == 1;
        if (ConfigData.ctrlInfo.isWudian) {
            let btnJumpY = 560;
            let randomY = MyUtils.random(btnJumpY, btnJumpY + 30);
            let centerX = Laya.stage.width / 2;
            let randomX = MyUtils.random(centerX - 30, centerX + 30);
            this.btnJump.pos(randomX, randomY);
            Laya.timer.once(ConfigData.ctrlInfo.lateDelay, this, () => {
                PlatformMgr.callADMethodByProxy("showBannerAdOtherFast");
                Laya.Tween.to(this.btnJump, {y: 420 }, 500, Laya.Ease.backOut, null, 500);
            });
        } else {
            PlatformMgr.callADMethodByProxy("showBannerAdOtherFast");
            this.btnJump.y = 340;
        }
    }

    openGoingSurpassOther(_type): void {
        if (PlatformMgr.subDomain) {
            if(!this.goingSurpassOther){
                this.goingSurpassOther = new Laya.WXOpenDataViewer();
                this.owner.addChild(this.goingSurpassOther);
            }
            this.goingSurpassOther.pos(0,131);
            this.goingSurpassOther.width = 750;
            this.goingSurpassOther.height = 92;
            PlatformMgr.subDomain.setOpenView(this.goingSurpassOther);
            PlatformMgr.subDomain.openGoingSurpassOther(_type);
        }
    }

    closeGoingSurpassOther(): void {
        if (PlatformMgr.subDomain) {
            PlatformMgr.subDomain.closeGoingSurpassOther();
            if(this.goingSurpassOther){
                this.goingSurpassOther.destroy();
                this.goingSurpassOther = null;
            }
        }
    }

    onEnable():void{
        super.onEnable();
        PlatformMgr.callADMethodByProxy("showBannerAdOther",true);
    }

    onDisable(): void {
        super.onDisable();
        PlatformMgr.callADMethodByProxy("destroyBannerAdOther");
        this.closeGoingSurpassOther();
    }


    videoClick() {
        if (this._isClick) {
            return;
        }
        this._isClick = true;
        Laya.timer.once(500, this, () => {
            this._isClick = null;
        });
        if (PlatformMgr.ptAdMgr) {
            this.isLoadAD = true;
            this.goShareAdc = true;
            PlatformMgr.callADMethodByProxy("showVideo",{
                _type:SHARE_VIDEO_TYPE.RESURGENCE,
                caller:this, 
                callBackSuc:() => {
                    //玩家复活
                    this.isLoadAD = false;
                    this.goShareAdc = false;
                },
                callBackFail:() => {
                    EventMgr.instance.emit("openTip", "看完视频才能复活");
                    this.isLoadAD = false;
                    this.goShareAdc = false;
                },
                callBackErro:() => {
                    EventMgr.instance.emit("openTip", "今日视频次数已用完");
                    this.isLoadAD = false;
                    this.goShareAdc = false;
                }
            });
        } else {
            //直接复活
        }

    }

    shareClick() {
        if (this._isClick) {
            return;
        }
        if (this.isLoadAD) {
            return;
        }
        this._isClick = true;
        Laya.timer.once(500, this, () => {
            this._isClick = null;
        });
        if (PlatformMgr.ptAPI) {
            PlatformMgr.callAPIMethodByProxy("shareAppMessage",{
                caller: this,
                shareBack: (res) => {
                    if (res.success) {
                        //复活

                    } else {
                        EventMgr.instance.emit("openTip", "需要成功分享才能复活");
                    }
                },
                args: {},
                type:1
            })
        } else {
            //直接复活
        }
    }

    jumpClick() {
        if (this._isClick) {
            return;
        }
        if (this.isLoadAD) {
            return;
        }
        this._isClick = true;
        Laya.timer.once(500, this, () => {
            this._isClick = null;
        });
        this.closeView();
        //打开结算界面
        this.openOver();
    }

    //打开结算界面
    openOver() {
        // this.closeView();
        EventMgr.instance.emit("openGameOver");
    }

}