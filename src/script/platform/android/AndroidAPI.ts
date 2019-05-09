import UserData from "../../models/UserData";
import StatisticsMgr from "../../mgrCommon/StatisticsMgr";
import ConfigData from "../../models/ConfigData";

export default class AndroidAPI {
    private static _type:number;//看视屏，目标类型 SHARE_VIDEO_TYPE 0普通, 1复活, 2获取道具
    private static isLookAdc:boolean = false;
    private static callBackSuc: Function;
    private static callBackFail: Function;
    private static callBackErro:Function;
    private static shareBackArgs = {};
    private static myCaller = null;
    private static shareBack;

    /**
    * 请求用户TOKEN
    */
    public static doLogin(){
        if(!Laya.Browser.onAndroid){
            return;
        }
        window["Android"].requestUserToken();
    }

    /**
    * 请求用户TOKEN返回数据 string类型
    */            
   public static requestUserTokenBack(uToken:string){
        if(uToken == "nologin"){
            //可以偿试重试，不重试一样游戏可以玩，只是数据没办法提交也属于正常流程
        }else{
            // UserData.sessionId = uToken;
        }
        
    }

     /**
    * 请求获取用户复活后获得红包的分数值
    */
   public static requestRebornGiftScore(){
        if(!Laya.Browser.onAndroid){
            return;
        }
        window["Android"].requestRebornGiftScore();
    }

    /**
    * 红包分数值返回 
    */
    public static requestRebornGiftScoreBack(data:any){
        // var backJson:any = JSON.parse(data);
    }

    /**
     * 请求给与用户红包奖励 返回给安卓端类型 1表示无尽模式下 2表示关卡模式下
     */
    public static requestRewardToUser(){
        if(!Laya.Browser.onAndroid){
            return;
        }
        window["Android"].requestRewardToUser(1);
    }

    private createShareInfo(_d){
        var query = "";
        if (_d) {
            if (_d.id) {
                query += "&scene=" + _d.id;
            }
            if (_d.itemId) {
                query += "&itemId=" + _d.itemId;
            }
            if (_d.type) {
                query += "&type=" + _d.type;
            }
        }
    }

    private onGoShare(res) {
        AndroidAPI.caller = res.caller;
        AndroidAPI.shareBack = res.callback;
        AndroidAPI.shareBackArgs = res.args || {};
    }

    public shareAppMessage(_d){
        if (_d.callback) {
            this.onGoShare(_d);
        }
        StatisticsMgr.instance.shareStatistics(_d.type);
        let shareInfo = this.createShareInfo(_d);
        
        window["Android"].share(shareInfo);
    }


    public static requestshareBack(res){
        //分享回调
        var _d: any = this.shareBackArgs || {};
        if (res == "1") {
            _d.success = true;
            if (this.shareBack && this.caller) {
                this.shareBack.call(this.caller, _d);
            }
            this.shareBack = null;
        } else {
            _d.success = false;
            if (this.shareBack && this.caller) {
                this.shareBack.call(this.caller, _d);
            }
            this.shareBack = null;
        }
    }

    /*
    * 请求手机长震动
    */
    public static vibrateLong():void{
         // console.log("Js2Android vibrateLong");
         if(!Laya.Browser.onAndroid || ConfigData.isVirbort){
            return;
        }
         window["Android"].vibrateLong();
    }


        /**
    * 请求手机短震动
    */
    public static vibrateShort():void{
          if(!Laya.Browser.onAndroid || ConfigData.isVirbort){
            return;
        }
         window["Android"].vibrateShort();
    }

    public static closeGame(){
        if(!Laya.Browser.onAndroid){
            return;
        }
        window["Android"].back();
    }

        /**
        * 请求弹起banner广告
        */
    public showVideo(_d:any) {
        if(AndroidAPI.isLookAdc || !Laya.Browser.onAndroid){
            return;
        }
        AndroidAPI.isLookAdc = true;
        AndroidAPI._type = _d._type || 0;
        AndroidAPI.myCaller = _d.caller;
        AndroidAPI.callBackSuc = _d.callBackSuc;
        AndroidAPI.callBackFail = _d.callBackFail;
        AndroidAPI.callBackErro = _d.callBackErro;
        StatisticsMgr.instance.clickVideoStatistics(AndroidAPI._type);
        window["Android"].getVedioAd("getVedioAd");
    }

    private static cleanVideoCall(){
        AndroidAPI.myCaller = null;
        AndroidAPI.callBackSuc = null;
        AndroidAPI.callBackFail = null;
        AndroidAPI.callBackErro = null;
    }

    /**
    * 视频广告请求结果返回
    */
	public static requestVoideAdBack(result:string){
        var resultInt = Number(result);
        switch(resultInt){
            case -1:
                if (this.callBackErro) {
                    this.callBackErro();
                }
            break;
            case 0 :
                if (this.callBackFail) {
                    this.callBackFail();
                }
            break;
            case 1:
                StatisticsMgr.instance.videoPlayOverAdStatistics(this._type);
                if (this.callBackSuc) {
                    this.callBackSuc();
                }
            break;
            default:
            break;
        }
        this.cleanVideoCall()
    }
    

    /**
    * 请求关闭banner广告
    */
    public static destoryAllBannerAd(){
        if(!Laya.Browser.onAndroid){
            return;
        }
        window["Android"].requesAdBannerClose();
    }

    /**
    * 请求弹起banner广告
    */
   public static requesAdBannerShow(){
        if(!Laya.Browser.onAndroid){
            return;
        }
        window["Android"].requesAdBannerShow();
    }

    public showBannerAdOtherFast() {
        AndroidAPI.requesAdBannerShow();
    }
    
    public showBannerAdOther(onlyLoad?:boolean) {
        AndroidAPI.requesAdBannerShow();
    }

    public showBannerAdClassicEndFast() {
        AndroidAPI.requesAdBannerShow();
    }

    public showBannerAdClassicEnd(onlyLoad?:boolean) {
        AndroidAPI.requesAdBannerShow();
    }

    public destroyBannerAdHome() {
        AndroidAPI.destoryAllBannerAd();
    }

    public destroyBannerAdOther() {
        AndroidAPI.destoryAllBannerAd();
    }

    public destroyBannerAdClassicEnd() {
        AndroidAPI.destoryAllBannerAd();
    }
    
    public loadBannerAdHome() {
    }

    public showBannerAdHome(onlyLoad?:boolean) {
        AndroidAPI.requesAdBannerShow();
    }
}