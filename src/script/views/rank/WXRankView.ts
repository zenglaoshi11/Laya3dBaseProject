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

    private selectFriendRank: Laya.Image;
    private normalFriendRank: Laya.Image;

    private selectWorldRank: Laya.Image;
    private normalWorldRank: Laya.Image;

    
    private worldRank:Laya.Image;
    private worldData:Array<any>;
    private wxOpenDataView: Laya.WXOpenDataViewer;
    
    private worldRankList: Laya.List;

    private selfRankITem:RankItem;
    private selfRankData;
    
    onAwake(): void {
        super.onAwake();
        this.closeBtn = this.owner.getChildByName("btnClose") as Laya.Image;
        this.wxOpenDataView = this.owner.getChildByName("wxOpenDataView") as Laya.WXOpenDataViewer;
        let node = this.owner.getChildByName("content")
        
        this.friendBtn = node.getChildByName("friendBtn") as Laya.Image;
        this.worldBtn = node.getChildByName("worldBtn") as Laya.Image;
        this.selectFriendRank = node.getChildByName("selectFriendRank") as Laya.Image;
        this.normalFriendRank = node.getChildByName("normalFriendRank") as Laya.Image;
        this.selectWorldRank = node.getChildByName("selectWorldRank") as Laya.Image;
        this.normalWorldRank = node.getChildByName("normalWorldRank") as Laya.Image;

        let offset = {y:0};
        if(PlatformMgr.ptAPI)
            offset = PlatformMgr.ptAPI.getOffsetOpenDomain()
        this.wxOpenDataView.y = this.wxOpenDataView.y  + offset.y/2;
        WXSubDomain.instance.setOpenView(this.wxOpenDataView);
        
        this.worldRankList = node.getChildByName("worldRankList") as Laya.List;
        this.worldRankList.array = [];
        this.worldRankList.renderHandler = new Laya.Handler(this, this.onRender);
        this.worldRankList.vScrollBarSkin = "";

        this.selfRankITem = node.getChildByName("selfRankItem").getComponent(RankItem)

        MyUtils.autoScreenSize([this.closeBtn]);
    }

    setMyRankInfo(){
        this.selfRankITem.updateItem(this.selfRankData);
    }

    onRender(cell: Laya.Box, index: number): any {
        let item:RankItem = cell.getComponent(RankItem);
        item.updateItem(cell.dataSource);
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
                this.setWorldRankDta();
            }
        })
    }

    private setWorldRankDta(){
        this.setMyRankInfo();
        this.worldRankList.array = this.worldData;
        this.worldRankList.refresh();
    }

    worldRankClick(): any {
        // if (this.worldRankList.active)
        //     return;
        this.wxOpenDataView.active = false;

        this.selectFriendRank.visible = false;
        this.normalFriendRank.visible = true;
        this.selectWorldRank.visible = true;
        this.normalWorldRank.visible = false;
        this.worldRankList.visible = true;

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

        this.selectFriendRank.visible = true;
        this.normalFriendRank.visible = false;
        this.selectWorldRank.visible = false;
        this.normalWorldRank.visible = true;
        this.worldRankList.visible = false;
        this.selfRankITem.clean();

        //打开子域排行榜 TODO
        WXSubDomain.instance.openFriendRank();
    }

    public removeEvent() {
        this.closeBtn.off(Laya.Event.CLICK, this, this.closeView);
        this.worldBtn.off(Laya.Event.CLICK, this, this.worldRankClick);
        this.friendBtn.off(Laya.Event.CLICK, this, this.friendRankClick);
        super.removeEvent();
    }
    public openView(){
        super.openView();
        this.worldRankClick();
    }

    public closeView(){
        this.worldData = null;
        super.closeView();
    }
}