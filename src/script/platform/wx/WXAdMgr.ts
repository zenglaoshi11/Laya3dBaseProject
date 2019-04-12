import MyUtils from "../../tools/MyUtils";
import ConfigData from "../../models/ConfigData";
import HttpMgr from "../../mgrCommon/HttpMgr";

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

    public videoPlayedTimes: number;


    private preBannerTime_Home: any;
    private preBannerTime_Other: any;
    private preBannerTime_ClassicEnd: any;

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
        this.preBannerTime_Home = Laya.timer.currTimer;
        this.preBannerTime_Other = Laya.timer.currTimer;
        this.preBannerTime_ClassicEnd = Laya.timer.currTimer;
    }

    public initVedioCom() {
        let self = this;
        if (this.isInited) {
            this.rewardedVideoAd = window["wx"].createRewardedVideoAd({ adUnitId: ConfigData.rewardedVideoId });
            if (this.rewardedVideoAd == undefined) {
                return;
            }
            this.rewardedVideoAd.onLoad(() => {
                console.log("rewardedVideo onload");
                self.hasAd = true;
            });
            this.rewardedVideoAd.onError(err => {
                self.hasAd = false;
                HttpMgr.instance.videoErrorCallback();
                if (self.callBackSuc != null) {
                    self.callBackSuc(self.caller);
                }
            });
            this.rewardedVideoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
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


    public showVideo(caller: any, callBackSuc: Function, callBackFail: Function) {
        if (!this.isInited) {
            return;
        }
        let self = this;
        this.caller = caller;
        this.callBackSuc = callBackSuc;
        this.callBackFail = callBackFail;
        if (this.hasAd) {
            this.hasAd = false;
            this.rewardedVideoAd.show();
        }
        else {
            
            this.rewardedVideoAd.load()
                .then(() => {
                    self.rewardedVideoAd.show();
                    self.hasAd = false;
                })
        }
    }

    public showBannerAdHome() {
        if (!Laya.Browser.onMiniGame||!this.isInited) {
            return;
        }
        this.destoryAllBannerAd();
        let screenW = ConfigData.systemInfo.windowWidth;
        let _width = Laya.stage.width / 2 - 140;
        let screenH = ConfigData.systemInfo.windowHeight;
        this.bannerHomeIsHide = false;
        if(Laya.timer.currTimer - this.preBannerTime_Home > 30000){
            if(this.bannerHome){
                this.bannerHome.destroy();
                this.bannerHome = null;
            }
        }
        if (!this.bannerHome) {
            this.destroyBannerAdHome();
            this.bannerHome = window["wx"].createBannerAd({
                adUnitId: ConfigData.bannerVideoId,
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
            this.preBannerTime_Home = Laya.timer.currTimer;
        }
        if (this.bannerHome != undefined) {
            this.bannerHome.show();
        }
    }

    public showBannerAdOther() {
        if (!Laya.Browser.onMiniGame||!this.isInited) {
            return;
        }
        this.destoryAllBannerAd();
        let screenW = ConfigData.systemInfo.windowWidth;
        let _width = screenW;
        let screenH = ConfigData.systemInfo.windowHeight;
        this.bannerOtherIsHide = false;
        if(Laya.timer.currTimer - this.preBannerTime_Other > 30000){
            if(this.bannerOther){
                this.bannerOther.destroy();
                this.bannerOther = null;
            }
        }   
        if (!this.bannerOther) {
            this.destroyBannerAdOther();
            this.bannerOther = window["wx"].createBannerAd({
                adUnitId: ConfigData.bannerVideoId,
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
            this.preBannerTime_Other = Laya.timer.currTimer;
        }
        if (this.bannerOther != undefined) {
            this.bannerOther.show();
        }
        
    }

    public showBannerAdClassicEnd() {
        if (!Laya.Browser.onMiniGame||!this.isInited) {
            return;
        }
        this.destoryAllBannerAd();
        let screenW = ConfigData.systemInfo.windowWidth;
        let _width = screenW;
        let screenH = ConfigData.systemInfo.windowHeight;
        this.bannerClassicEndIsHide = false;
        if(Laya.timer.currTimer - this.preBannerTime_Other > 30000){
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
            this.preBannerTime_Other = Laya.timer.currTimer;
        }
        if (this.bannerClassicEnd != undefined) {
            this.bannerClassicEnd.show();
        }
    }

    public destroyBannerAdHome() {
        this.bannerHomeIsHide = true;
        if (this.bannerHome) {
            this.preBannerTime_Home = 0;
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
            this.preBannerTime_Other = 0;
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
            this.preBannerTime_ClassicEnd = 0;
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