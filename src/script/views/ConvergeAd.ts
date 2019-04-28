import BaseView from "./BaseView";
import TipView from "./TipView";
import MyUtils from "../tools/MyUtils";
import PlatformMgr from "../mgrCommon/PlatformMgr";
import ConfigData, { MAINBTNSTYPE } from "../models/ConfigData";
import ViewMgr from "../mgrCommon/ViewMgr";
import EventMgr from "../mgrCommon/EventMgr";

export default class ConvergeAd extends BaseView {
    private appid = "";//需要调转的APPID
    private adList: Laya.List;

    onAwake(){
        super.onAwake();
        MyUtils.autoScreenSize([this.homeBtn]);

        this.adList = this.owner.getChildByName("list") as Laya.List;
        this.adList.vScrollBarSkin = '';
        this.adList.selectEnable = true;
        this.adList.y = 20;
        this.adList.renderHandler = new Laya.Handler(this, this.onRender);
        this.adList.mouseHandler = new Laya.Handler(this, this.onClickItem);
        if(Laya.stage.height > 1334){
            this.adList.y = 20 + (Laya.stage.height - 1334) / 2
        }
        if(PlatformMgr.ptAdMgr)
            PlatformMgr.ptAdMgr.destoryAllBannerAd();
    }
    
    public addEvent() {
        super.addEvent();
        this.okBtn.on(Laya.Event.CLICK, this, this.okClick);
        this.homeBtn.on(Laya.Event.CLICK, this, this.onClickHome);
    }

    public removeEvent() {
        super.removeEvent();
        this.okBtn.off(Laya.Event.CLICK, this, this.okClick);
        this.homeBtn.off(Laya.Event.CLICK, this, this.onClickHome);
    }

    public openView(data?: any) {
        super.openView(data);
        this.homeBtn.visible = false;
        let allll = [];
        if (this.adList.array == null) {
            allll = ConfigData.getAdData(1004);
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
        EventMgr.instance.emit("goHome");
    }

    public okClick() {
        this.closeView();
        EventMgr.instance.emit("gameStart");
        EventMgr.instance.emit("openFighting");
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
                if(PlatformMgr.ptAPI)
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