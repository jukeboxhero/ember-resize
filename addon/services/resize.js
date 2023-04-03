"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var object_1 = require("@ember/object");
var computed_1 = require("@ember/object/computed");
var evented_1 = require("@ember/object/evented");
var runloop_1 = require("@ember/runloop");
var service_1 = require("@ember/service");
var string_1 = require("@ember/string");
var ResizeService = /** @class */ (function (_super_1) {
    __extends(ResizeService, _super_1);
    function ResizeService() {
        var _this = _super_1.apply(this, arguments) || this;
        _this._oldWidth = window.innerWidth;
        _this._oldHeight = window.innerHeight;
        _this._oldWidthDebounced = window.innerWidth;
        _this._oldHeightDebounced = window.innerHeight;
        _this._setDefaults();
        _this._onResizeHandler = function (evt) {
            _this._fireResizeNotification(evt);
            var scheduledDebounce = (0, runloop_1.debounce)(_this, _this._fireDebouncedResizeNotification, evt, _this.get('debounceTimeout'));
            _this._scheduledDebounce = scheduledDebounce;
        };
        if (typeof FastBoot === 'undefined') {
            _this._installResizeListener();
        }
        return _this;
    }
    ResizeService.prototype.destroy = function () {
        this._super.apply(this, arguments);
        if (typeof FastBoot === 'undefined') {
            this._uninstallResizeListener();
        }
        this._cancelScheduledDebounce();
        return this;
    };
    ResizeService.prototype._setDefaults = function () {
        var _this = this;
        var defaults = (0, object_1.getWithDefault)(this, 'resizeServiceDefaults', {});
        Object.keys(defaults).map(function (key) {
            var classifiedKey = (0, string_1.classify)(key);
            var defaultKey = "default".concat(classifiedKey);
            return (0, object_1.set)(_this, defaultKey, defaults[key]);
        });
    };
    ResizeService.prototype._hasWindowSizeChanged = function (w, h, debounced) {
        if (debounced === void 0) { debounced = false; }
        var wKey = debounced ? '_oldWidthDebounced' : '_oldWidth';
        var hKey = debounced ? '_oldHeightDebounced' : '_oldHeight';
        return ((this.get('widthSensitive') && w !== this.get(wKey)) || (this.get('heightSensitive') && h !== this.get(hKey)));
    };
    ResizeService.prototype._updateCachedWindowSize = function (w, h, debounced) {
        if (debounced === void 0) { debounced = false; }
        var wKey = debounced ? '_oldWidthDebounced' : '_oldWidth';
        var hKey = debounced ? '_oldHeightDebounced' : '_oldHeight';
        this.set(wKey, w);
        this.set(hKey, h);
    };
    ResizeService.prototype._installResizeListener = function () {
        if (!this._onResizeHandler) {
            return;
        }
        window.addEventListener('resize', this._onResizeHandler);
    };
    ResizeService.prototype._uninstallResizeListener = function () {
        if (!this._onResizeHandler) {
            return;
        }
        window.removeEventListener('resize', this._onResizeHandler);
    };
    ResizeService.prototype._cancelScheduledDebounce = function () {
        if (!this._scheduledDebounce) {
            return;
        }
        (0, runloop_1.cancel)(this._scheduledDebounce);
    };
    ResizeService.prototype._fireResizeNotification = function (evt) {
        var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
        if (this._hasWindowSizeChanged(innerWidth, innerHeight)) {
            this.trigger('didResize', evt);
            this._updateCachedWindowSize(innerWidth, innerHeight);
        }
    };
    ResizeService.prototype._fireDebouncedResizeNotification = function (evt) {
        var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
        if (this._hasWindowSizeChanged(innerWidth, innerHeight, true)) {
            this.trigger('debouncedDidResize', evt);
            this._updateCachedWindowSize(innerWidth, innerHeight, true);
        }
    };
    return ResizeService;
}(service_1["default"].extend(evented_1["default"], {
    debounceTimeout: (0, computed_1.oneWay)('defaultDebounceTimeout'),
    heightSensitive: (0, computed_1.oneWay)('defaultHeightSensitive'),
    screenHeight: (0, computed_1.readOnly)('_oldHeight'),
    screenWidth: (0, computed_1.readOnly)('_oldWidth'),
    widthSensitive: (0, computed_1.oneWay)('defaultWidthSensitive')
})));
exports["default"] = ResizeService;
