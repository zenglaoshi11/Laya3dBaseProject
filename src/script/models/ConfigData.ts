import MyUtils from "../tools/MyUtils";
import StorageMgr from "../mgrCommon/StorageMgr";

export enum MAINBTNSTYPE {
    LANDSCAPE = 0,
    VERTICAL
}

export enum SORTTYPE {
    LEVEL = 0,  //关卡模式
    ENDLESS     //无尽模式
}

export enum OPERATINGTYPE{ //游戏操作方式
    DRAGE = 0, //左右拖拽
    TOUCH      //点击屏幕
}

export default class ConfigData {
    public static mainBtnsType:number = 1;  //主页按钮排列方式使用哪种
    public static beginnerGuide:number = 0; //新手引导类型
    public static mainAdMy:boolean;         //是否开启自己做的主页的广告条

    public static releasePlatform = "";//发布平台 wx fb
    public static myAppid = "wxbe9fe00281505169";
    public static configs: any = null;
    public static language:string = "cn";
    public static languageData: any = null;

    public static version = "100";
    public static jsonVersion = "100";
    public static serverUrl: string = "https://xcx.biaocr.com/funny_frog/";
    public static jsonVersionUrl: string = "https://p.doguane.cn/20190404/m_04171926352321.json";
    public static statisticsUrl:string = "https://log.zuancr.com/"

    public static isCreateAuthorization:boolean = false; //是否创建了授权按钮
    public static repeatAuthorization:boolean = false; //是否创建了授权按钮
    public static isLog: boolean = true; //是否开启日志
    public static isSound: boolean;
    public static isVirbort: boolean;
    public static ctrlInfo: any = {};//游戏控制信息
    public static systemInfo: any = {};//设备系统信息

    public static bannerVideoId:string = "adunit-7c4449f9f6fcafbb";
    public static rewardedVideoId:string = "adunit-df0311118e2452c6";


    public static initLocal(){
        ConfigData.isSound = StorageMgr.getLocalSound();
        ConfigData.isVirbort = StorageMgr.getLocalVirbort();
        if (Laya.Browser.onMiniGame) {
            this.releasePlatform = "wx";
            this.systemInfo = wx.getSystemInfoSync();
        }
    }

    public static initConfigData(_d:any,remote:boolean = false){
        if(remote){
            ConfigData.configs = _d;
        }else if(!ConfigData.configs){
            ConfigData.configs = _d;
        }
    }

    public static getConfigData(configName: string): any {
        return this.ctrlInfo[configName];
    }

    /**设置声音 */
    static setSound(str) {
        if (!str || str.length <= 0) {
            ConfigData.isSound = true;
            StorageMgr.setLocalSound("")
        } else {
            StorageMgr.setLocalSound("1");
            ConfigData.isSound = false;
        }
    }

    /**
     * 振动设置
     * @param str 
     */
    static setVirbort(str) {
        if (!str || str.length <= 0) {
            ConfigData.isVirbort = true;
            StorageMgr.setLocalVirbort("");
        } else {
            StorageMgr.setLocalVirbort("1");
            ConfigData.isVirbort = false;
        }
    }

    public static getAdData(adId) {
        let srt = this.getConfigData("adInfo");
        if(MyUtils.isNull(srt)){
            return;
        }
        let adInfos = JSON.parse(srt);
        let array = [];
        for (let i = 0; i < adInfos.length; i++) {
            let adInfo = adInfos[i];
            if (adInfo.position == adId) {
                array.push(adInfo);
            }
        }
        return array;
    }
}