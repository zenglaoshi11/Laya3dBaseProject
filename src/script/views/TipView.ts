import BaseView from "./BaseView";

export default class TipView extends  BaseView {
    private tipLbl:Laya.Label;
    
    onAwake(): void {
        super.onAwake();
        this.tipLbl = this.owner.getChildByName("image").getChildByName("Label") as Laya.Label;
    }
    
    public addEvent() {
        this.owner.on(Laya.Event.CLICK,this,this.closeView)
        super.addEvent();
    }
    
    public removeEvent() {
        this.owner.off(Laya.Event.CLICK, this, this.closeView);
        super.removeEvent();
    }

    openView(str?: any){
        super.openView(str);
        this.tipLbl.text = str;
        Laya.timer.once(2000,this,()=>{
            this.closeView();
        });
    }
}