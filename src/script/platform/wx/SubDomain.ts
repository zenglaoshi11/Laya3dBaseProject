export default class SubDomain extends Laya.Script {
    
    constructor() { super(); }
    
    onEnable(): void {
    }

    public static UpdateSelfScore(score) {
        if (Laya.Browser.onMiniGame) {
            Laya.Browser.window.wx.postMessage({ type: "upScore" ,data:score});
        }
    }
}