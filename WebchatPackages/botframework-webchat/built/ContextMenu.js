"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
document.body.addEventListener('mousedown', function (e) {
    if (ContextMenu.isVisisble()) {
        var node = e.target;
        var inMenu = false;
        while (node) {
            if (node.id === ContextMenu.MenuId) {
                inMenu = true;
                break;
            }
            node = node.parentNode;
        }
        if (!inMenu) {
            ContextMenu.hide();
        }
    }
});
document.body.addEventListener('keydown', function (e) {
    if (ContextMenu.isVisisble()) {
        ContextMenu.hide();
    }
});
var ContextMenu = (function (_super) {
    tslib_1.__extends(ContextMenu, _super);
    function ContextMenu(props) {
        return _super.call(this, props) || this;
    }
    ContextMenu.prototype.componentWillUpdate = function () {
        ContextMenu.instance = this;
    };
    ContextMenu.handleContextMenu = function (context, menu) {
        return function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            if (menu) {
                ContextMenu.showMenu(context, menu, evt.clientX, evt.clientY);
            }
        };
    };
    ContextMenu.handleTouchStart = function (getContext, menu) {
        return function (evt) {
            console.log("touchstart");
            evt.stopPropagation();
            evt.preventDefault();
            ContextMenu.startTouchTime = new Date().getTime();
            ContextMenu.startTouch = ContextMenu.getPrimaryTouch(evt);
            if (ContextMenu.touchTimer) {
                clearTimeout(ContextMenu.touchTimer);
                ContextMenu.touchTimer = undefined;
            }
            ContextMenu.touchTimer = setTimeout(function () {
                ContextMenu.showMenu(getContext(), menu, ContextMenu.startTouch.clientX, ContextMenu.startTouch.clientY);
            }, ContextMenu.touchDelay);
        };
    };
    ContextMenu.handleTouchMove = function () {
        return function (evt) {
            console.log("touchmove");
            evt.stopPropagation();
            evt.preventDefault();
            var touchMove = ContextMenu.getPrimaryTouch(evt);
            if (touchMove && ContextMenu.touchTimer &&
                Math.abs(ContextMenu.startTouch.clientX - touchMove.clientX) > 10 &&
                Math.abs(ContextMenu.startTouch.clientY - touchMove.clientY) > 10) {
                clearTimeout(ContextMenu.touchTimer);
                ContextMenu.touchTimer = undefined;
            }
        };
    };
    ContextMenu.handleTouchEnd = function () {
        return function (evt) {
            console.log("touchmove");
            evt.stopPropagation();
            evt.preventDefault();
            if (ContextMenu.touchTimer) {
                clearTimeout(ContextMenu.touchTimer);
                ContextMenu.touchTimer = undefined;
            }
        };
    };
    ContextMenu.showMenu = function (context, menu, clientX, clientY) {
        ContextMenu.menu = menu;
        ContextMenu.context = context;
        ContextMenu.clientX = clientX;
        ContextMenu.clientY = clientY;
        ContextMenu.instance.forceUpdate();
    };
    ContextMenu.hide = function () {
        ContextMenu.context = undefined;
        ContextMenu.instance.forceUpdate();
    };
    ContextMenu.isVisisble = function () {
        return ContextMenu.context !== undefined;
    };
    ContextMenu.getPrimaryTouch = function (evt) {
        var touches = evt.touches.length > 0 ? evt.touches : evt.targetTouches.length > 0 ? evt.targetTouches : evt.changedTouches;
        var touch;
        if (touches.length > 0) {
            touch = touches[0];
        }
        return touch;
    };
    ContextMenu.prototype.render = function () {
        if (ContextMenu.context) {
            var rect = document.documentElement.getBoundingClientRect();
            var positionStyle = {};
            if (ContextMenu.clientX + ContextMenu.width >= rect.right) {
                // flow left
                positionStyle['right'] = rect.right - ContextMenu.clientX;
            }
            else {
                // flow right
                positionStyle['left'] = ContextMenu.clientX;
            }
            if (ContextMenu.clientY + ContextMenu.width >= rect.bottom) {
                // flow up
                positionStyle['bottom'] = rect.bottom - ContextMenu.clientY;
            }
            else {
                // flow down
                positionStyle['top'] = ContextMenu.clientY;
            }
            var items = ContextMenu.menu.items.map(function (item) {
                var itemClass = "wc-context-menu-disabled-item";
                var onClickHandler;
                if (item.isEnabled(ContextMenu.context)) {
                    itemClass = "wc-context-menu-clickable-item";
                    onClickHandler = function (mouseEvent) {
                        var context = ContextMenu.context;
                        ContextMenu.hide();
                        item.onClick(context);
                    };
                }
                return (React.createElement("div", { key: item.label, className: "wc-context-menu-item " + itemClass, onClick: onClickHandler }, item.label));
            });
            return (React.createElement("div", { id: ContextMenu.MenuId, className: "wc-activity-context-menu", style: positionStyle }, items));
        }
        else {
            return (React.createElement("div", null));
        }
    };
    return ContextMenu;
}(React.Component));
ContextMenu.MenuId = "wc-activity-context-menu";
ContextMenu.width = 130;
ContextMenu.touchDelay = 1000;
exports.ContextMenu = ContextMenu;
//# sourceMappingURL=ContextMenu.js.map