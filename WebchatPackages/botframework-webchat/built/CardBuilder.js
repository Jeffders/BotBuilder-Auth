"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var AdaptiveCardBuilder = (function () {
    function AdaptiveCardBuilder() {
        this.container = {
            type: "Container",
            items: []
        };
        this.card = {
            type: "AdaptiveCard",
            version: "0.5",
            body: [this.container]
        };
    }
    AdaptiveCardBuilder.prototype.addColumnSet = function (sizes, container) {
        if (container === void 0) { container = this.container; }
        var columnSet = {
            type: 'ColumnSet',
            columns: sizes.map(function (size) {
                return {
                    type: 'Column',
                    size: size.toString(),
                    items: []
                };
            })
        };
        container.items.push(columnSet);
        return columnSet.columns;
    };
    AdaptiveCardBuilder.prototype.addItems = function (elements, container) {
        if (container === void 0) { container = this.container; }
        container.items.push.apply(container.items, elements);
    };
    AdaptiveCardBuilder.prototype.addTextBlock = function (text, template, container) {
        if (container === void 0) { container = this.container; }
        if (typeof text !== 'undefined') {
            var textblock = tslib_1.__assign({ type: "TextBlock", text: text }, template);
            container.items.push(textblock);
        }
    };
    AdaptiveCardBuilder.prototype.addButtons = function (buttons, includesOAuthButtons) {
        if (buttons) {
            this.card.actions = buttons.map(function (b) { return AdaptiveCardBuilder.addCardAction(b, includesOAuthButtons); });
        }
    };
    AdaptiveCardBuilder.addCardAction = function (cardAction, includesOAuthButtons) {
        if (cardAction.type === 'imBack' || cardAction.type === 'postBack') {
            var botFrameworkCardAction = tslib_1.__assign({ __isBotFrameworkCardAction: true }, cardAction);
            return {
                title: cardAction.title,
                type: "Action.Submit",
                data: botFrameworkCardAction
            };
        }
        else if (cardAction.type === 'signin' && includesOAuthButtons) {
            // Create a button specific for OAuthCard 'signin' actions (cardAction.type == signin and button action is Action.Submit)
            var botFrameworkCardAction = tslib_1.__assign({ __isBotFrameworkCardAction: true }, cardAction);
            return {
                type: 'Action.Submit',
                title: cardAction.title,
                data: botFrameworkCardAction
            };
        }
        else {
            return {
                type: 'Action.OpenUrl',
                title: cardAction.title,
                url: cardAction.type === 'call' ? 'tel:' + cardAction.value : cardAction.value
            };
        }
    };
    AdaptiveCardBuilder.prototype.addCommonHeaders = function (content) {
        this.addTextBlock(content.title, { size: "medium", weight: "bolder" });
        this.addTextBlock(content.subtitle, { isSubtle: true, wrap: true, separation: "none" }); //TODO remove "as any" because separation is not defined
        this.addTextBlock(content.text, { wrap: true });
    };
    AdaptiveCardBuilder.prototype.addCommon = function (content) {
        this.addCommonHeaders(content);
        this.addButtons(content.buttons);
    };
    AdaptiveCardBuilder.prototype.addImage = function (image, container) {
        if (container === void 0) { container = this.container; }
        var img = {
            type: "Image",
            url: image.url,
            size: "stretch",
        };
        if (image.tap) {
            img.selectAction = AdaptiveCardBuilder.addCardAction(image.tap);
        }
        container.items.push(img);
    };
    return AdaptiveCardBuilder;
}());
exports.AdaptiveCardBuilder = AdaptiveCardBuilder;
exports.buildCommonCard = function (content) {
    if (!content)
        return null;
    var cardBuilder = new AdaptiveCardBuilder();
    cardBuilder.addCommon(content);
    return cardBuilder.card;
};
exports.buildOAuthCard = function (content) {
    if (!content)
        return null;
    var cardBuilder = new AdaptiveCardBuilder();
    cardBuilder.addCommonHeaders(content);
    cardBuilder.addButtons(content.buttons, true);
    return cardBuilder.card;
};
//# sourceMappingURL=CardBuilder.js.map