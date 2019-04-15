export default class WXSubDomain {
    public static readonly instance: WXSubDomain = new WXSubDomain();
    private constructor() {
    }
    private wxOpenDataView: Laya.WXOpenDataViewer;
    
    setOpenView(_v): void {
        this.wxOpenDataView = _v;
    }

    closeFriendRank(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "closeFriendRank" });
    }

    openFriendRank(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        Laya.timer.frameOnce(1, this, function () {
            this.WXOpenDataView.postMsg({ type: "openFriendRank" });
        })
    }

    closeGameOverRank(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "closeGameOverRank" });
    }

    openGameOverRank(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "openGameOverRank" });
    }
}