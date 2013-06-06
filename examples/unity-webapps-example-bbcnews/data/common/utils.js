// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-

function _(strid) {
    var lang = unsafeWindow.navigator.language;

    lang = lang.toLowerCase().replace(/-/g, '_');

    while (lang) {
        if (WebappsGettextDict.hasOwnProperty(lang) &&
            WebappsGettextDict[lang].hasOwnProperty(strid)) {
            return WebappsGettextDict[lang][strid];
        }
        lang = lang.substr(0, lang.lastIndexOf('_'));
    }

    console.log('Gettext _() failed to find translation.')
    return strid;
}

/**
 * WARNING: this is only kept here for backward compatibility reasons.
 * This needs to be as soon as the individual scripts are SRUed and
 * updated to use the latest mechanism
 */
var _previousIndicators = [];
function showIndicators(list) {
    if (list.length == _previousIndicators.length) {
        var same = true;
        for (var i = 0; i < list.length; i++) {
            if (list[i].name != _previousIndicators[i].name)
                same = false;
            if (list[i].count != _previousIndicators[i].count)
                same = false;
        }
        if (same)
            return;
    }
    _previousIndicators = list;
    Unity.MessagingIndicator.clearIndicators();
    for (var i = 0; i < list.length; i++) {
       Unity.MessagingIndicator.showIndicator(list[i].name, { count: list[i].count,
                                                              callback: list[i].callback });
    }
}

function trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
}

var KEY_NAME = '____unity_indicators_sync';
function Indicators(getCounters, combineFromMultipleTabs) {
    this._init(getCounters, combineFromMultipleTabs);
}

Indicators.prototype = {
    _prevIndicators: null,

    _getCountersCb: null,

    _init: function(getCounters, combineFromMultipleTabs) {
        this._last = {};
        this._timestamp = new Date();
        this._prevIndicators = [];
        this._getCountersCb = getCounters;
        this._combineFromMultipleTabs = combineFromMultipleTabs;

        window.addEventListener('blur', this._onBlur.bind(this));
        window.addEventListener('focus', this._onFocus.bind(this));

        setInterval(this._updateIndicators.bind(this), 8000);
        this._updateIndicators(true);
    },

    _onBlur: function() {
    },

    _onFocus: function() {
        this._timestamp = new Date();
        this.visited(this._currentLabel);
    },

    _updateTotal: function(total) {
        if (this._combineFromMultipleTabs) {
            return;
        }
        if (total) {
            Unity.Launcher.setCount(Number(total));
        } else {
            Unity.Launcher.clearCount();
        }
    },

    _updateIndicators: function(firstRun) {
        var state = localStorage.getItem(KEY_NAME);
        var updateState = false;

        try {
            var list = this._getCountersCb();
        } catch (e) {
            return;
        }

        if (state) {
            if (!this._combineFromMultipleTabs) {
                state = JSON.parse(state);

                if (state.timestamp > this._timestamp) {
                    this._timestamp = state.timestamp;
                    this._prevIndicators = state.prevIndicators;
                    this._last = state.lastValue;
                } else {
                    updateState = true;
                }
            }
        } else {
            updateState = true;
        }
        if (!firstRun && !this._forceUpdate && list.length == this._prevIndicators.length) {
            var same = true;
            for (var i = 0; i < list.length; i++) {
                if (list[i].name != this._prevIndicators[i].name)
                    same = false;
                if (list[i].count != this._prevIndicators[i].count)
                    same = false;
            }
            if (same)
                return;
        }

        this._forceUpdate = false;

        var total = 0;
        if (!this._combineFromMultipleTabs) {
            Unity.MessagingIndicator.clearIndicators();
        }
        for (var i = 0; i < list.length; i++) {
            var count = 0;
            if (!this._last[list[i].name]) {
                this._last[list[i].name] = 0;
            }
            if (this._last[list[i].name]) {
                if (this._last[list[i].name] < Number(list[i].count)) {
                    count = Number(list[i].count) - this._last[list[i].name];
                } else {
                    count = 0;
                }
            } else {
                this._last[list[i].name] = list[i].count;
            }
            if (!count) {
                if (this._combineFromMultipleTabs) {
                    Unity.MessagingIndicator.clearIndicator(list[i].name);
                }
                continue;
            }

            total += count;
            if (!firstRun) {
                Unity.MessagingIndicator.showIndicator(list[i].name, { count: count,
                                                                       callback: list[i].callback });
            } else {
                this._last[list[i].name] = Number(list[i].count);
            }
        }
        if (!firstRun) {
            this._updateTotal(total);
        }
        this._prevIndicators = list;
        try {
            if (updateState) {
                this._saveState();
            } else {
                localStorage.setItem(KEY_NAME, JSON.stringify(state));
            }
        } catch (e) {
            setTimeout((function () {this._updateIndicators(firstRun)}).bind(this), 500);
        }
    },

    _saveState: function() {
        localStorage.setItem(KEY_NAME, JSON.stringify({
            timestamp: new Date(),
            prevIndicators: this._prevIndicators,
            lastValue: this._last
        }));
    },

    visited: function(labelName) {
        this._currentLabel = labelName;
        var count = 0;
        for (var i = 0; i < this._prevIndicators.length; i++) {
            if (this._prevIndicators[i].name == labelName) {
                count = this._prevIndicators[i].count;
            }
        }
        this._forceUpdate = true;
        this._last[labelName] = count;
        this._saveState();
        this._updateIndicators(false);
    }
};

/**
 * On Chrommium v18 (and maybe earlier versions) the click() function
 *  does not seem to work on otherwise proper DOM elements (that are supposed
 *  to support click() as per the spec), e.g. SPAN elements etc.
 */
function launchClickEvent(node) {
    var doclick = node.click ? node.click.bind(node) : function () {
            var e = unsafeWindow.document.createEvent('MouseEvents');
            e.initMouseEvent("click", true, true,
                            unsafeWindow, 1, 1, 1, 1, 1,
                            false, false, false, false, 0, node);
            node.dispatchEvent(e);
        };
    doclick();
}

function click(node) {
    var event = unsafeWindow.document.createEvent("MouseEvents");
    event.initMouseEvent("mousedown", true, true, unsafeWindow,
                         0, 0, 0, 0, 0,
                         false, false, false, false,
                         0, null);
    node.dispatchEvent(event);

    event = unsafeWindow.document.createEvent("MouseEvents");
    event.initMouseEvent("mouseup", true, true, unsafeWindow,
                         0, 0, 0, 0, 0,
                         false, false, false, false,
                         0, null);
    node.dispatchEvent(event);
}

function evalInPageContext(func) {
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('(' + func + ')();'));
    (document.body || document.head || document.documentElement).appendChild(script);
}

function makeRedirector(link) {
    return function () {
        evalInPageContext('function() {window.location = "' + link + '";}');
    };
}

function wrapCallback(callback) {
    return function () {
        try {
            callback.apply(window, arguments);
        } catch (x) {
            console.log(x);
        }
    };
}

var MAX_PINS = 10;
var FAVORITES = '____unity_favorites';
function addFavoritesInLauncher(links) {
    var i;
    if (!links) {
        return;
    }

    Unity.Launcher.removeActions();
    links.sort(function (a, b) {
        if (a.count > b.count) {
            return -1;
        }
        if (a.count < b.count) {
            return 1;
        }
        return 0;
    });

    links.splice(MAX_PINS);

    for (i = 0; i < links.length; i++) {
        if (links[i].name) {
            Unity.Launcher.addAction(links[i].name, makeRedirector(links[i].url));
        }
    }
}

if (!window.reportTestState) {
    window.reportTestState = function (msg) {
        console.log(msg);
    };
}

function linkVisited(url, name, second) {
    var i, links = localStorage.getItem(FAVORITES);

    if (!links) {
        links = [];
        if (!second) {
            setTimeout(wrapCallback(function () {
                linkVisited(url, name, true);
            }), 1000);
            return;
        }
    } else {
        links = JSON.parse(links);
    }

    if (!name) {
        addFavoritesInLauncher(links);
        return;
    }

    var obj = null;

    for (i = 0; i < links.length; i++) {
        if (links[i].url === url) {
            obj = links[i];
        }
    }
    if (!obj) {
        obj = { url: url, name: name, count: 0 };
        links.push(obj);
    }
    obj.count++;

    localStorage.setItem(FAVORITES, JSON.stringify(links));
    addFavoritesInLauncher(links);
}
