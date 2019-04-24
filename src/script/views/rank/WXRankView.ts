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

    private selfRankSprite;
    private selfRankITem:RankItem;
    private selfRankData;
    
    onAwake(): void {
        super.onAwake();
        this.closeBtn = this.owner.getChildByName("btnClose") as Laya.Image;
        this.wxOpenDataView = this.owner.getChildByName("wxOpenDataView") as Laya.WXOpenDataViewer;
        let node = this.owner.getChildByName("content") as Laya.Image;
        
        this.friendBtn = node.getChildByName("friendBtn") as Laya.Image;
        this.worldBtn = node.getChildByName("worldBtn") as Laya.Image;
        this.normalFriendRank = node.getChildByName("normalFriendRank") as Laya.Image;
        this.normalWorldRank = node.getChildByName("normalWorldRank") as Laya.Image;
        
        this.selectFriendRank = this.normalFriendRank.getChildByName("selectFriendRank") as Laya.Image;
        this.selectWorldRank = this.normalWorldRank.getChildByName("selectWorldRank") as Laya.Image;

        node.y = node.y + this.offset.y/2;
        this.wxOpenDataView.y = this.wxOpenDataView.y  + this.offset.y/2;
        if(PlatformMgr.subDomain){
            PlatformMgr.subDomain.setOpenView(this.wxOpenDataView);
        }
        
        this.worldRankList = node.getChildByName("worldRankList") as Laya.List;
        this.worldRankList.array = [];
        this.worldRankList.renderHandler = new Laya.Handler(this, this.onRender);
        this.worldRankList.vScrollBarSkin = "";

        this.selfRankSprite = node.getChildByName("selfRankItem")
        this.selfRankITem = this.selfRankSprite.getComponent(RankItem)

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
                    nickname:UserData.nickName,
                    headImage:UserData.avatarUrl,
                    score:UserData.score || 0
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
        this.wxOpenDataView.visible = false;
        this.selectFriendRank.visible = false;
        this.selectWorldRank.visible = true;
        this.worldRankList.visible = true;
        this.selfRankSprite.visible = true
        if(PlatformMgr.subDomain){
            PlatformMgr.subDomain.closeFriendRank();
        }
        if(this.worldData){
            this.setWorldRankDta();
        }else{
            this.getWorldData();
        }
    }

    friendRankClick(): any {
        this.wxOpenDataView.visible = true;
        this.selectFriendRank.visible = true;
        this.selectWorldRank.visible = false;
        this.worldRankList.visible = false;
        this.selfRankSprite.visible = false
        //打开子域排行榜 TODO
        if(PlatformMgr.subDomain){
            PlatformMgr.subDomain.openFriendRank();
        }
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