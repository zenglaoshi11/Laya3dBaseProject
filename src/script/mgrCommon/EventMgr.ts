//全局事件
import EventDispatcher = laya.events.EventDispatcher;
export default class EventMgr extends EventDispatcher {
    static eventDispatcher: EventDispatcher = new EventDispatcher();
    public static readonly instance: EventMgr = new EventMgr();;
    private constructor() {
        super();
    }
    //派发事件
    public emit(InName, agv?: any) {
        // console.log("派发事件" + InName,agv);
        EventMgr.eventDispatcher.event(InName, agv);
    }
    //侦听事件
    public onEvent(InName, caller, listener: Function, arg?: any[]): void {
        // console.log("侦听事件",InName);
        EventMgr.eventDispatcher.on(InName, caller, listener, (arg == null) ? null : ([arg]));
    }

    //侦听事件
    public onOnceEvent(InName, caller, listener: Function, arg?: any[]): void {
        // console.log("侦听事件",InName);
        EventMgr.eventDispatcher.once(InName, caller, listener, (arg == null) ? null : ([arg]));
    }

    //移除事件
    public onOffEvent(InName, caller, listener: Function, arg?: any[]): void {
        // console.log("关闭事件",InName);
        EventMgr.eventDispatcher.off(InName, caller, listener);
    }
}