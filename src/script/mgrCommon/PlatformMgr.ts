import ConfigData from "../models/ConfigData";
import WXAPI from "../platform/wx/WXAPI";
import FBAPI from "../platform/fb/FBAPI";
import WXAdMgr from "../platform/wx/WXADMgr";
import WXSubDomain from "../platform/wx/WXSubDomain";

export default class PlatformMgr extends Laya.Script {
    public static ptAPI;
    public static ptAdMgr;
    public static subDomain;

    private constructor() {
        super();
    }

    //工厂生产不同平台的代理
    static initPlatform(){
        switch(ConfigData.releasePlatform){
            case "wx":
                PlatformMgr.ptAPI = new WXAPI();
                PlatformMgr.ptAdMgr = new WXAdMgr;
                PlatformMgr.subDomain = new WXSubDomain();
                break;
            case "fb":
                //new fb的管理类
                // this.ptAPI = new FBAPI();
                // this.ptAdMgr = new FBAdMgr;
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

    //通过代理调用广告相关
    public static callADMethodByProxy(meth:string,arg?:any){
        if(!PlatformMgr.ptAdMgr || !PlatformMgr.ptAdMgr[meth]){
            return
        }
        return PlatformMgr.ptAdMgr[meth](arg);
    }

    //通过代理调用子域相关
    /*
    */
    public static callSubDomainMethodByProxy(meth:string,arg?:any){
        if(!PlatformMgr.subDomain || !PlatformMgr.subDomain[meth]){
            return
        }
        return PlatformMgr.ptAPI[meth](arg);
    }
}