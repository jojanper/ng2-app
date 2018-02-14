import { Component, Input } from '@angular/core';


export const DROPDOWN_TYPES = {
    DIVIDER: 'divider',
    LINK: 'link'
};

export interface DropdownLink {
    url: string;
    title: string;
}

export class DropdownItem {
    static createAsDivider() {
        return new DropdownItem(DROPDOWN_TYPES.DIVIDER);
    }

    static createAsLink(link: DropdownLink) {
        return new DropdownItem(DROPDOWN_TYPES.LINK, link);
    }

    constructor(public type: string, public link: DropdownLink | null = null) {}

    get isLink() {
        return this.type === DROPDOWN_TYPES.LINK;
    }

    get isDivider() {
        return this.type === DROPDOWN_TYPES.DIVIDER;
    }
}

@Component({
    selector: 'dng-dropdown',
    template: require('./dropdown.component.html')
})
export class DropDownComponent {
    @Input() menuItems: Array<DropdownItem>;


}
