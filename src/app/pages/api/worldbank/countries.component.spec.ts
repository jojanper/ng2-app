import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';

import { CountriesComponent } from './countries.component';
import { WorldBankRestApi } from './services/wbrest.service';
import { NetworkService } from '../../../services';
import { DraalAppPagesApiModule } from '../api.module';

const countries = [
    {
        'id': 'ABW',
        'iso2Code': 'AW',
        'name': 'Aruba',
        'region': {
            'id': 'LCN',
            'iso2code': 'ZJ',
            'value': 'Latin America & Caribbean '
        },
        'adminregion': {
            'id': '',
            'iso2code': '',
            'value': ''
        },
        'incomeLevel': {
            'id': 'HIC',
            'iso2code': 'XD',
            'value': 'High income'
        },
        'lendingType': {
            'id': 'LNX',
            'iso2code': 'XX',
            'value': 'Not classified'
        },
        'capitalCity': 'Oranjestad',
        'longitude': '-70.0167',
        'latitude': '12.5167'
    },
    {
        'id': 'AFG',
        'iso2Code': 'AF',
        'name': 'Afghanistan',
        'region': {
            'id': 'SAS',
            'iso2code': '8S',
            'value': 'South Asia'
        },
        'adminregion': {
            'id': 'SAS',
            'iso2code': '8S',
            'value': 'South Asia'
        },
        'incomeLevel': {
            'id': 'LIC',
            'iso2code': 'XM',
            'value': 'Low income'
        },
        'lendingType': {
            'id': 'IDX',
            'iso2code': 'XI',
            'value': 'IDA'
        },
        'capitalCity': 'Kabul',
        'longitude': '69.1761',
        'latitude': '34.5228'
    }
];


const url = 'https://api.worldbank.org/v2/countries';

const pageData = {
    'page': 1,
    'pages': 1,
    'per_page': '2',
    'total': 2
};

describe('Activate Component', () => {
    let calledUrl = '';
    let fixture: ComponentFixture<CountriesComponent>;

    const mockNetwork = {
        get: (callUrl) => {
            calledUrl = callUrl;
            return of([pageData, countries]);
        }
    };

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [
                DraalAppPagesApiModule
            ],
            declarations: [],
            providers: [
                WorldBankRestApi,
                {provide: NetworkService, useValue: mockNetwork}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CountriesComponent);
            fixture.detectChanges();
            done();
        });
    });

    it('country table is populated', async(() => {
        fixture.whenStable().then(() => {
            expect(calledUrl).toEqual(url);
            expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toEqual(2);
        });
    }));
});
