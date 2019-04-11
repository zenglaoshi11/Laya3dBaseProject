import ConfigData from "../models/ConfigData";
import WXAPI from "../platform/wx/WXAPI";
import FBAPI from "../platform/fb/FBAPI";
import WXAdMgr from "../platform/wx/WXADMgr";

export default class PlatformMgr extends Laya.Script {
    public static readonly instance: PlatformMgr = new PlatformMgr();
    public static ptAPI;
    public static ptAdMgr;


    private constructor() {
        super();
    }

    static initPlatform(){
        switch(ConfigData.releasePlatform){
            case "wx":
                PlatformMgr.ptAPI = new WXAPI();
                PlatformMgr.ptAdMgr = new WXAdMgr;
                break;
            case "fb":
                //new fb的管理类
                // this.ptAPI = new FBAPI();
                // this.ptAdMgr = new FBAdMgr;
                break;
        }
    }
}