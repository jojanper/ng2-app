import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AboutComponent } from './about.component';
import { AppFormComponent } from '../form';
import { WidgetChosenComponent, WidgetDtComponent } from '../widgets';

describe('About Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [NgbModule.forRoot(), FormsModule],
        declarations: [AboutComponent, AppFormComponent, WidgetChosenComponent, WidgetDtComponent]
    });
  });

  it('should ...', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].textContent).toContain('About Works!');
  });

});
