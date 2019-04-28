import HttpMgr from "./HttpMgr";
import UserData from "../models/UserData";
import ConfigData from "../models/ConfigData";

// 0普通, 1复活, 2获取道具
export enum SHARE_VIDEO_TYPE {
    NORMAL = 0,  
    RESURGENCE,
    PROP
}

export default class StatisticsMgr {
    public static readonly instance: StatisticsMgr = new StatisticsMgr();
    private httpsArr = [];

    private constructor() {
    }

    public init(){
        //每分钟检查一次是否有提交统计失败的，哪里有再提交一次，提交成功后删除这条统计数据
        Laya.timer.loop(1000 * 60,this,this.goPost);
    }
 
    //登陆统计
    public loginStatisticsPost(){
        var _d:any = {
            action:"1005",
            from_appid:UserData.fromAppid,
            from_imgid:UserData.fromImgid,
            code:UserData.code,
            isnew:UserData.isNew ? 1 : 0,
        }
        this.statisticsPost(_d);
    }

    //点击授权统计接口
    public authorStatistics() {
        var _d: any = {
            action: "1006",
            from_appid:UserData.fromAppid,
            from_imgid:UserData.fromImgid,
            code:UserData.code,
            isnew:UserData.isNew ? 1 : 0,
        }
        this.statisticsPost(_d);
    }
    
    //开始游戏统计接口
    public startGameStatistics() {
        var _d: any = {
            action: "1008",
        }
        this.statisticsPost(_d);
    }
       
    //分享统计接口  类型: 0普通分享, 1分享复活, 2分享获取道具, 3分享获取抽奖次数
    public shareStatistics(type: number) {
        var _d: any = {
            action: "1009",
            type: type,
        }
        this.statisticsPost(_d);
    }

    //点击视频统计接口
    public clickVideoStatistics(type: number) {
        var _d: any = {
            action: "1010",
            type: type,
        }
        this.statisticsPost(_d);
    }

    //看完视频统计接口
    public videoPlayOverAdStatistics(type: number) {
        var _d: any = {
            action: "1011",
            type: type,
        }
        this.statisticsPost(_d);
    }

    //点击跳转统计接口
    public navigateToMiniProgramStatistics(_d) {
        _d.action = "1007";
        this.statisticsPost(_d);
    }

    //点击跳转成功后统计接口
    public navigateToMiniProgramBackStatistics(_d) {
        _d.action = "1017";
        this.statisticsPost(_d);
    }

    //统计
    private statisticsPost(_data:any){
        let _d: any = {
            channel: UserData.channelId,
            my_appid: ConfigData.myAppid,
            openid: UserData.openId,
        }
        for (const key in _data) {
            if (_data.hasOwnProperty(key)) {
                _d[key] = _data[key];
            }
        }
        _d.fail = ()=>{
            this.httpsArr.push(_d);
        }
        _d.callback = (res)=>{
            if(res.code != 0){
                this.httpsArr.push(_d);
            }
        }
        HttpMgr.instance.statisticsPost(_d);
    }

    //每分钟检查一次是否有提交统计失败的，哪里有再提交一次，提交成功后删除这条统计数据
    goPost(){
        for (let index = 0; index < this.httpsArr.length; index++) {
            let _d = this.httpsArr[index];
            if(_d){
                this.httpsArr[index].index = index;
                _d.index = index;
                _d.fail = null;
                _d.callback = (res)=>{
                    if(res.code != 0){
                        return;
                    }
                    for (let i = 0; i < this.httpsArr.length; i++) {
                        this.httpsArr[i].index = res.index;
                        this.httpsArr.splice(i,1);
                        break;
                    }
                }
                HttpMgr.instance.statisticsPost(_d);
            }
        }
    }
}