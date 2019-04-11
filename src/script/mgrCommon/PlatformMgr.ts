import CONFIG from "../models/CONFIG";
import MyPlatform from "../platform/MyPlatform";
import WX from "../platform/wx/WX";
import FB from "../platform/fb/FB";

export default class PlatformMgr extends Laya.Script {
    public static readonly instance: PlatformMgr = new PlatformMgr();
    private _ptInstance:MyPlatform;

    private constructor() {
        super();
        switch(CONFIG.releasePlatform){
            case "wx":
                this._ptInstance = new WX() as MyPlatform;
                break;
            case "fb":
                //new fb的管理类
                this._ptInstance = new FB() as MyPlatform;
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