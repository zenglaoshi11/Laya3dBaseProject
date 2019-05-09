import StatisticsMgr from "../../mgrCommon/StatisticsMgr";

export default class AndroidAdMgr{
    private static isLookAdc:boolean = false;
    private static myCaller: any;
    private static callBackSuc: Function;
    private static callBackFail: Function;
    private static callBackErro:Function;

    private static _type:number;//看视屏，目标类型 SHARE_VIDEO_TYPE 0普通, 1复活, 2获取道具
        /**
        * 请求弹起banner广告
        */
    public showVideo(_d:any) {
        if(AndroidAdMgr.isLookAdc || !Laya.Browser.onAndroid){
            return;
        }
        AndroidAdMgr.isLookAdc = true;
        AndroidAdMgr._type = _d._type || 0;
        AndroidAdMgr.myCaller = _d.caller;
        AndroidAdMgr.callBackSuc = _d.callBackSuc;
        AndroidAdMgr.callBackFail = _d.callBackFail;
        AndroidAdMgr.callBackErro = _d.callBackErro;
        StatisticsMgr.instance.clickVideoStatistics(AndroidAdMgr._type);
        window["Android"].getVedioAd("getVedioAd");
    }

    private static cleanVideoCall(){
        AndroidAdMgr.myCaller = null;
        AndroidAdMgr.callBackSuc = null;
        AndroidAdMgr.callBackFail = null;
        AndroidAdMgr.callBackErro = null;
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
        AndroidAdMgr.requesAdBannerShow();
    }
    
    public showBannerAdOther(onlyLoad?:boolean) {
        AndroidAdMgr.requesAdBannerShow();
    }

    public showBannerAdClassicEndFast() {
        AndroidAdMgr.requesAdBannerShow();
    }

    public showBannerAdClassicEnd(onlyLoad?:boolean) {
        AndroidAdMgr.requesAdBannerShow();
    }

    public destroyBannerAdHome() {
        AndroidAdMgr.destoryAllBannerAd();
    }

    public destroyBannerAdOther() {
        AndroidAdMgr.destoryAllBannerAd();
    }

    public destroyBannerAdClassicEnd() {
        AndroidAdMgr.destoryAllBannerAd();
    }
    
    public loadBannerAdHome() {
    }

    public showBannerAdHome(onlyLoad?:boolean) {
        AndroidAdMgr.requesAdBannerShow();
    }
}