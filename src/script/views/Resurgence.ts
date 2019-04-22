import PlatformMgr from "../mgrCommon/PlatformMgr";
import { SORTTYPE } from "../models/ConfigData";
import BaseView from "./BaseView";

export default class Resurgence extends BaseView {
    private goingSurpassOther;
    constructor() { super(); }
    
    onAwake(): void {
        super.onAwake();
        this.goingSurpassOther = this.owner.getChildByName("goingSurpassOther");
        this.goingSurpassOther.visible = false;
    }
    
    public openView(data?: any): void {
        super.openView(data);
        this.openGoingSurpassOther(SORTTYPE.ENDLESS);
    }
     
    openGoingSurpassOther(_type): void {
        (this.owner as Laya.Scene).visible = true;
        this.goingSurpassOther.visible = true;
        PlatformMgr.subDomain.setOpenView(this.goingSurpassOther);
        PlatformMgr.subDomain.openGoingSurpassOther(_type);
    }

    closeGoingSurpassOther():void{
        PlatformMgr.subDomain.closeGoingSurpassOther();
    }


    onDisable(): void {
    }
}