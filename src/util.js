const Util = {
    _isMobile: undefined,
    _isSkinnyMobile: undefined,
    _isApp: undefined,

    isMobile() {
        if (this._isMobile !== undefined) {
            return this._isMobile;
        }
        if (window.innerHeight > window.innerWidth && window.innerWidth < 1025) {
            this._isMobile = true;
            return true;
        }
        this._isMobile = window.innerWidth < 1025 && window.innerHeight < 768;
        return window.innerWidth < 1025 && window.innerHeight < 1025;
    },

    isMobilePortrait() {
        if (this.isMobile() && window.innerWidth < window.innerHeight) {
            return true;
        } else {
            return false;
        }
    },

    isMobileLandscape() {
        if (this.isMobile() && window.innerWidth > window.innerHeight) {
            return true;
        } else {
            return false;
        }
    },

    isTabletPortrait() {
        if (this.isTablet() && window.innerWidth < window.innerHeight) {
            return true;
        } else {
            return false;
        }
    },

    isSkinnyMobile() {
        if (this._isSkinnyMobile !== undefined) {
            return this._isSkinnyMobile;
        }
        if (window.innerWidth < 375) {
            this._isSkinnyMobile = true;
            return true;
        }
        this._isSkinnyMobile = window.innerWidth < 375;
        return window.innerWidth < 375;
    },

    isApp() {
        if (this._isApp !== undefined) {
            return this._isApp;
        }
        if (
            this.isIOSApp() ||
            (window.matchMedia("(display-mode: standalone)").matches &&
                (this.isMobile() || this.isTablet()))
        ) {
            this._isApp = true;
            return true;
        }
        if (this.isMobile() || this.isTablet()) {
            this._isApp = true;
            return true;
        }

        this._isApp = false;
        return false;
    },

    isTablet() {
        var userAgent = navigator.userAgent.toLowerCase();
        if (window.innerHeight < 900 && window.innerWidth < 900) {
            return false;
        }
        if (
            (window.innerWidth > 900 &&
                window.innerWidth < 1400 &&
                window.innerHeight <= 1024) ||
            (window.innerHeight > 900 &&
                window.innerHeight < 1400 &&
                window.innerWidth <= 1024)
        ) {
            return true;
        }
        var isTablet =
            /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
                userAgent
            );
        return isTablet;
    },

    isIOSApp() {
        var standalone = window.navigator.standalone,
            userAgent = window.navigator.userAgent.toLowerCase(),
            ios = /iphone|ipod|ipad/.test(userAgent),
            isIOSApp = /ios-store/.test(userAgent);

        if (ios) {
            if (standalone && isIOSApp) {
                return true;
            }
        }
        return false;
    },

    isIOSPWA() {
        var standalone = window.navigator.standalone,
            userAgent = window.navigator.userAgent.toLowerCase(),
            ios = /iphone|ipod|ipad/.test(userAgent);

        if (ios) {
            if (standalone && !this.isIOSApp()) {
                return true;
            }
        }
        return false;
    },

    isIOS() {
        const browserInfo = navigator.userAgent.toLowerCase();

        if (
            browserInfo.match("iphone") ||
            browserInfo.match("ipad") ||
            browserInfo.match("macintosh")
        ) {
            return true;
        }

        var platform = "unknown";

        if (navigator.platform) {
            platform = navigator.platform;
        }

        if (navigator.userAgentData && navigator.userAgentData.platform) {
            platform = navigator.userAgentData.platform;
        }

        if (
            [
                "iPad Simulator",
                "iPhone Simulator",
                "iPod Simulator",
                "iPad",
                "iPhone",
                "iPod",
                "macintosh",
            ].includes(platform)
        ) {
            return true;
        }
        return false;
    },

    isAndroid() {
        const browserInfo = navigator.userAgent.toLowerCase();

        if (browserInfo.match("android") || browserInfo.match("android")) {
            return true;
        }

        var platform = "unknown";

        if (navigator.platform) {
            platform = navigator.platform;
        }

        if (navigator.userAgentData && navigator.userAgentData.platform) {
            platform = navigator.userAgentData.platform;
        }

        if (["android"].includes(platform)) {
            return true;
        }
        return false;
    },
    convertObjectKeysToLowerCase(obj) {
        const convertedObject = {};

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const lowerCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
                convertedObject[lowerCaseKey] = obj[key];
            }
        }

        return convertedObject;
    }
};

export default Util;