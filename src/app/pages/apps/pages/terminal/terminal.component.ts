import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeWhile } from 'rxjs/operators';

import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as search from 'xterm/lib/addons/search/search';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';


Terminal.applyAddon(fit);
Terminal.applyAddon(search);
Terminal.applyAddon(webLinks);
Terminal.applyAddon(fullscreen);

@Component({
    selector: 'dng-terminal',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, OnDestroy {
    public terminal: Terminal;
    title = new Date(Date.now()).toDateString();

    protected focused = false;

    private destroy = false;

    @ViewChild('terminal', { static: true }) term: ElementRef;
    @ViewChild('menu', { static: true }) private menu: ElementRef;

    constructor() { }

    getTerminalMenuClass() {
        return (this.focused) ? 'terminalMenuFocus' : 'terminalMenuBlur';
    }

    ngOnInit() {
        this.terminal = new Terminal({
            windowsMode: true,
            cursorBlink: true,
            cols: 100,
            rows: 25
        });

        this.terminal.open(this.term.nativeElement);
        this.terminal['webLinksInit']();
        this.terminal['fit']();
        this.terminal.focus();
        this.focused = true;

        fromEvent(window, 'resize').pipe(
            debounceTime(50),
            distinctUntilChanged(),
            takeWhile(() => this.destroy === false)
        ).subscribe(() => this.terminal['fit']());

        fromEvent(this.menu.nativeElement, 'click').pipe(
            debounceTime(50),
            distinctUntilChanged(),
            takeWhile(() => this.destroy === false)
        ).subscribe(() => this.terminal.focus());

        this.terminal.on('blur', () => {
            this.focused = false;
        });

        this.terminal.on('focus', () => {
            this.focused = true;
        });

        this.terminal.on('key', (key, e) => {
            const printable = (!e.altKey && !e.ctrlKey && !e.metaKey);

            /* tslint:disable:deprecation */
            if (e.keyCode === 13) {
                this.terminal.writeln('');
            } else if (e.keyCode === 8) {
                this.terminal.write('\b \b');
            } else if (e.keyCode === 9) {
                this.terminal.write('\t');
            } else if (printable) {
                this.terminal.write(e.key);
            }
            /* tslint:enable:deprecation */
        });
    }

    ngOnDestroy() {
        this.destroy = true;
        this.terminal.dispose();
    }
}
