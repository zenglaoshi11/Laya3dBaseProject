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

    openGameOver(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "openGameOver" });
    }

    closeGameOver(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "closeGameOver" });
    }

    openSurpassOther(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "openSurpassOther" });
    }

    closeSurpassOther(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "closeSurpassOther" });
    }

    openGoingSurpassOther(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "openGoingSurpassOther" });
    }

    closeGoingSurpassOther(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "closeGoingSurpassOther" });
    }

    openProvocationOther(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "openProvocationOther" });
    }

    closeProvocationOther(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "closeProvocationOther" });
    }
}