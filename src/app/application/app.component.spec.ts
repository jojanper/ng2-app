import { TestBed } from '@angular/core/testing';
import { provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DraalServicesModule, ApiService, StarWarsApiService } from '../services';
import { AppComponent } from './app.component';
import { DraalAlertModule } from '../widgets';
import { DraalAppHeaderComponent, DraalAppFooterComponent } from '../pages';


describe('App Component', () => {

  const mockApi = {};
  const mockStarWarsApi = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, DraalAlertModule.forRoot(), DraalServicesModule.forRoot()],
      declarations: [DraalAppHeaderComponent, DraalAppFooterComponent, AppComponent],
      providers: [
        provideRoutes([]),
        {provide: ApiService, useValue: mockApi},
        {provide: StarWarsApiService, useValue: mockStarWarsApi}
      ]
    });
  });

  it('should have an url', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.componentInstance.url).toEqual('https://github.com/jojanper/angular-app');
  });

});
