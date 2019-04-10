import MyUtils from "../tools/MyUtils";
import ViewMgr from "../mgrCommon/ViewMgr";

export default class BaseView extends Laya.Script {
    protected _data;
    protected _isClick;

    onEnable(): void {
        //删除时自动释放
        (this.owner as Laya.View).autoDestroyAtClosed = true;
        this.addEvent();
    }

    onDisable(): void {
    }
    
    public openView(data?: any): void {
        (this.owner as Laya.View).height = Laya.stage.height;
        this._data = data || {};
    }

    public addEvent() {
    }

    public removeEvent() {
        Laya.timer.clearAll(this);
    }

    public closeView(_d:any = null) {
        this.removeEvent();
        var _viewName:string = (this.owner as Laya.View).url;
        if(_d.notDestroy){
            ViewMgr.instance.hideView(_viewName);
        }else{
            ViewMgr.instance.closeView(_viewName);
        }
        if(_viewName == "RankView.scene"){
            MyUtils.hideAuthorizationCheck(true);
        }
        if (this._data && this._data.callback) {
            this._data.callback(_d)
        }
        this._data = null;
    }

    

}