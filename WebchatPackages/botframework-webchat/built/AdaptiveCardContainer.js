"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var AdaptiveCards = require("microsoft-adaptivecards");
var Chat_1 = require("./Chat");
var adaptivecardsHostConfig = require("../adaptivecards-hostconfig.json");
var LinkedAdaptiveCard = (function (_super) {
    tslib_1.__extends(LinkedAdaptiveCard, _super);
    function LinkedAdaptiveCard(adaptiveCardContainer) {
        var _this = _super.call(this) || this;
        _this.adaptiveCardContainer = adaptiveCardContainer;
        return _this;
    }
    return LinkedAdaptiveCard;
}(AdaptiveCards.AdaptiveCard));
function getLinkedAdaptiveCard(action) {
    var element = action.parent;
    while (element && !(element instanceof LinkedAdaptiveCard)) {
        element = element.parent;
    }
    return element;
}
function cardWithoutHttpActions(card) {
    if (!card.actions)
        return card;
    var actions = [];
    card.actions.forEach(function (action) {
        //filter out http action buttons
        if (action.type === 'Action.Http')
            return;
        if (action.type === 'Action.ShowCard') {
            var showCardAction = action;
            showCardAction.card = cardWithoutHttpActions(showCardAction.card);
        }
        actions.push(action);
    });
    return tslib_1.__assign({}, card, { actions: actions });
}
AdaptiveCards.AdaptiveCard.onExecuteAction = function (action) {
    if (action instanceof AdaptiveCards.OpenUrlAction) {
        window.open(action.url);
    }
    else if (action instanceof AdaptiveCards.SubmitAction) {
        var linkedAdaptiveCard = getLinkedAdaptiveCard(action);
        if (linkedAdaptiveCard && action.data !== undefined) {
            if (typeof action.data === 'object' && action.data.__isBotFrameworkCardAction) {
                var cardAction = action.data;
                linkedAdaptiveCard.adaptiveCardContainer.onCardAction(cardAction.type, cardAction.value);
            }
            else {
                linkedAdaptiveCard.adaptiveCardContainer.onCardAction(typeof action.data === 'string' ? 'imBack' : 'postBack', action.data);
            }
        }
    }
};
var AdaptiveCardContainer = (function (_super) {
    tslib_1.__extends(AdaptiveCardContainer, _super);
    function AdaptiveCardContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.onCardAction = function (type, value) {
            _this.props.onCardAction(type, value);
        };
        return _this;
    }
    AdaptiveCardContainer.prototype.onClick = function (e) {
        if (!this.props.onClick)
            return;
        //do not allow form elements to trigger a parent click event
        switch (e.target.tagName) {
            case 'A':
            case 'AUDIO':
            case 'VIDEO':
            case 'BUTTON':
            case 'INPUT':
            case 'LABEL':
            case 'TEXTAREA':
            case 'SELECT':
                break;
            default:
                this.props.onClick(e);
        }
    };
    AdaptiveCardContainer.prototype.componentDidMount = function () {
        var _this = this;
        var adaptiveCard = new LinkedAdaptiveCard(this);
        adaptiveCard.parse(cardWithoutHttpActions(this.props.card));
        var errors = adaptiveCard.validate();
        if (errors.length === 0) {
            var renderedCard = void 0;
            try {
                renderedCard = adaptiveCard.render();
            }
            catch (e) {
                var ve = {
                    error: -1,
                    message: e
                };
                errors.push(ve);
                if (e.stack) {
                    ve.message += '\n' + e.stack;
                }
            }
            if (renderedCard) {
                if (this.props.onImageLoad) {
                    var imgs = renderedCard.querySelectorAll('img');
                    if (imgs && imgs.length > 0) {
                        Array.prototype.forEach.call(imgs, function (img) {
                            img.addEventListener('load', _this.props.onImageLoad);
                        });
                    }
                }
                this.div.appendChild(renderedCard);
                return;
            }
        }
        if (errors.length > 0) {
            console.log('Error(s) rendering AdaptiveCard:');
            errors.forEach(function (e) { return console.log(e.message); });
            this.setState({ errors: errors.map(function (e) { return e.message; }) });
        }
    };
    AdaptiveCardContainer.prototype.render = function () {
        var _this = this;
        var wrappedChildren;
        var hasErrors = this.state && this.state.errors && this.state.errors.length > 0;
        if (hasErrors) {
            wrappedChildren = (React.createElement("div", null,
                React.createElement("svg", { className: "error-icon", viewBox: "0 0 15 12.01" },
                    React.createElement("path", { d: "M7.62 8.63v-.38H.94a.18.18 0 0 1-.19-.19V.94A.18.18 0 0 1 .94.75h10.12a.18.18 0 0 1 .19.19v3.73H12V.94a.91.91 0 0 0-.07-.36 1 1 0 0 0-.5-.5.91.91 0 0 0-.37-.08H.94a.91.91 0 0 0-.37.07 1 1 0 0 0-.5.5.91.91 0 0 0-.07.37v7.12a.91.91 0 0 0 .07.36 1 1 0 0 0 .5.5.91.91 0 0 0 .37.08h6.72c-.01-.12-.04-.24-.04-.37z M11.62 5.26a3.27 3.27 0 0 1 1.31.27 3.39 3.39 0 0 1 1.8 1.8 3.36 3.36 0 0 1 0 2.63 3.39 3.39 0 0 1-1.8 1.8 3.36 3.36 0 0 1-2.62 0 3.39 3.39 0 0 1-1.8-1.8 3.36 3.36 0 0 1 0-2.63 3.39 3.39 0 0 1 1.8-1.8 3.27 3.27 0 0 1 1.31-.27zm0 6a2.53 2.53 0 0 0 1-.21A2.65 2.65 0 0 0 14 9.65a2.62 2.62 0 0 0 0-2 2.65 2.65 0 0 0-1.39-1.39 2.62 2.62 0 0 0-2 0A2.65 2.65 0 0 0 9.2 7.61a2.62 2.62 0 0 0 0 2A2.65 2.65 0 0 0 10.6 11a2.53 2.53 0 0 0 1.02.26zM13 7.77l-.86.86.86.86-.53.53-.86-.86-.86.86-.53-.53.86-.86-.86-.86.53-.53.86.86.86-.86zM1.88 7.13h2.25V4.88H1.88zm.75-1.5h.75v.75h-.75zM5.63 2.63h4.5v.75h-4.5zM1.88 4.13h2.25V1.88H1.88zm.75-1.5h.75v.75h-.75zM9 5.63H5.63v.75h2.64A4 4 0 0 1 9 5.63z" })),
                React.createElement("div", { className: "error-text" }, "Can't render card")));
        }
        else if (this.props.children) {
            wrappedChildren = (React.createElement("div", { className: "non-adaptive-content" }, this.props.children));
        }
        else {
            wrappedChildren = null;
        }
        return (React.createElement("div", { className: Chat_1.classList('wc-card', 'wc-adaptive-card', this.props.className, hasErrors && 'error'), ref: function (div) { return _this.div = div; }, onClick: function (e) { return _this.onClick(e); } }, wrappedChildren));
    };
    AdaptiveCardContainer.prototype.componentDidUpdate = function () {
        if (this.props.onImageLoad)
            this.props.onImageLoad();
    };
    return AdaptiveCardContainer;
}(React.Component));
exports.AdaptiveCardContainer = AdaptiveCardContainer;
AdaptiveCards.setHostConfig(adaptivecardsHostConfig);
//# sourceMappingURL=AdaptiveCardContainer.js.map