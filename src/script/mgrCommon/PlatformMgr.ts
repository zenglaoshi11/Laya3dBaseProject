import ConfigData from "../models/ConfigData";
import WXAPI from "../platform/wx/WXAPI";
import FBAPI from "../platform/fb/FBAPI";
import WXSubDomain from "../platform/wx/WXSubDomain";
import AndroidAPI from "../platform/android/AndroidAPI";

export default class PlatformMgr extends Laya.Script {
    public static ptAPI;
    public static subDomain;

    private constructor() {
        super();
    }

    //工厂生产不同平台的代理
    static initPlatform(){
        switch(ConfigData.releasePlatform){
            case "wx":
                PlatformMgr.ptAPI = new WXAPI();
                PlatformMgr.subDomain = new WXSubDomain();
                break;
            case "fb":
                //new fb的管理类
                break;
            case "android":
                PlatformMgr.ptAPI = new AndroidAPI();
                window["Android2JS"] = PlatformMgr.ptAPI;
                PlatformMgr.subDomain = null;
            break;
        }
    }

    //通过代理调用api
    public static callAPIMethodByProxy(meth:string,arg?:any){
        if(!PlatformMgr.ptAPI || !PlatformMgr.ptAPI[meth]){
            return
        }
        return PlatformMgr.ptAPI[meth](arg);
    }


    //通过代理调用子域相关
    /*
    */
    public static callSubDomainMethodByProxy(meth:string,arg?:any){
        if(!PlatformMgr.subDomain || !PlatformMgr.subDomain[meth]){
            return
        }
        return PlatformMgr.subDomain[meth](arg);
    }
}