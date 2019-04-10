import MyUtils from "../tools/MyUtils";
import BaseView from "../views/BaseView";

export default class ViewMgr {
    public static readonly instance: ViewMgr = new ViewMgr();
    constructor() { }
    private viewDic: any = {};

    public openView(_d): void {
        let self = this;
        let url = _d.viewName;
        let cls = _d.cls;
        let closeAll = _d.closeAll;
        if (closeAll) {
            this.viewDic = {};
        }
        if (MyUtils.isNull(this.viewDic[url])) {
            Laya.Scene.open(url, closeAll, Laya.Handler.create(this, function (owner: Laya.Scene) {
                if (!MyUtils.isNull(cls)) {
                    let component: BaseView = owner.getComponent(cls) as BaseView;
                    component.openView(_d.data);
                    self.viewDic[url] = component;
                }
            }));
        } else {
            let component: BaseView = this.viewDic[url] as BaseView;
            component.openView(_d.data);
        }
    }

    public closeView(viewName: string) {
        if (MyUtils.isNull(this.viewDic[viewName])) {
            return;
        }
        let scene: BaseView = this.viewDic[viewName] as BaseView;
        scene.owner.destroy();
        scene.destroy();
        this.viewDic[viewName] = null;
    }

    public hideView(viewName: string) {
        if (MyUtils.isNull(this.viewDic[viewName])) {
            return;
        }
        let scene: BaseView = this.viewDic[viewName] as BaseView;
        scene.owner.active = false;
    }

    public getView(viewName: string){
        let view:BaseView = this.viewDic[viewName];
        if (!MyUtils.isNull(view)) {
            return view;
        }
    }

}