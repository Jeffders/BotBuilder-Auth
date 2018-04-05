/// <reference types="react" />
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
    constructor(props: {});
    componentWillUpdate(): void;
    static show<TContext>(context: TContext, menu: ContextMenuDefinition): React.MouseEventHandler<HTMLDivElement>;
    static hide(): void;
    static isVisisble(): boolean;
    render(): JSX.Element;
}
