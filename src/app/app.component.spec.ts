import { TestBed } from '@angular/core/testing';
import { provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DraalServicesModule } from './services';
import { AppComponent } from './app.component';
import { DraalAlertModule } from './widgets';


describe('App Component', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, DraalAlertModule.forRoot(), DraalServicesModule.forRoot()],
      declarations: [AppComponent],
      providers: [provideRoutes([])]
    });
  });

  it('should have an url', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.componentInstance.url).toEqual('https://github.com/jojanper/ng2-app');
  });

});
