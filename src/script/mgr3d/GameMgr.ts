import CurrGameData from "../models/CurrGameData";
import EventMgr from "../mgrCommon/EventMgr";
import MyGameEvent from "./MyGameEvent";

export default class GameMgr extends Laya.Script {
    public static instance: GameMgr = new GameMgr();
    private _currGameData:CurrGameData;
    private _fogColors:Array<Laya.Vector3> = [];

    private _scene3d:Laya.Scene3D;
    //摄像机
    private _camera: Laya.Camera;
    private _gameEvent:MyGameEvent;

    onAwake(){
        this._gameEvent = new MyGameEvent();
        this._currGameData = new CurrGameData();
        
        this._scene3d = this.owner as Laya.Scene3D;
        this._camera = this.owner.getChildByName("Main Camera") as Laya.Camera;
        // this._camera.farPlane = 33; //可以考虑这样提高性能

        //是否需要开启雾
        // this._scene3d.enableFog = true;
        // //设置雾化的颜色
        // this._scene3d.fogColor = this._fogColors[0];
        // //设置雾化的起始位置，相对于相机的距离
        // this._scene3d.fogStart = 10;
        // //设置雾化最浓处的距离。
        // this._scene3d.fogRange = 20;
    }
    
    getGameData(){
        return this._currGameData;
    }

    onEnable(): void {
    }

    initGameByData(_d){
        this._currGameData.reset();
    }

    onUpdate(): void {
        
    }

    onDisable(): void {
    }
}