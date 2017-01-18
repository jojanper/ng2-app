import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DemoComponent } from './demo.component';
import { AppFormComponent } from '../form';
import { WidgetChosenComponent, WidgetDtComponent } from '../widgets';

describe('Demo Component', () => {
  let fixture: ComponentFixture<DemoComponent>;
  let component: DemoComponent;

  function clickTab(tabIndex) {
    const tab = fixture.nativeElement.querySelectorAll('li.nav-item a')[tabIndex];
    tab.click();
    fixture.detectChanges();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot(), FormsModule],
      declarations: [DemoComponent, AppFormComponent, WidgetChosenComponent, WidgetDtComponent]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(DemoComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should have 4 tabs', async(() => {
    // GIVEN demo page
    // WHEN building demo component
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // THEN page should have title
      expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Collection of UI components');

      // AND 4 tabs
      expect(fixture.nativeElement.querySelectorAll('li.nav-item').length).toEqual(4);

      // AND form component is visible
      expect(fixture.nativeElement.querySelectorAll('dng2-form').length).toEqual(1);
    });
  }));

  it('second tab is selected', async(() => {
    // GIVEN demo page
    fixture.detectChanges();

    // WHEN clicking second tab
    clickTab(1);

    // THEN chosen plugin should be visible
    fixture.whenStable().then(() => {
        expect(fixture.nativeElement.querySelectorAll('dng2-chosen').length).toEqual(1);
    });
  }));

  it('third tab is selected', async(() => {
    // GIVEN demo page
    fixture.detectChanges();

    // WHEN clicking third tab
    clickTab(2);

    // THEN chosen plugin should be visible
    fixture.whenStable().then(() => {
        expect(fixture.nativeElement.querySelectorAll('dng2-dt').length).toEqual(1);
    });
  }));
});
