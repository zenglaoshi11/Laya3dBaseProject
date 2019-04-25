import MyUtils from "../tools/MyUtils";
import BaseView from "../views/BaseView";
import EventMgr from "./EventMgr";
import ConfigData, { MAINBTNSTYPE, SORTTYPE } from "../models/ConfigData";
import GameMgr from "../mgr3d/GameMgr";

export default class ViewMgr {
    public static readonly instance: ViewMgr = new ViewMgr();
    private viewDic: any = {};

    private events = ["goHome","openTip","openResurgence","openGameOverLevel",,"openGameOverScore","openFighting","openRank","openGoldenEggView"];

    private constructor() {
    }

    init(){
        for (let index = 0; index < this.events.length; index++) {
            EventMgr.instance.onEvent(this.events[index],this,this[this.events[index]]);
        }
    }
    
    private goHome(res){
        let viewName = ConfigData.mainBtnsType == MAINBTNSTYPE.LANDSCAPE ? "MainLandscape.scene" : "MainVertical.scene";
        this.openView({
            viewName: viewName,
            closeAll: true,
        });
    }

    private openRank(res){
        ViewMgr.instance.openView({
            viewName: "Rank.scene",
            closeAll: res.closeAll,
            data:res
        });
    }

    private openFighting(res){
        this.openView({
            viewName: "GameFighting.scene",
            closeAll: true,
            data:res
        });
    }

    //打开复活
    private openResurgence(res){
        this.openView({
            viewName: "Resurgence.scene",
            closeAll: true,
            data:res
        });
    }

    //打开结算
    private openGameOverScore(res){
        let viewName =  "GameOverEndless.scene";
        this.openView({
            viewName: viewName,
            closeAll: true,
            data:res
        });
    }

     //打开结算
     private openGameOverLevel(res){
        let isEndLess = true;
        let viewName = "GameOverLevel.scene";
        this.openView({
            viewName: viewName,
            closeAll: true,
            data:res
        });
    }

    //打开砸金蛋
    private openGoldenEggView(res){
        this.openView({
            viewName: "GoldenEggView.scene",
            closeAll: false,
            data:res
        });
    }

    private openTip(res){
        this.openView({
            viewName: "Tip.scene",
            closeAll: false,
            data:res
        });
    }

    public openView(_d): void {
        let self = this;
        let url = _d.viewName;
        let cls = _d.cls;
        let closeAll = _d.closeAll || false;
        if (closeAll) {
            this.viewDic = {};
        }
        if (MyUtils.isNull(this.viewDic[url])) {
            Laya.Scene.open(url, closeAll, Laya.Handler.create(this, function (owner: any) {
                self.viewDic[url] = owner;
                let coms = owner._components;
                if(coms){
                    for (let index = 0; index < coms.length; index++) {
                        const element = coms[index];
                        if(element.isMyBaseView){
                            element.openView(_d.data);
                            break;
                        }
                    }
                }
            }));
        } else {
            let owner = this.viewDic[url];
            let coms = owner._components;
            if(coms){
                for (let index = 0; index < coms.length; index++) {
                    const element = coms[index];
                    if(element.isMyBaseView){
                        element.openView(_d.data);
                        break;
                    }
                }
            }
        }
    }

    public closeView(viewName: string) {
        if (MyUtils.isNull(this.viewDic[viewName])) {
            return;
        }
        this.viewDic[viewName].destroy();
        this.viewDic[viewName] = null;
    }

    public hideView(viewName: string) {
        if (MyUtils.isNull(this.viewDic[viewName])) {
            return;
        }
        (this.viewDic[viewName] as Laya.View).visible = false;
    }

    public getView(viewName: string){
        let view = this.viewDic[viewName];
        if (!MyUtils.isNull(view)) {
            return view;
        }
    }

}