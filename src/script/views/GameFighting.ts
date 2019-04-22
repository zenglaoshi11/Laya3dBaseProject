import PlatformMgr from "../mgrCommon/PlatformMgr";
import WXSubDomain from "../platform/wx/WXSubDomain";
import BaseView from "./BaseView";

export default class GameFighting extends BaseView {
    private surpassOther;
    private provocationOther;
    
    onAwake(){
        super.onAwake();
        this.surpassOther = this.owner.getChildByName("surpassOther");
        this.provocationOther = this.owner.getChildByName("provocationOther");
        this.provocationOther.visible = false;
        this.surpassOther.visible = false;
        Laya.stage.addChildAt(this.owner,1)
    }

    
    openProvocationOther(_type): void {
        this.provocationOther.visible = true;
        (this.owner as Laya.Scene).visible = true;
        PlatformMgr.subDomain.setOpenView(this.provocationOther);
        PlatformMgr.subDomain.openProvocationOther(_type);
    }

    closeProvocationOther():void{
        this.provocationOther.visible = false;
        PlatformMgr.subDomain.closeProvocationOther();
    }
   
    openSurpassOther(_type): void {
        this.surpassOther.visible = true;
        (this.owner as Laya.Scene).visible = true;
        PlatformMgr.subDomain.setOpenView(this.surpassOther);
        PlatformMgr.subDomain.openSurpassOther({
            _type:_type,
            val:-1});
    }
        
    closeSurpassOther():void{
        this.surpassOther.visible = false;
        PlatformMgr.subDomain.closeSurpassOther();
    }

    onDisable(): void {
    }
}