import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

import { CountriesComponent } from './countries.component';
import { NetworkService, AlertService } from '../../../services';
import { TestHttpHelper, TestServiceHelper } from '@test/test_helpers';
import { DraalDataTableModule } from '../../../widgets';

const countries = [
    {
      "id": "ABW",
      "iso2Code": "AW",
      "name": "Aruba",
      "region": {
        "id": "LCN",
        "iso2code": "ZJ",
        "value": "Latin America & Caribbean "
      },
      "adminregion": {
        "id": "",
        "iso2code": "",
        "value": ""
      },
      "incomeLevel": {
        "id": "HIC",
        "iso2code": "XD",
        "value": "High income"
      },
      "lendingType": {
        "id": "LNX",
        "iso2code": "XX",
        "value": "Not classified"
      },
      "capitalCity": "Oranjestad",
      "longitude": "-70.0167",
      "latitude": "12.5167"
    },
    {
      "id": "AFG",
      "iso2Code": "AF",
      "name": "Afghanistan",
      "region": {
        "id": "SAS",
        "iso2code": "8S",
        "value": "South Asia"
      },
      "adminregion": {
        "id": "SAS",
        "iso2code": "8S",
        "value": "South Asia"
      },
      "incomeLevel": {
        "id": "LIC",
        "iso2code": "XM",
        "value": "Low income"
      },
      "lendingType": {
        "id": "IDX",
        "iso2code": "XI",
        "value": "IDA"
      },
      "capitalCity": "Kabul",
      "longitude": "69.1761",
      "latitude": "34.5228"
    }
];


const url = 'http://api.worldbank.org/v2/countries?format=json';

const responses = {};
responses[url] = countries;

describe('Activate Component', () => {
    let fixture: ComponentFixture<CountriesComponent>;
    let mockBackend: HttpTestingController;

    const mockAlert = new TestServiceHelper.alertService();

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                DraalDataTableModule
            ].concat(TestHttpHelper.http),
            declarations: [CountriesComponent],
            providers: [
                NetworkService,
                {provide: AlertService, useValue: mockAlert}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CountriesComponent);
            fixture.detectChanges();

            mockBackend = TestHttpHelper.getMockBackend();
            mockBackend.expectOne(url).flush(responses[url]);

            done();
        });
    });

    fit('country table is populated', async(() => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            mockBackend.verify();
            expect(fixture.nativeElement.querySelectorAll('tr').length).toEqual(2);
        });

        // GIVEN account activation view is opened
        // WHEN successful call to backend is made to activate account
        //mockBackend.expectOne(expectedUrl).flush(responses[activateUrl]);
        //mockBackend.verify();

        // THEN user is directed to login page on success
        // AND notification message is shown to user
        //verify('/auth/login', 'success');
    }));
});
