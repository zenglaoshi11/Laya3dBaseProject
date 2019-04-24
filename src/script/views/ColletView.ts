import BaseView from "./BaseView";
import MyUtils from "../tools/MyUtils";
import EventMgr from "../mgrCommon/EventMgr";

export default class ColletView extends BaseView {
    constructor() { super(); }
    
    onAwake(): void {
        super.onAwake();
        this.addEvent();
    }

    addEvent():void{
        this.okBtn.on(Laya.Event.CLICK,this,this.closeView);
        super.addEvent();
    }

    closeView(){
        super.closeView();
        Laya.loader.clearRes("res/atlas/collet.atlas");
        EventMgr.instance.emit("goHome");
    }
    
    public removeEvent() {
        this.okBtn.off(Laya.Event.CLICK,this,this.closeView);
        super.removeEvent();
    }
}