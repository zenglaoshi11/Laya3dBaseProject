import MyUtils from "../../tools/MyUtils";
import ConfigData from "../../models/ConfigData";
import HttpMgr from "../../mgrCommon/HttpMgr";
import StatisticsMgr from "../../mgrCommon/StatisticsMgr";

export default class WXAdMgr{
    private bannerHome: any;
    private bannerOther: any;
    private bannerClassicEnd: any;

    private bannerHomeIsHide:boolean = true;
    private bannerOtherIsHide:boolean = true;
    private bannerClassicEndIsHide:boolean = true;


    private isInited = false;
    private rewardedVideoAd: any;
    private hasAd: boolean = false;

    private caller: any;
    private callBackSuc: Function;
    private callBackFail: Function;
    private callBackErro:Function;

    public videoPlayedTimes: number;


    private preBannerTimeHome: any;
    private preBannerTimeOther: any;
    private preBannerTimeClassicEnd: any;

    private _type:number;//看视屏，目标类型 SHARE_VIDEO_TYPE 0普通, 1复活, 2获取道具

    /**
     *
     */
    constructor(){
        this.init();
    }

    public init() {
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        if (ConfigData.systemInfo.SDKVersion && MyUtils.compareVersion(ConfigData.systemInfo.SDKVersion, "2.0.4") >= 0) {
            this.isInited = true;
            this.initVedioCom();
        }
        this.preBannerTimeHome = Laya.timer.currTimer;
        this.preBannerTimeOther = Laya.timer.currTimer;
        this.preBannerTimeClassicEnd = Laya.timer.currTimer;
    }

    public initVedioCom() {
        let self = this;
        if (this.isInited) {
            this.rewardedVideoAd = window["wx"].createRewardedVideoAd({ 
                adUnitId: ConfigData.rewardedAdIds[MyUtils.random(0,ConfigData.rewardedAdIds.length - 1)]
            });
            if (this.rewardedVideoAd == undefined) {
                return;
            }
            this.rewardedVideoAd.onLoad(() => {
                self.hasAd = true;
            });
            this.rewardedVideoAd.onError(err => {
                self.hasAd = false;
                HttpMgr.instance.videoCallback();
                if(this.callBackErro){
                    this.callBackErro();
                    return;
                }
                if (self.callBackSuc != null) {
                    self.callBackSuc(self.caller);
                }
            });
            this.rewardedVideoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    StatisticsMgr.instance.videoPlayOverAdStatistics(this._type);
                    // 正常播放结束，可以下发游戏奖励
                    self.videoPlayedTimes += 1;
                    if (self.callBackSuc != null) {
                        self.callBackSuc(self.caller);
                    }
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    if (self.callBackFail != null) {
                        self.callBackFail(self.caller);
                    }
                }
            });
        }
    }


    public showVideo(_d:any) {
        if (!this.isInited) {
            return;
        }
        let self = this;
        this._type = _d._type || 0;
        this.caller = _d.caller;
        this.callBackSuc = _d.callBackSuc;
        this.callBackFail = _d.callBackFail;
        this.callBackErro = _d.callBackErro;
        StatisticsMgr.instance.clickVideoStatistics(this._type)
        if (this.hasAd) {
            this.hasAd = false;
            this.rewardedVideoAd.show();
        }else {
            this.rewardedVideoAd.load()
                .then(() => {
                    self.rewardedVideoAd.show();
                    self.hasAd = false;
                })
        }
    }

    public loadBannerAdHome() {
        if (!Laya.Browser.onMiniGame||!this.isInited) {
            return;
        }
        this.showBannerAdHome(true)
    }

    public showBannerAdHome(onlyLoad?:boolean) {
        if (!Laya.Browser.onMiniGame||!this.isInited) {
            return;
        }
        this.destoryAllBannerAd();
        let screenW = ConfigData.systemInfo.windowWidth;
        let _width = Laya.stage.width / 2 - 140;
        let screenH = ConfigData.systemInfo.windowHeight;
        this.bannerHomeIsHide = false;
        if(Laya.timer.currTimer - this.preBannerTimeHome > 30000){
            if(this.bannerHome){
                this.bannerHome.destroy();
                this.bannerHome = null;
            }
        }
        if (!this.bannerHome) {
            this.destroyBannerAdHome();
            this.bannerHome = window["wx"].createBannerAd({
                adUnitId: ConfigData.bannerAdIds[MyUtils.random(0,ConfigData.bannerAdIds.length - 1)],
                style: {
                    left: 0,
                    top: screenH - 100,
                    width: _width,
                }
            });
            this.bannerHome.onResize(r => {
                this.bannerHome.style.left = (screenW - this.bannerHome.style.realWidth) / 2;
                this.bannerHome.style.top = screenH - this.bannerHome.style.realHeight;
                if (screenH / screenW > 2) {
                    this.bannerHome.style.top = this.bannerHome.style.top - 10;
                }
            })
            this.bannerHome.onError((res) => {
                console.log("广告加载错误:", res);
            })

            // this.bannerHome.onLoad(()=>{
            //     if(this.bannerHomeIsHide){
            //         this.bannerHome.destroy();
            //         return;
            //     }
            //     this.bannerHome.show();
            // })
            this.preBannerTimeHome = Laya.timer.currTimer;
        }
        if(onlyLoad){
            return;
        }
        if (this.bannerHome != undefined) {
            this.bannerHome.show();
        }
    }

    public showBannerAdOtherFast() {
        if (!this.bannerOther) {
            this.showBannerAdOther();
        }else{
            this.bannerOther.show();
        }
    }

    public showBannerAdOther(onlyLoad?:boolean) {
        if (!Laya.Browser.onMiniGame||!this.isInited) {
            return;
        }
        this.destoryAllBannerAd();
        let screenW = ConfigData.systemInfo.windowWidth;
        let _width = screenW;
        let screenH = ConfigData.systemInfo.windowHeight;
        this.bannerOtherIsHide = false;
        if(Laya.timer.currTimer - this.preBannerTimeOther > 30000){
            if(this.bannerOther){
                this.bannerOther.destroy();
                this.bannerOther = null;
            }
        }   
        if (!this.bannerOther) {
            this.destroyBannerAdOther();
            this.bannerOther = window["wx"].createBannerAd({
                adUnitId: ConfigData.bannerAdIds[MyUtils.random(0,ConfigData.bannerAdIds.length - 1)],
                style: {
                    left: 0,
                    top: screenH - 100,
                    width: _width,
                }
            });

            this.bannerOther.onResize(r => {
                this.bannerOther.style.left = (screenW - this.bannerOther.style.realWidth) / 2;
                this.bannerOther.style.top = screenH - this.bannerOther.style.realHeight - 10;
                if (screenH / screenW > 2) {
                    this.bannerOther.style.top = this.bannerOther.style.top - 25;
                }
            })

            this.bannerOther.onError((res) => {
                console.log("广告加载错误:", res);
            })
            this.preBannerTimeOther = Laya.timer.currTimer;
        }
        if(onlyLoad){
            return;
        }
        if (this.bannerOther != undefined) {
            this.bannerOther.show();
        }
    }

    public showBannerAdClassicEndFast() {
        if (!this.bannerClassicEnd) {
            this.showBannerAdClassicEnd();
        }else{
            this.bannerClassicEnd.show();
        }
    }

    public showBannerAdClassicEnd(onlyLoad?:boolean) {
        if (!Laya.Browser.onMiniGame||!this.isInited) {
            return;
        }
        this.destoryAllBannerAd();
        let screenW = ConfigData.systemInfo.windowWidth;
        let _width = screenW;
        let screenH = ConfigData.systemInfo.windowHeight;
        this.bannerClassicEndIsHide = false;
        if(Laya.timer.currTimer - this.preBannerTimeOther > 30000){
            if(this.bannerClassicEnd){
                this.bannerClassicEnd.destroy();
                this.bannerClassicEnd = null;
            }
        }
        if (!this.bannerClassicEnd) {
            this.destroyBannerAdClassicEnd();
            this.bannerClassicEnd = window["wx"].createBannerAd({
                adUnitId: 'adunit-dcacf7fd6e654b4d',
                style: {
                    left: 0,
                    top: screenH - 100,
                    width: _width,
                }
            });
            this.bannerClassicEnd.onError((res) => {
                console.log("广告加载错误:", res);
            })

            this.bannerClassicEnd.onResize(r => {
                this.bannerClassicEnd.style.left = (screenW - this.bannerClassicEnd.style.realWidth) / 2;
                this.bannerClassicEnd.style.top = screenH - this.bannerClassicEnd.style.realHeight - 10;
                if (screenH / screenW > 2) {
                    this.bannerClassicEnd.style.top = this.bannerClassicEnd.style.top - 25;
                }
            })
            this.preBannerTimeOther = Laya.timer.currTimer;
        }
        if(onlyLoad){
            return;
        }
        if (this.bannerClassicEnd != undefined) {
            this.bannerClassicEnd.show();
        }
    }

    public destroyBannerAdHome() {
        this.bannerHomeIsHide = true;
        if (this.bannerHome) {
            this.preBannerTimeHome = 0;
            if(ConfigData.ctrlInfo.is_banner == 1){
                this.bannerHome.destroy();
                this.bannerHome = null;
            }else{
                this.bannerHome.hide();
            }
        }
    }

    public destroyBannerAdOther() {
        this.bannerOtherIsHide = true;
        if (this.bannerOther) {
            this.preBannerTimeOther = 0;
            if(ConfigData.ctrlInfo.is_banner == 1){
                this.bannerOther.destroy();
                this.bannerOther = null;
            }else{
                this.bannerOther.hide();
            }
        }
    }


    public destroyBannerAdClassicEnd() {
        this.bannerClassicEndIsHide = true;
        if (this.bannerClassicEnd) {
            this.preBannerTimeClassicEnd = 0;
            if(ConfigData.ctrlInfo.is_banner == 1){
                this.bannerClassicEnd.destroy();
                this.bannerClassicEnd = null;
            }else{
                this.bannerClassicEnd.hide();
            }
        }
    }

    public destoryAllBannerAd() {
        this.destroyBannerAdHome();
        this.destroyBannerAdOther();
        this.destroyBannerAdClassicEnd();
    }



}