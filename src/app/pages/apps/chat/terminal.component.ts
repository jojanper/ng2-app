import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as search from 'xterm/lib/addons/search/search';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';

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
    @ViewChild('terminal') private term: ElementRef;

    constructor() {
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
        this.terminal.writeln('This is working');

        /*
        this.terminal.textarea.onkeydown = (e) => {
            //console.log(e);
        };
        */

        /*
        this.terminal.textarea.onkeypress = (e) => {
            console.log(e);
            //this.terminal.write(String.fromCharCode(e.keyCode));
            const printable = (
                !e.altKey && !e.ctrlKey && !e.metaKey
            );

            console.log('CODE', e.keyCode);

              if (e.keyCode == 13) {
                this.terminal.write('\n');
              } else if (e.keyCode == 8) {
               // Do not delete the prompt
                //if (this.terminal.x > 2) {
                    console.log('DEETE');
                  this.terminal.write('\b \b');
               // }
              } else if (printable) {
                this.terminal.write(e.key);
              }
        };
        */
        // this.terminal.textarea.onkeypress = (e) => {
        this.terminal.on('key', (key, e) => {
            console.log(e);
            // this.terminal.write(String.fromCharCode(e.keyCode));
            const printable = (
                !e.altKey && !e.ctrlKey && !e.metaKey
            );

            console.log('CODE', e.keyCode);

              if (e.keyCode === 13) {
                // this.terminal.write('\n');
                this.terminal.writeln('');
              } else if (e.keyCode === 8) {
               // Do not delete the prompt
                // if (this.terminal.x > 2) {
                    console.log('DEETE');
                  this.terminal.write('\b \b');
               // }
              } else if (printable && e.charCode !== 0) {
                this.terminal.write(e.key);
              }
        });

        this.terminal.on('data', (data) => {
            // term.write(data);
            // this.terminal.write(data);
            // this.terminal.write('\b \b');
            console.log('DATA', data);
       });
    }

    ngOnDestroy() {
        this.terminal.dispose();
    }
}
