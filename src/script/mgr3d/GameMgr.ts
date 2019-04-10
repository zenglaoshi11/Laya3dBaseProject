export default class GameMgr extends Laya.Script {
    public static instance: GameMgr = new GameMgr();
    private constructor() {
        super();
    }
    
    private _scene3d:Laya.Scene3D;
    
    onEnable(): void {
    }

    init(_s:Laya.Scene3D): void {
        Laya.stage.addChild(_s);
    }

    onDisable(): void {
    }
}