export default class WXSubDomain {
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
        // Laya.timer.frameOnce(1, this, ()=> {
            this.wxOpenDataView.postMsg({ type: "openFriendRank" });
        // })
    }

    openGameOver(_d): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "openGameOver" ,data:_d});
    }

    closeGameOver(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "closeGameOver" });
    }

    openSurpassOther(_d): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "openSurpassOther" ,data:_d});
    }

    closeSurpassOther(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "closeSurpassOther" });
    }

    openGoingSurpassOther(_d): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "openGoingSurpassOther" ,data:_d});
    }

    closeGoingSurpassOther(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "closeGoingSurpassOther" });
    }

    openProvocationOther(_d): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "openProvocationOther" ,data:_d});
    }

    closeProvocationOther(): void {
        if (!Laya.Browser.onMiniGame || !this.wxOpenDataView) {
            return;
        }
        this.wxOpenDataView.postMsg({ type: "closeProvocationOther" });
    }
}