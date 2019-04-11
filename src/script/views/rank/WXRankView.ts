import BaseView from "../BaseView";
import PlatformMgr from "../../mgrCommon/PlatformMgr";
import MyUtils from "../../tools/MyUtils";
import WXSubDomain from "../../platform/wx/WXSubDomain";
import HttpMgr from "../../mgrCommon/HttpMgr";
import RankItem from "./RankItem";
import UserData from "../../models/UserData";

export default class RankView extends BaseView {

    private friendBtn:Laya.Image;
    private worldBtn:Laya.Image;
    private closeBtn:Laya.Image;
    
    private worldRank:Laya.Image;
    private worldData:Array<any>;
    private wxOpenDataView: Laya.WXOpenDataViewer;
    
    private worldRankList: Laya.List;

    private selfRankITem:RankItem;
    private selfRankData;
    
    onAwake(): void {
        super.onAwake();
        let node = this.owner.getChildByName("content")
        this.closeBtn = node.getChildByName("btn_close") as Laya.Image;

        this.friendBtn = node.getChildByName("friendBtn") as Laya.Image;
        this.worldBtn = node.getChildByName("worldBtn") as Laya.Image;
        this.wxOpenDataView = node.getChildByName("wxOpenDataView") as Laya.WXOpenDataViewer;
        this.wxOpenDataView.y = this.wxOpenDataView.y  + PlatformMgr.ptAPI.getOffsetOpenDomain().y/2;
        WXSubDomain.instance.setOpenView(this.wxOpenDataView);
        
        this.worldRankList = node.getChildByName("worldRankList") as Laya.List;
        this.worldRankList.array = [];
        this.worldRankList.itemRender = RankItem;
        this.worldRankList.renderHandler = new Laya.Handler(this, this.onRender);
        this.worldRankList.vScrollBarSkin = "";

        this.selfRankITem = node.getChildByName("selfRankItem").addComponent(RankItem);

        MyUtils.autoScreenSize([this.closeBtn]);
    }

    setMyRankInfo(){
        this.selfRankITem.updateItem(this.selfRankData);
    }

    onRender(cell: RankItem, index: number): any {
        cell.updateItem(cell.dataSource);
    }

    public addEvent() {
        this.closeBtn.on(Laya.Event.CLICK, this, this.closeView);
        this.worldBtn.on(Laya.Event.CLICK, this, this.worldRankClick);
        this.friendBtn.on(Laya.Event.CLICK, this, this.friendRankClick);
    }

    private getWorldData(){
        HttpMgr.instance.getWorldRank({
            success:(res)=>{
                this.worldData = res.rank;
                this.selfRankData = {
                    index : res.myIndex,
                    user_nickname:UserData.nickName,
                    headImage:UserData.avatarUrl,
                    score:UserData.score
                }
                if(res.myIndex && res.myIndex <= this.worldData.length){
                    this.selfRankData = this.worldData[res.myIndex];
                }
            }
        })
    }

    private setWorldRankDta(){
        this.worldRankList.array = this.worldData;
        this.worldRankList.refresh();
    }

    worldRankClick(): any {
        if (this.worldRank.active)
            return;
        this.worldRank.active = true;
        this.wxOpenDataView.active = false;
        WXSubDomain.instance.closeFriendRank();
        if(this.worldData){
            this.setWorldRankDta();
        }else{
            this.getWorldData();
        }
    }

    friendRankClick(): any {
        if (!Laya.Browser.onMiniGame || this.wxOpenDataView.active)
            return;
        this.wxOpenDataView.active = true;
        this.worldRank.active = false;
        //打开子域排行榜 TODO
        WXSubDomain.instance.openFriendRank();
    }

    public removeEvent() {
        this.closeBtn.off(Laya.Event.CLICK, this, this.closeView);
        this.worldBtn.off(Laya.Event.CLICK, this, this.worldRankClick);
        this.friendBtn.off(Laya.Event.CLICK, this, this.friendRankClick);
        super.removeEvent();
    }
    
    public closeView(){
        this.worldData = null;
        super.closeView();
    }
}