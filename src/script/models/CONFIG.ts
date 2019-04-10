import MyUtils from "../tools/MyUtils";
import StorageMgr from "../mgrCommon/StorageMgr";

export default class CONFIG {
    public static releasePlatform = "";//根据不同平台
    public static myAppid = "wxbe9fe00281505169";
    public static configs: any = null;
    public static language:string = "cn";
    public static languageData: any = null;

    public static version = "104";
    public static jsonVersion = "100";
    public static serverUrl: string = "https://xcx.biaocr.com/funny_frog/";
    public static jsonVersionUrl: string = "https://p.doguane.cn/20190404/m_04171926352321.json";
    public static statisticsUrl:string = "https://log.zuancr.com/"

    public static isLog: boolean = true; //是否开启日志
    public static isSound: boolean;
    public static isVirbort: boolean;
    public static sysCtrlInfo: any = {};//系统控制信息

    public static initLocal(){
        CONFIG.isSound = StorageMgr.getLocalSound();
        CONFIG.isVirbort = StorageMgr.getLocalVirbort();
        if (Laya.Browser.onMiniGame) {
            this.releasePlatform = "wx";
        }
    }

    public static initConfigData(_d:any,remote:boolean = false){
        if(remote){
            CONFIG.configs = _d;
        }else if(!CONFIG.configs){
            CONFIG.configs = _d;
        }
    }

    static getLaunchTipMsg() {
        // let tips = [
        //     "按住屏幕舌头会伸长哦",
        //     "敲好玩，值得等待，呱~"
        // ]
        let tips = this.languageData.tips;
        return tips[MyUtils.random(0, tips.length - 1)];
    }

    /**设置声音 */
    static setSound(str) {
        if (!str || str.length <= 0) {
            CONFIG.isSound = true;
            StorageMgr.setLocalSound("")
        } else {
            StorageMgr.setLocalSound("1");
            CONFIG.isSound = false;
        }
    }

    /**
     * 振动设置
     * @param str 
     */
    static setVirbort(str) {
        if (!str || str.length <= 0) {
            CONFIG.isVirbort = true;
            StorageMgr.setLocalVirbort("");
        } else {
            StorageMgr.setLocalVirbort("1");
            CONFIG.isVirbort = false;
        }
    }
}
CONFIG.initLocal();