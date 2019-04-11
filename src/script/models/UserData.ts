import MyUtils from "../tools/MyUtils";
import StorageMgr from "../mgrCommon/StorageMgr";

export default class UserData {
    public static code: string = "";//微信code
    public static openId: string = "";//微信openid
    public static sessionId: string = "";

    public static userId: any;
    public static nickName: string = "";
    public static gender:number = 0;
    public static avatarUrl: string = "";
    public static score: number = 0; //分数
    public static exp: number = 0;   //经验
    public static level: number = 1; //等级

    public static diamond:number = 0;
    public static gold:number = 0;

    public static isNew: boolean = false;
    public static isLogin: boolean = false;
    public static channelId: any;

    public static fromImgid:any;
    public static fromAppid:any;

    public static adCount: number;//视频广告次数

}