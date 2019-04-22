import BaseView from "./BaseView";
import PlatformMgr from "../mgrCommon/PlatformMgr";
import { SORTTYPE } from "../models/ConfigData";

export default class GameOverEndless extends BaseView {
    private wxOpenData;
    
    constructor() { super(); }
    
    onAwake(){
        super.onAwake();
        this.wxOpenData = this.owner.getChildByName("wxOpenData");
    }
    
    openView(data?: any){
        super.openView(data);
        this.wxOpenData.visible = true;
        PlatformMgr.subDomain.setOpenView(this.wxOpenData);
        PlatformMgr.subDomain.openGameOver(SORTTYPE.ENDLESS);
    }
}