import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeWhile, tap } from 'rxjs/operators';

import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as search from 'xterm/lib/addons/search/search';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';

import { NetworkService, ConnectionOptions, BackendResponse } from '../../../../services';


// Returns elements left position relative to top-left of viewport
function getPosition(el) {
    return el.getBoundingClientRect().left;
}

Terminal.applyAddon(fit);
Terminal.applyAddon(search);
Terminal.applyAddon(webLinks);
Terminal.applyAddon(fullscreen);
Terminal.applyAddon(winptyCompat);

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

    @ViewChild('terminal') term: ElementRef;
    @ViewChild('menu') private menu: ElementRef;

    protected mousedown = false;
    protected timelineWidth = 0;
    @ViewChild('timeline') private timeline: ElementRef;
    @ViewChild('timelineparent') private timelineparent: ElementRef;

    protected connectionOptions = new ConnectionOptions();

    constructor(private network: NetworkService) {
        this.connectionOptions.cors = true;

        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    getTerminalMenuClass() {
        return (this.focused) ? 'terminalMenuFocus' : 'terminalMenuBlur';
    }

    ngOnInit() {
        this.terminal = new Terminal({
            cursorBlink: true,
            cols: 100,
            rows: 25
        });

        this.terminal.open(this.term.nativeElement);
        this.terminal['winptyCompatInit']();
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

        fromEvent(this.timeline.nativeElement, 'mousedown').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.destroy === false)
        ).subscribe(() => this.mouseDown());

        fromEvent(window, 'mouseup').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.destroy === false)
        ).subscribe((event) => this.mouseUp(event));

        /*
        console.log('HEP');
        this.network.get('http://localhost:3000', this.connectionOptions).subscribe((response) => {
            console.log(response);
        });
        */

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
            } else if (printable && e.charCode !== 0) {
                this.terminal.write(e.key);
            }
            /* tslint:enable:deprecation */
        });
    }

    ngOnDestroy() {
        this.destroy = true;
        this.terminal.dispose();
    }

    mouseDown() {
        //console.log(event);
        console.log('MOUSE DOWN');
        this.mousedown = true;
        this.timelineWidth = this.timelineparent.nativeElement.offsetWidth - this.timeline.nativeElement.offsetWidth;

        fromEvent(window, 'mousemove').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.mousedown === true)
        ).subscribe((event) => this.mouseMove(event));

        //console.log(this);
        //this['t'].open();

        //window.addEventListener('mousemove', this.mouseMove, true);
    }

    mouseMove(event) {
        this.moveTimeline(event);
    }

    mouseUp(event) {
        console.log('MOUSE UP');
        if (this.mousedown) {
            this.moveTimeline(event);
            //this['t'].close();
            //window.removeEventListener('mousemove', this.mouseMove, true);
        }

        this.mousedown = false;
    }

    // Moves playhead as user drags
    moveTimeline(event) {
        var newMargLeft = event.clientX - getPosition(this.timelineparent.nativeElement);

        //console.log(newMargLeft, this.timelineWidth);

        //if (newMargLeft >= 0 && newMargLeft <= this.timelineWidth) {
            this.timeline.nativeElement.style.marginLeft = newMargLeft + "px";
        //}

        if (newMargLeft < 0) {
            this.timeline.nativeElement.style.marginLeft = "0px";
        }

        if (newMargLeft > this.timelineWidth) {
            this.timeline.nativeElement.style.marginLeft = this.timelineWidth + "px";
        }
    }

    get position() {
        //console.log(this.timeline.nativeElement);
        return this.timeline.nativeElement ? this.timeline.nativeElement.style.marginLeft : 0;
    }
}
