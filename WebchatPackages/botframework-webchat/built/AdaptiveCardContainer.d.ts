/// <reference types="react" />
import * as React from 'react';
import * as AdaptiveCardSchema from "microsoft-adaptivecards/built/schema";
import { CardAction } from "botframework-directlinejs/built/directLine";
import { IDoCardAction } from "./Chat";
export interface Props {
    card: AdaptiveCardSchema.ICard;
    onImageLoad?: () => any;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onCardAction: IDoCardAction;
    className?: string;
}
export interface State {
    errors?: string[];
}
export interface BotFrameworkCardAction extends CardAction {
    __isBotFrameworkCardAction: boolean;
}
export declare class AdaptiveCardContainer extends React.Component<Props, State> {
    private div;
    constructor(props: Props);
    onCardAction: IDoCardAction;
    private onClick(e);
    componentDidMount(): void;
    render(): JSX.Element;
    componentDidUpdate(): void;
}
