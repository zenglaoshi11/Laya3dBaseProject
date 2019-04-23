import BaseView from "./BaseView";
import MyUtils from "../tools/MyUtils";
import EventMgr from "../mgrCommon/EventMgr";

export default class ColletView extends BaseView {
    private topHand:Laya.Image;
    
    constructor() { super(); }
    
    onAwake(): void {
        super.onAwake();
        this.topHand = this.owner.getChildByName("topHand") as Laya.Image;
        MyUtils.autoScreenSize([this.topHand]);
        this.addEvent();
    }

    addEvent():void{
        (this.owner.getChildByName("btn_ok") as Laya.Image).on(Laya.Event.CLICK,this,()=>{
            EventMgr.instance.emit("goHome");
        })
    }
}