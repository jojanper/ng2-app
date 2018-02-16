import { Component, Input } from '@angular/core';


const DROPDOWN_ITEM_TYPE = {
    // Show item as divider
    DIVIDER: 'divider',

    // Item is a link
    LINK: 'link',

    // Item contains callback function
    CALLBACK: 'callback'
};

/**
 * Link data for dropdown item which consists of url and title fields.
 */
export interface DropdownLink {
    url: string;
    title: string;
}

/**
 * Container for dropdown item.
 */
export class DropdownItem {
    // Factory method to create divider item
    static createAsDivider() {
        return new DropdownItem(DROPDOWN_ITEM_TYPE.DIVIDER);
    }

    // Factory method to create link item
    static createAsLink(link: DropdownLink) {
        return new DropdownItem(DROPDOWN_ITEM_TYPE.LINK, link);
    }

    // Factory method to create callback item
    static createAsCallback(link: DropdownLink, callback: Function) {
        return new DropdownItem(DROPDOWN_ITEM_TYPE.CALLBACK, link, callback);
    }

    constructor(
        protected type: string,
        public link: DropdownLink | null = null,
        public callback: Function | null = null
    ) {}

    get isLink() {
        return this.type === DROPDOWN_ITEM_TYPE.LINK;
    }

    get isDivider() {
        return this.type === DROPDOWN_ITEM_TYPE.DIVIDER;
    }

    get isCallback() {
        return this.type === DROPDOWN_ITEM_TYPE.CALLBACK;
    }
}

@Component({
    selector: 'dng-dropdown',
    template: require('./dropdown.component.html')
})
export class DropDownComponent {
    @Input() menuItems: Array<DropdownItem>;
}
