import PlatformMgr from "../mgrCommon/PlatformMgr";
import WXSubDomain from "../platform/wx/WXSubDomain";
import BaseView from "./BaseView";
import ConfigData, { OPERATINGTYPE, SORTTYPE } from "../models/ConfigData";
import CurrGameData from "../models/CurrGameData";
import GameMgr from "../mgr3d/GameMgr";
import EventMgr from "../mgrCommon/EventMgr";

export default class GameFighting extends BaseView {
    private surpassOther: Laya.WXOpenDataViewer;
    private provocationOther: Laya.WXOpenDataViewer;
    private finger: Laya.Image;
    private dragBeginnerGuide: Laya.Image;
    private touchBeginnerGuide: Laya.Image;
    private fingerStartTime: number;
    private score: Laya.FontClip;
    private progressNode: Laya.Image; //进度条的父节点
    private progress: Laya.Image; //进度条
    private currLevelLab: Laya.Label;
    private nextLevelLab: Laya.Label;
    private surpassOtherText:Laya.Label; //超越
    private mouseTouch: Laya.Image;


    //测试按钮
    private btnResurgence: Laya.Label;
    private gameOverScore: Laya.Label;
    private gameOverLevel: Laya.Label;
    private btnBeyond: Laya.Label;
    private btnFight: Laya.Label;
    private btnAddScore:Laya.Label;
    private btnAddProgress:Laya.Label;

    onAwake() {
        super.onAwake();

        this.dragBeginnerGuide = this.owner.getChildByName("dragBeginnerGuide") as Laya.Image;
        this.touchBeginnerGuide = this.owner.getChildByName("touchBeginnerGuide") as Laya.Image;
        this.mouseTouch = this.owner.getChildByName("mouseTouch") as Laya.Image;
        this.finger = this.dragBeginnerGuide.getChildByName("finger") as Laya.Image;

        this.score = this.owner.getChildByName("scoreNum") as Laya.FontClip;
        this.progressNode = this.owner.getChildByName("progress") as Laya.Image;
        this.progress = this.progressNode.getChildByName("progress") as Laya.Image;

        this.nextLevelLab = this.progressNode.getChildByName("nextLevelLab") as Laya.Label;
        this.currLevelLab = this.progressNode.getChildByName("currLevelLab") as Laya.Label;

        this.surpassOtherText = this.owner.getChildByName("surpassOtherText") as Laya.Label;

        this.surpassOtherText.visible = false;

        this.score.visible = false;
        this.progressNode.visible = false;

        this.dragBeginnerGuide.visible = false;
        this.touchBeginnerGuide.visible = false;

        //测试
        this.btnResurgence = this.owner.getChildByName("Test").getChildByName("resurgence") as Laya.Label;
        this.gameOverScore = this.owner.getChildByName("Test").getChildByName("gameOverScore") as Laya.Label;
        this.gameOverLevel = this.owner.getChildByName("Test").getChildByName("gameOverLevel") as Laya.Label;
        this.btnBeyond = this.owner.getChildByName("Test").getChildByName("beyond") as Laya.Label;
        this.btnFight = this.owner.getChildByName("Test").getChildByName("fight") as Laya.Label;
        this.btnAddProgress = this.owner.getChildByName("Test").getChildByName("addProgress") as Laya.Label;
        this.btnAddScore = this.owner.getChildByName("Test").getChildByName("addScore") as Laya.Label;
    }

    private FigerAnim(): void {
        this.finger.x = 90 + 500 * Math.abs((Laya.timer.currTimer - this.fingerStartTime + 500) % 2000 - 1000) / 1000;
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
        // console.log("getGameData:",GameMgr.instance.getGameData());
        // let isEndLess = GameMgr.instance.getGameData().sortType == SORTTYPE.ENDLESS;
        let isEndLess = true;
        this.score.visible = isEndLess;
        this.progressNode.visible = !isEndLess;
    }

    mouseTouchFun() {
        this.dragBeginnerGuide.visible = false;
    }

    openResurgence() {
        EventMgr.instance.emit("openResurgence");
    }

    openGameOverLevel() {
        EventMgr.instance.emit("openGameOverLevel");
    }

    openGameOverScore() {
        EventMgr.instance.emit("openGameOverScore");
    }

    public addEvent() {
        super.addEvent();
        this.mouseTouch.on(Laya.Event.CLICK, this, this.mouseTouchFun);
        this.btnResurgence.on(Laya.Event.CLICK, this, this.openResurgence);
        this.gameOverScore.on(Laya.Event.CLICK, this, this.openGameOverScore);
        this.gameOverLevel.on(Laya.Event.CLICK, this, this.openGameOverLevel);
        this.btnBeyond.on(Laya.Event.CLICK, this, this.openSurpassOther);
        this.btnFight.on(Laya.Event.CLICK, this, this.openProvocationOther);

        this.btnAddProgress.on(Laya.Event.CLICK,this,this.addProgress);
        this.btnAddScore.on(Laya.Event.CLICK,this,this.addScore);

        EventMgr.instance.onEvent("updateScore", this, this.updataScore);
        EventMgr.instance.onEvent("updataProgress", this, this.updataProgress);
        EventMgr.instance.onEvent("updateLevel", this, this.updateLevel);
    }

    public removeEvent() {
        super.removeEvent();
        this.mouseTouch.off(Laya.Event.CLICK, this, this.mouseTouchFun);
        this.btnResurgence.off(Laya.Event.CLICK, this, this.openResurgence);
        this.gameOverScore.off(Laya.Event.CLICK, this, this.openGameOverScore);
        this.gameOverLevel.off(Laya.Event.CLICK, this, this.openGameOverLevel);
        this.btnBeyond.off(Laya.Event.CLICK, this, this.openSurpassOther);
        this.btnFight.off(Laya.Event.CLICK, this, this.openProvocationOther);

        this.btnAddScore.off(Laya.Event.CLICK, this, this.addScore);
        this.btnAddProgress.off(Laya.Event.CLICK, this, this.addProgress);

        EventMgr.instance.onOffEvent("updateScore", this, this.updataScore);
        EventMgr.instance.onOffEvent("updataProgress", this, this.updataProgress);
        EventMgr.instance.onOffEvent("updateLevel", this, this.updateLevel);
    }

    private testScore = 0;
    addScore(){
        this.testScore++;
        EventMgr.instance.emit("updateScore");
        this.score.visible = true;
        this.progressNode.visible = false;
    }

    private progressNum = 0;
    addProgress(){
        this.progressNum += 0.1;
        EventMgr.instance.emit("updataProgress",this.progressNum);
        this.score.visible = false;
        this.progressNode.visible = true;
    }


    updataScore() {
        // this.score.value = GameMgr.instance.getGameData().score.toString();
        this.score.value = this.testScore.toString();
    }

    updataProgress(num: number) {
        num = num > 1 ? 1 : num;
        this.progress.width = num * 361;
    }

    updateLevel(num: number) {
        this.currLevelLab.text = num.toString();
        this.nextLevelLab.text = (num + 1).toString();
    }

    //打开挑衅
    // openProvocationOther(_type): void {  //正式使用
    openProvocationOther(event,_type): void { //仅供测试
        this.closeSurpassOther();
        if (!this.provocationOther) {
            this.provocationOther = new Laya.WXOpenDataViewer();
            this.owner.addChild(this.provocationOther);
            this.provocationOther.width = 750;
            this.provocationOther.height = 62;
            this.provocationOther.pos(0, 252);
        }
        PlatformMgr.subDomain.setOpenView(this.provocationOther);
        PlatformMgr.subDomain.openProvocationOther({_type:_type});
    }

    closeProvocationOther(): void {
        if (this.provocationOther) {
            this.provocationOther.destroy();
            this.provocationOther = null;
        }
        if (PlatformMgr.subDomain) {
            PlatformMgr.subDomain.closeProvocationOther();
        }
    }

    //打开超越
    openSurpassOther(_type): void {
        _type = SORTTYPE.ENDLESS
        this.closeProvocationOther();
        if (!this.surpassOther) {
            this.surpassOther = new Laya.WXOpenDataViewer();
            this.owner.addChild(this.surpassOther);
            this.surpassOther.width = 60;
            this.surpassOther.height = 60;
            this.surpassOther.pos(570, 304);
        }
        this.surpassOtherText.visible = true;
        PlatformMgr.subDomain.setOpenView(this.surpassOther);
        PlatformMgr.subDomain.openSurpassOther({
            _type: _type,
            val: -1
        });
    }

    closeSurpassOther(): void {
        this.surpassOtherText.visible = false;
        if (this.surpassOther) {
            this.surpassOther.destroy();
            this.surpassOther = null;
        }
        if (PlatformMgr.subDomain) {
            PlatformMgr.subDomain.closeSurpassOther();
        }
    }

    onDisable(): void {
        this.closeProvocationOther();
        this.closeSurpassOther();
        super.onDisable();
    }
}