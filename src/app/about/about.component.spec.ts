import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { AboutComponent } from './about.component';
import { AppFormComponent } from '../form';

describe('About Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [AboutComponent, AppFormComponent]
    });
  });

  it('should ...', () => {
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].textContent).toContain('About Works!');
  });

});
