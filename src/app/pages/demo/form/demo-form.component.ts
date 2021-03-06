import { Component, OnInit } from '@angular/core';

import { FormModel } from '../../../widgets/form/form.model';
import { StateTrackerObservable } from '../../../utils/base';


@Component({
    selector: 'dng-form-app-demo',
    templateUrl: 'demo-form.component.html',
})
export class DemoFormComponent implements OnInit {

    model: FormModel;
    stateTracker: StateTrackerObservable;

    ngOnInit() {
        const options1 = [
            'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua & Barbuda', 'Argentina',
            'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
            'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia & Herzegovina',
            'Botswana', 'Brazil', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Myanmar/Burma', 'Burundi',
            'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad',
            'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
            'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominican Republic', 'Dominica', 'Ecuador', 'Egypt',
            'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'French Guiana',
            'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Great Britain', 'Greece', 'Grenada', 'Guadeloupe', 'Guatemala',
            'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
            'Israel and the Occupied Territories', 'Italy', 'Ivory Coast (Cote d\'Ivoire)', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
            'Kenya', 'Kosovo', 'Kuwait', 'Kyrgyz Republic (Kyrgyzstan)', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
            'Liechtenstein', 'Lithuania', 'Luxembourg', 'Republic of Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
            'Mali', 'Malta', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Moldova, Republic of', 'Monaco',
            'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand',
            'Nicaragua', 'Niger', 'Nigeria', 'Korea, Democratic Republic of (North Korea)', 'Norway', 'Oman', 'Pacific Islands',
            'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico',
            'Qatar', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
            'Saint Vincent\'s & Grenadines', 'Samoa', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
            'Sierra Leone', 'Singapore', 'Slovak Republic (Slovakia)', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
            'Korea, Republic of (South Korea)', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden',
            'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor Leste', 'Togo', 'Trinidad & Tobago', 'Tunisia',
            'Turkey', 'Turkmenistan', 'Turks & Caicos Islands', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United States of America (USA)',
            'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (UK)', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe',
        ];

        const options2 = [
            { name: 'First' }, { name: 'Second' }, { name: 'Third' }, { name: 'Fourth' },
            { name: 'Fifth' }, { name: 'Sixth' }, { name: 'Seventh' }, { name: 'Eight' },
            { name: 'Nineth' }, { name: '10th' }, { name: '11th' }
        ];

        // Form definition in terms of a model
        this.model = new FormModel();
        this.model.addInput('username', 'foo', {
            type: 'text',
            label: 'Username',
            placeholder: 'Input username (4 characters at minimum)',
            validators: [{ name: 'required' }, { name: 'minlength', value: 4 }]
        });
        this.model.addInput('radio', null, {
            type: 'radio',
            label: 'Select name',
            validators: [{ name: 'required' }],
            selector: {
                list: ['Foo', 'Bar']
            }
        });
        this.model.addInput('checkbox', [
            {
                name: 'Apple',
                value: true
            }
        ],
            {
                type: 'checkbox',
                label: 'Select fruit(s)',
                selector: {
                    list: [{ name: 'Apple' }, { name: 'Orange' }, { name: 'Mango' }],
                    displayRef: 'name'
                }
            }
        );
        this.model.addInput('age', [
            {
                age: 'Under 18',
                value: true
            }
        ], {
                type: 'checkbox',
                label: 'Select age',
                selector: {
                    list: [{ age: 'Under 18' }, { age: 'Over 18' }],
                    displayRef: 'age'
                }
            }
        );
        this.model.addInput('option', options1[0], {
            type: 'select',
            label: 'Select 1st country',
            placeholder: 'Select country...',
            validators: [{ name: 'required' }],
            selector: {
                list: options1
            }
        });
        this.model.addInput('option2', null, {
            type: 'select',
            label: 'Select 2nd country',
            placeholder: 'Select country...',
            validators: [{ name: 'required' }],
            selector: {
                list: options1
            }
        });
        this.model.addInput('option3', [options2[0]], {
            type: 'select',
            multiple: true,
            label: 'Select option (multiple)',
            placeholder: 'Select multiple items...',
            validators: [{ name: 'required' }, { name: 'minselection', value: 2 }, { name: 'maxselection', value: 3 }],
            selector: {
                list: options2,
                displayRef: 'name',
                idRef: 'name'
            }
        });

        this.stateTracker = new StateTrackerObservable();
    }

    submit(data: any): void {
        console.log(data);

        setTimeout(() => {
            this.stateTracker.setSuccess();
        }, 1500);
    }
}
