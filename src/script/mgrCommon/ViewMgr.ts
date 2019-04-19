import MyUtils from "../tools/MyUtils";
import BaseView from "../views/BaseView";
import EventMgr from "./EventMgr";
import ConfigData, { MAINBTNSTYPE } from "../models/ConfigData";

export default class ViewMgr {
    public static readonly instance: ViewMgr = new ViewMgr();
    private viewDic: any = {};

    private events = ["goHome"];

    private constructor() {
    }

    init(){
        for (let index = 0; index < this.events.length; index++) {
            EventMgr.instance.onEvent(this.events[index],this,this[this.events[index]]);
        }
    }
    
    private goHome(res){
        let viewName = ConfigData.mainBtnsType == MAINBTNSTYPE.LANDSCAPE ? "MainLandscape.scene" : "MainVertical.scene";
        ViewMgr.instance.openView({
            viewName: viewName,
            closeAll: true,
        });
    }

    public openView(_d): void {
        let self = this;
        let url = _d.viewName;
        let cls = _d.cls;
        let closeAll = _d.closeAll;
        if (closeAll) {
            this.viewDic = {};
        }
        if (MyUtils.isNull(this.viewDic[url])) {
            Laya.Scene.open(url, closeAll, Laya.Handler.create(this, function (owner: any) {
                self.viewDic[url] = owner;
                let coms = owner._components;
                for (let index = 0; index < coms.length; index++) {
                    const element = coms[index];
                    if(element.isMyBaseView){
                        element.openView(_d.data);
                        break;
                    }
                }
            }));
        } else {
            let owner = this.viewDic[url];
            let coms = owner._components;
            for (let index = 0; index < coms.length; index++) {
                const element = coms[index];
                if(element.isMyBaseView){
                    element.openView(_d.data);
                    break;
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
        this.viewDic[viewName].active = false;
    }

    public getView(viewName: string){
        let view = this.viewDic[viewName];
        if (!MyUtils.isNull(view)) {
            return view;
        }
    }

}