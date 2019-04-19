import MyUtils from "../tools/MyUtils";
import ViewMgr from "../mgrCommon/ViewMgr";
import PlatformMgr from "../mgrCommon/PlatformMgr";

export default class BaseView extends Laya.Script {
    protected _data;
    protected _isClick;
    protected shareBtn: Laya.Image;
    protected homeBtn: Laya.Image;
    protected okBtn: Laya.Image;
    protected closeBtn: Laya.Image;

    onAwake(): void {
        //删除时自动释放
        (this.owner as Laya.View).autoDestroyAtClosed = true;
    }

    onEnable(): void {
        this.addEvent();
    }

    onDisable(): void {
        this.removeEvent();
    }
    
    public openView(data?: any): void {
        (this.owner as Laya.View).height = Laya.stage.height;
        this._data = data || {};
    }

    public addEvent() {
    }

    public removeEvent() {
        this._isClick = null;
        Laya.timer.clearAll(this);
    }

    public closeView(_d?:any) {
        var _viewName:string = (this.owner as Laya.View).url;
        if(_d.notDestroy){
            ViewMgr.instance.hideView(_viewName);
        }else{
            ViewMgr.instance.closeView(_viewName);
        }
        if(_viewName == "Rank.scene"){
            if(PlatformMgr.ptAPI)
                PlatformMgr.ptAPI.setAuthorizationCheck(true);
        }
        if (this._data && this._data.callback) {
            this._data.callback(_d)
        }
        this._data = null;
    }

    

}