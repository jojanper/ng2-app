import { TestBed } from '@angular/core/testing';

import { AboutComponent } from './about.component';
import { DraalAppPagesModule } from '../index';


describe('About Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [DraalAppPagesModule.forRoot()]
    });
  });

  it('should have title', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].textContent).toContain('About Works!');
  });

});
