export default class ButtonAnim extends Laya.Script {
    constructor() { super(); }

    onAwake(): void {
        this.owner.on(Laya.Event.MOUSE_DOWN, this, this.onDown);
        this.owner.on(Laya.Event.MOUSE_UP, this, this.onUp);
        this.owner.on(Laya.Event.MOUSE_OUT, this, this.onUp);
    }

    onDisable(): void {
        this.owner.offAll();
        Laya.Tween.clearAll(this);
    }

    public onDown(): void {
        Laya.Tween.to(this.owner, { scaleX: 0.8, scaleY: 0.8 }, 100);
    }

    private onUp(): void {
        Laya.Tween.to(this.owner, { scaleX: 1, scaleY: 1 }, 100);
    }
}