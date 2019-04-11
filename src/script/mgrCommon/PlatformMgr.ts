import MyPlatform from "../platform/MyPlatform";
import ConfigData from "../models/ConfigData";
import WXAPI from "../platform/wx/WXAPI";
import FBAPI from "../platform/fb/FBAPI";

export default class PlatformMgr extends Laya.Script {
    public static readonly instance: PlatformMgr = new PlatformMgr();
    private _ptInstance:MyPlatform;

    private constructor() {
        super();
        switch(ConfigData.releasePlatform){
            case "wx":
                this._ptInstance = new WXAPI() as MyPlatform;
                break;
            case "fb":
                //new fb的管理类
                this._ptInstance = new FBAPI() as MyPlatform;
                break;
        }
    }
    /*
        success 成功回调
        fail 失败回调
    */
    doLogin(_d){
        this._ptInstance.doLogin(_d);
    }

    public getLaunchData():any{
        return this._ptInstance.getLaunchData();
    }

    public getQuery():any{
        return this._ptInstance.getQuery();
    }

    public getReferrerInfo():any{
        return this._ptInstance.getReferrerInfo();
    }

    public  uploadRankDate(_data) {
        this._ptInstance.uploadRankDate(_data);
    }
}