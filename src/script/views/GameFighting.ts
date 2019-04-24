import PlatformMgr from "../mgrCommon/PlatformMgr";
import WXSubDomain from "../platform/wx/WXSubDomain";
import BaseView from "./BaseView";
import ConfigData, { OPERATINGTYPE, SORTTYPE } from "../models/ConfigData";
import CurrGameData from "../models/CurrGameData";
import GameMgr from "../mgr3d/GameMgr";
import EventMgr from "../mgrCommon/EventMgr";

export default class GameFighting extends BaseView {
    private surpassOther;
    private provocationOther;
    private finger: Laya.Image;
    private dragBeginnerGuide: Laya.Image;
    private touchBeginnerGuide: Laya.Image;
    private fingerStartTime: number;
    private score: Laya.FontClip;
    private progressNode: Laya.Image; //进度条的父节点
    private progress: Laya.Image; //进度条

    private mouseTouch: Laya.Image;


    onAwake() {
        super.onAwake();

        this.dragBeginnerGuide = this.owner.getChildByName("dragBeginnerGuide") as Laya.Image;
        this.touchBeginnerGuide = this.owner.getChildByName("touchBeginnerGuide") as Laya.Image;
        this.mouseTouch = this.owner.getChildByName("mouseTouch") as Laya.Image;

        this.score = this.owner.getChildByName("score_num") as Laya.FontClip;
        this.progressNode = this.owner.getChildByName("progress") as Laya.Image;
        this.progress = this.progressNode.getChildByName("progress") as Laya.Image;

        this.surpassOther = this.owner.getChildByName("surpassOther");
        this.provocationOther = this.owner.getChildByName("provocationOther");
        this.score.visible = false;
        this.progressNode.visible = false;
        this.provocationOther.visible = false;
        this.surpassOther.visible = false;
        this.dragBeginnerGuide.visible = false;
        this.touchBeginnerGuide.visible = false;
        Laya.stage.addChildAt(this.owner, 1);
    }

    private FigerAnim(): void {
        this.finger.x = 420 * Math.abs((Laya.timer.currTimer - this.fingerStartTime + 500) % 2000 - 1000) / 1000;
    }

    openView(data?: any) {
        super.openView(data);
        if (ConfigData.beginnerGuide == OPERATINGTYPE.TOUCH) {
            this.touchBeginnerGuide.visible = true;
        } else {
            this.dragBeginnerGuide.visible = true;
            this.fingerStartTime = Laya.timer.currTimer;
            Laya.timer.frameLoop(1, this, this.FigerAnim);
        }
        this.score.visible = GameMgr.instance.getGameData().sortType == SORTTYPE.ENDLESS;
        this.progress.visible = !(GameMgr.instance.getGameData().sortType == SORTTYPE.ENDLESS);
    }

    public addEvent() {
        EventMgr.instance.onEvent("updateScore",this,this.updataScore);
        EventMgr.instance.onEvent("updataProgress",this,this.updataProgress);
        

    }

    public removeEvent() {
        EventMgr.instance.onOffEvent("updateScore",this,this.updataScore);
        EventMgr.instance.onOffEvent("updataProgress",this,this.updataProgress);
    }

    updataScore() {
        this.score.value = GameMgr.instance.getGameData().score.toString();
    }

    updataProgress(num: number) {
        num = num > 1 ? 1 : num;
        this.progress.width = num * 361;
    }


    openProvocationOther(_type): void {
        this.provocationOther.visible = true;
        (this.owner as Laya.Scene).visible = true;
        PlatformMgr.subDomain.setOpenView(this.provocationOther);
        PlatformMgr.subDomain.openProvocationOther(_type);
    }

    closeProvocationOther(): void {
        this.provocationOther.visible = false;
        PlatformMgr.subDomain.closeProvocationOther();
    }

    openSurpassOther(_type): void {
        this.surpassOther.visible = true;
        (this.owner as Laya.Scene).visible = true;
        PlatformMgr.subDomain.setOpenView(this.surpassOther);
        PlatformMgr.subDomain.openSurpassOther({
            _type: _type,
            val: -1
        });
    }

    closeSurpassOther(): void {
        this.surpassOther.visible = false;
        PlatformMgr.subDomain.closeSurpassOther();
    }
}