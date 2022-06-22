import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AgreementService } from 'src/app/services/agreement.service';
import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Agreement } from 'src/app/models/agreement.model';
import { AgreementCreateDto } from 'src/app/models/agreement-create-dto.model';
import { AgreementEditDto } from 'src/app/models/agreement-edit-dto.model';
import { AgreementPaging } from 'src/app/models/agreement-paging.model';
import { Sort } from 'src/app/shared/enums/sort.model';

declare let alertify: any;

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss'],
})
export class AgreementsComponent implements OnInit {
  constructor(
    private agreementService: AgreementService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllAgreemnt();
  }

  //Properties
  public rowData: Array<Agreement> = [];
  public agreementCreated?: AgreementCreateDto;
  public agreementEdited?: AgreementEditDto;

  public agreementNameByDel: string = '';
  public agreementIdByEdit: number = 0;
  public agreementIdByDel: number = 0;

  public agreementPaging: AgreementPaging = {
    status: '',
    quoteNumber: '',
    agreementName: '',
    agreementType: '',
    distributorName: '',
    effectiveDate: undefined,
    expirationDate: undefined,
    createdDate: undefined,
    sorting: 0,
    pageIndex: 1,
    pageSize: 13,
  };
  public statusMemory: string = '';
  public quoteNumberMemory: string = '';
  public agreementNameMemory: string = '';
  public agreementTypeMemory: string = '';
  public distributorNameMemory: string = '';
  public effectiveDateMemory?: string = '';
  public expirationDateMemory?: string = '';
  public createdDateMemory?: string = '';
  public valueToSort?: Sort;
  public checkSort: boolean = false;
  public pageSize: number = 13;
  public pageIndex: number = 1;
  public totalRecord: number = 0;
  public lastPage: number = 0;
  public createForm = this.formBuilder.group({
    status: ['', Validators.required],
    quoteNumber: ['', Validators.required],
    agreementName: ['', Validators.required],
    agreementType: ['', Validators.required],
    distributorName: ['', Validators.required],
    effectiveDate: ['', Validators.required],
    expirationDate: ['', Validators.required],
  });
  public editForm = this.formBuilder.group({
    status: ['', Validators.required],
    quoteNumber: ['', Validators.required],
    agreementName: ['', Validators.required],
    agreementType: ['', Validators.required],
    distributorName: ['', Validators.required],
    effectiveDate: ['', Validators.required],
    expirationDate: ['', Validators.required],
    createdDate: ['', Validators.required],
  });

  public getAllAgreemnt() {
    this.agreementPaging = {
      status: this.statusMemory != '' ? this.statusMemory : '',
      quoteNumber: this.quoteNumberMemory != '' ? this.quoteNumberMemory : '',
      agreementName:
        this.agreementNameMemory != '' ? this.agreementNameMemory : '',
      agreementType:
        this.agreementTypeMemory != '' ? this.agreementTypeMemory : '',
      distributorName:
        this.distributorNameMemory != '' ? this.distributorNameMemory : '',
      effectiveDate:
        this.effectiveDateMemory != ''
          ? new Date(moment(this.effectiveDateMemory).format('MM/DD/yyyy'))
          : undefined,
      expirationDate:
        this.expirationDateMemory != ''
          ? new Date(moment(this.expirationDateMemory).format('MM/DD/yyyy'))
          : undefined,
      createdDate:
        this.createdDateMemory != ''
          ? new Date(moment(this.createdDateMemory).format('MM/DD/yyyy'))
          : undefined,
      sorting: this.valueToSort,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    };

    setTimeout(() => {
      this.agreementService
        .getAgreementsPaginator(this.agreementPaging)
        .subscribe((data) => {
          this.rowData = data.items;
          this.totalRecord = data.totalRecord;
          this.lastPage = Math.ceil(this.totalRecord / this.pageSize);
        });
    }, 500);
  }

  public createdAgreement() {
    var valueForm = this.createForm.value;

    this.agreementCreated = {
      status: valueForm.status,
      quoteNumber: valueForm.quoteNumber,
      agreementName: valueForm.agreementName,
      agreementType: valueForm.agreementType,
      distributorName: valueForm.distributorName,
      effectiveDate: new Date(valueForm.effectiveDate),
      expirationDate: new Date(valueForm.expirationDate),
      createdDate: new Date(),
    };

    this.agreementService
      .postAgreement(this.agreementCreated)
      .subscribe((data) => {
        if (data != null) {
          alertify.success('Created Successful');
          this.getAllAgreemnt();
        }
      });

    //clear form
    this.createForm.reset();
  }

  public updateAgreement() {
    var valueForm = this.editForm.value;

    this.agreementEdited = {
      status: valueForm.status,
      quoteNumber: valueForm.quoteNumber,
      agreementName: valueForm.agreementName,
      agreementType: valueForm.agreementType,
      distributorName: valueForm.distributorName,
      effectiveDate: new Date(valueForm.effectiveDate),
      expirationDate: new Date(valueForm.expirationDate),
      createdDate: new Date(valueForm.createdDate),
    };

    this.agreementService
      .updateAgreement(this.agreementEdited, this.agreementIdByEdit)
      .subscribe();
    alertify.success('Update Successful');
    this.getAllAgreemnt();
  }

  public deleteAgreement() {
    this.agreementService.deleteAgreement(this.agreementIdByDel).subscribe();
    alertify.success('Delete Successful');
    this.getAllAgreemnt();
  }

  public pageIndexChanged(pageIndex: any) {
    this.pageIndex = pageIndex;
    this.getAllAgreemnt();
  }

  public changInputToFilter() {
    this.pageIndex = 1;
    this.getAllAgreemnt();
  }

  public caculateDaysUntilExpiration(dateTime: Date): number {
    //Returns the number of days from dateTime to current date
    return Math.round(
      (new Date(moment(dateTime).format('MM/DD/yyyy')).getTime() -
        new Date().getTime()) /
        (1000 * 3600 * 24)
    );
  }

  public getAgreementName(idAgreement: number) {
    this.agreementService.getAgreementsById(idAgreement).subscribe((data) => {
      if (data) {
        this.agreementNameByDel = data.agreementName;
        this.agreementIdByDel = data.id;
      }
    });
  }

  public getAgreementbyId(idAgreement: number) {
    this.agreementService.getAgreementsById(idAgreement).subscribe((data) => {
      if (data) {
        (this.agreementIdByEdit = data.id),
          (this.editForm = this.formBuilder.group({
            status: [data.status, Validators.required],
            quoteNumber: [data.quoteNumber, Validators.required],
            agreementName: [data.agreementName, Validators.required],
            agreementType: [data.agreementType, Validators.required],
            distributorName: [data.distributorName, Validators.required],
            effectiveDate: [
              formatDate(data.effectiveDate, 'yyyy-MM-dd', 'en'),
              Validators.required,
            ],
            expirationDate: [
              formatDate(data.expirationDate, 'yyyy-MM-dd', 'en'),
              Validators.required,
            ],
            createdDate: [
              formatDate(data.createdDate, 'yyyy-MM-dd', 'en'),
              Validators.required,
            ],
          }));
      }
    });
  }


  public sorting(params: any) {
    switch (params) {
      case 'status':
        if (!this.checkSort) {
          this.checkSort = true;
          this.valueToSort = Sort.AscendingStatus;
        } else {
          this.checkSort = false;
          this.valueToSort = Sort.DescendingStatus;
        }
        break;
      case 'quoteNumber':
        if (!this.checkSort) {
          this.checkSort = true;
          this.valueToSort = Sort.AscendingQuoteNumber;
        } else {
          this.checkSort = false;
          this.valueToSort = Sort.DescendingQuoteNumber;
        }
        break;
      case 'agreementName':
        if (!this.checkSort) {
          this.checkSort = true;
          this.valueToSort = Sort.AscendingAgreementName;
        } else {
          this.checkSort = false;
          this.valueToSort = Sort.DescendingAgreementName;
        }
        break;
      case 'agreementType':
        if (!this.checkSort) {
          this.checkSort = true;
          this.valueToSort = Sort.AscendingAgreementType;
        } else {
          this.checkSort = false;
          this.valueToSort = Sort.DescendingAgreementType;
        }
        break;
      case 'distributorName':
        if (!this.checkSort) {
          this.checkSort = true;
          this.valueToSort = Sort.AscendingDistributorName;
        } else {
          this.checkSort = false;
          this.valueToSort = Sort.DescendingDistributorName;
        }
        break;
      case 'effectiveDate':
        if (!this.checkSort) {
          this.checkSort = true;
          this.valueToSort = Sort.AscendingEffectiveDate;
        } else {
          this.checkSort = false;
          this.valueToSort = Sort.DescendingEffectiveDate;
        }
        break;
      case 'expirationDate':
        if (!this.checkSort) {
          this.checkSort = true;
          this.valueToSort = Sort.AscendingExpirationDate;
        } else {
          this.checkSort = false;
          this.valueToSort = Sort.DescendingExpirationDate;
        }
        break;
      case 'createdDate':
        if (!this.checkSort) {
          this.checkSort = true;
          this.valueToSort = Sort.AscendingCreateDate;
        } else {
          this.checkSort = false;
          this.valueToSort = Sort.DescendingCreateDate;
        }
        break;
    }

    this.getAllAgreemnt();
  }
}
