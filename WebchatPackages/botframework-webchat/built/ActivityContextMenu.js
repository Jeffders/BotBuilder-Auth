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
    ContextMenu.show = function (context, menu) {
        return function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            ContextMenu.menu = menu;
            ContextMenu.context = context;
            ContextMenu.clientX = evt.clientX;
            ContextMenu.clientY = evt.clientY;
            ContextMenu.instance.forceUpdate();
        };
    };
    ContextMenu.hide = function () {
        ContextMenu.context = undefined;
        ContextMenu.instance.forceUpdate();
    };
    ContextMenu.isVisisble = function () {
        return ContextMenu.context !== undefined;
    };
    /*canModify(): boolean {
        return ContextMenu.activity &&
            (ContextMenu.activity.type === "message" || ContextMenu.activity.type === "update") &&
            this.props.isFromMe(ContextMenu.activity);
    }
    */
    ContextMenu.prototype.render = function () {
        if (ContextMenu.context) {
            var rect = document.documentElement.getBoundingClientRect();
            var positionStyle = {};
            if (ContextMenu.clientX + 100 >= rect.right) {
                // flow left
                positionStyle['right'] = rect.right - ContextMenu.clientX;
            }
            else {
                // flow right
                positionStyle['left'] = ContextMenu.clientX;
            }
            if (ContextMenu.clientY + 100 >= rect.bottom) {
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
exports.ContextMenu = ContextMenu;
//# sourceMappingURL=ActivityContextMenu.js.map