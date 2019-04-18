import BaseView from "./BaseView";
import TipView from "./TipView";
import MyUtils from "../tools/MyUtils";
import PlatformMgr from "../mgrCommon/PlatformMgr";
import ConfigData, { MAINBTNSTYPE } from "../models/ConfigData";
import ViewMgr from "../mgrCommon/ViewMgr";
import EventMgr from "../mgrCommon/EventMgr";

export default class ConvergeAdView extends BaseView {
    private appid = "";//需要调转的APPID
    private adList: Laya.List;
    private againChallengeBtn: Laya.Image;

    onAwake(){
        this.homeBtn = this.owner.getChildByName("btn_close") as Laya.Image;
        MyUtils.autoScreenSize([this.homeBtn]);
        let anchorS = this.owner.getChildByName("anchorS") as Laya.Image;
        let offsetY:number = PlatformMgr.ptAPI.getOffsetOpenDomain();
        anchorS.y = anchorS.y + offsetY;

        this.shareBtn = anchorS.getChildByName("shareBtn") as Laya.Image;
        this.againChallengeBtn = anchorS.getChildByName("btn_again") as Laya.Image;

        this.againChallengeBtn.y = this.againChallengeBtn.y + offsetY;

        this.adList = anchorS.getChildByName("List") as Laya.List;
        this.adList.vScrollBarSkin = '';
        this.adList.selectEnable = true;

        PlatformMgr.ptAdMgr.instance.showBannerAdOther();
    }

    onDisable(){
        PlatformMgr.ptAdMgr.instance.destoryAllBannerAd();
    }
    
    public addEvent() {
        this.adList.renderHandler = new Laya.Handler(this, this.onRender);
        this.adList.mouseHandler = new Laya.Handler(this, this.onClickItem);
        this.againChallengeBtn.on(Laya.Event.CLICK, this, this.onClickHome);
        this.shareBtn.on(Laya.Event.CLICK, this, this.onClickShare);
        this.homeBtn.on(Laya.Event.CLICK, this, this.onClickHome);
    }

    public removeEvent() {
        super.removeEvent();
        this.adList.renderHandler = null;
        this.adList.mouseHandler = null;
        this.againChallengeBtn.off(Laya.Event.CLICK, this, this.onClickHome);
        this.shareBtn.off(Laya.Event.CLICK, this, this.onClickShare);
        this.homeBtn.off(Laya.Event.CLICK, this, this.onClickHome);
    }

    public openView(data?: any) {
        super.openView(data);
        this.homeBtn.visible = false;

        let info = ConfigData.systemInfo;
        var y = 50 + (info.statusBarHeight > 20 ? 74 : 0);
        this.homeBtn.y = y;

        let allll = [];
        if (this.adList.array == null) {
            allll = ConfigData.getADData(1004);
            this.adList.array = allll;
        }
        this.adList.refresh();//刷新数据源
        this.adList.scrollTo(0); //第一个显示的 位置
        Laya.timer.once(1000, this, () => {
            if (this && this.homeBtn) {
                this.homeBtn.visible = true;
            }
        })
    }

    public onClickHome() {
        this.closeView();
        ViewMgr.instance.openView({
            viewName: ConfigData.mainBtnsType == MAINBTNSTYPE.LANDSCAPE ? "MainViewLandscape.scene" ? "MainViewVertical.scene",
            closeAll: true,
        });
        EventMgr.instance.emit("goHome");
    }

    public onClickAgain() {
        this.closeView();
    }

    private shareBack(res) {
        let msg = "";
        if (res.success) {
            msg = "分享成功";
        } else {
            msg = "分享失败";
        }
        ViewMgr.instance.openView({
            viewName: "TipView.scene",
            clas: TipView,
            closeAll: false,
            data: msg,
        });
    }

    onClickShare() {
        PlatformMgr.ptAPI.shareAppMessage({
            caller: this,
            callback: this.shareBack,
        }, 0)
    }

    /**
    * 单个 box 点击事件
    */
    private onClickItem(e: Laya.Event, index: number): void {
        if (e.type == Laya.Event.CLICK) {
            if ((e.target) instanceof Laya.Box) {
                let obj = {
                    path: this.adList.array[index].toLinks,
                    appid: this.adList.array[index].appid,
                };
                PlatformMgr.ptAPI.navigateToMiniProgram(obj);
            }
        }
    }
    private onRender(cell: Laya.Box, index: number): void {
        if (index > this.adList.array.length && this.adList.array.length == 0) return;
        if (this.adList.array[index] != null) {
            var img = cell.getChildByName("img") as Laya.Image;
            img.skin = this.adList.array[index].param;
        }
    }
}