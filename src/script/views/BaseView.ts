import MyUtils from "../tools/MyUtils";
import ViewMgr from "../mgrCommon/ViewMgr";
import PlatformMgr from "../mgrCommon/PlatformMgr";

export default class BaseView extends Laya.Script {
    public isMyBaseView:boolean = true
    protected _data;
    protected _isClick;

    protected shareBtn: Laya.Image;
    protected homeBtn: Laya.Image;
    protected okBtn: Laya.Image;
    protected closeBtn: Laya.Image;
    
    protected offset = {y:0};
    protected addMinProgram:Laya.Image;
    private _speed:number = 1;
    private _minX:number;
    private _maxX:number;

    onAwake(): void {
        //删除时自动释放
        (this.owner as Laya.View).autoDestroyAtClosed = true;
        (this.owner as Laya.View).height = Laya.stage.height;

        this.addMinProgram = this.owner.getChildByName("addMinProgram") as Laya.Image;
        this.okBtn = this.owner.getChildByName("okBtn") as Laya.Image;
        this.closeBtn = this.owner.getChildByName("closeBtn") as Laya.Image;
        this.homeBtn = this.owner.getChildByName("homeBtn") as Laya.Image;
        this.shareBtn = this.owner.getChildByName("shareBtn") as Laya.Image;

        if(this.addMinProgram){
            this.addMinProgram.anchorY = 0.3;
            MyUtils.autoScreenSize([this.addMinProgram]);
            this._minX = Laya.stage.width / 2 - 20;
            this._maxX = Laya.stage.width / 2 + 20;
        }
        this.offset = PlatformMgr.callAPIMethodByProxy("getOffsetOpenDomain") || this.offset;
    }

    onEnable(): void {
        this.addEvent();
    }

    onDisable(): void {
        this.removeEvent();
    }
    
    public openView(data?: any): void {
        (this.owner as Laya.View).visible = true;
        (this.owner as Laya.View).height = Laya.stage.height;
        this._data = data || {};
    }

    public addEvent() {
        if(this.addMinProgram){
            this._speed = -1;
            Laya.timer.frameLoop(1, this, ()=>{
                this.addMinProgram.x += this._speed;
                if(this.addMinProgram.x <= this._minX){
                    this._speed = 1;
                    this.addMinProgram.x = this._minX;
                }else if(this.addMinProgram.x >= this._maxX){
                    this._speed = -1;
                    this.addMinProgram.x = this._maxX;
                }
            });
        }
    }

    public removeEvent() {
        this._isClick = null;
        if(this.addMinProgram)
            Laya.timer.clearAll(this.addMinProgram);
        Laya.timer.clearAll(this);
    }

    public closeView(_d?:any) {
        if(!this.owner)
            return;
        var _viewName:string = (this.owner as Laya.View).url;
        if(_d && _d.notDestroy){
            ViewMgr.instance.hideView(_viewName);
        }else{
            ViewMgr.instance.closeView(_viewName);
        }
        if(_viewName == "Rank.scene"){
            PlatformMgr.callAPIMethodByProxy("setAuthorizationCheck",true);
        }
        if (this._data && this._data.callback) {
            this._data.callback(_d)
        }
        this._data = null;
    }

    

}