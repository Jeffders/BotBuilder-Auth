/// <reference types="react" />
/// <reference types="node" />
import * as React from 'react';
export interface ContextMenuItem {
    label: string;
    onClick<TContext>(props: TContext): void;
    isEnabled<TContext>(props: TContext): void;
}
export interface ContextMenuDefinition {
    items: ContextMenuItem[];
}
export declare class ContextMenu extends React.Component<{}, {}> {
    static MenuId: string;
    static instance: ContextMenu;
    static menu: ContextMenuDefinition;
    static context: any;
    static clientX: number;
    static clientY: number;
    static startTouchTime: number;
    static startTouch: Touch;
    static touchTimer: NodeJS.Timer;
    static width: number;
    static touchDelay: number;
    constructor(props: {});
    componentWillUpdate(): void;
    static handleContextMenu<TContext>(context: TContext, menu: ContextMenuDefinition): React.MouseEventHandler<HTMLDivElement>;
    static handleTouchStart<TContext>(getContext: () => TContext, menu: ContextMenuDefinition): EventListener;
    static handleTouchMove(): EventListener;
    static handleTouchEnd(): EventListener;
    static showMenu<TContext>(context: TContext, menu: ContextMenuDefinition, clientX: number, clientY: number): void;
    static hide(): void;
    static isVisisble(): boolean;
    private static getPrimaryTouch(evt);
    render(): JSX.Element;
}
