import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AgreementCreateDto } from '../models/agreement-create-dto.model';
import { AgreementEditDto } from '../models/agreement-edit-dto.model';
import { AgreementPaging } from '../models/agreement-paging.model';
import { Agreement } from '../models/agreement.model';
import { PageVM } from '../models/page-vm.model';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {
  private REST_API_SERVER = environment.api;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) { }

  public getAllAgreements(): Observable<Agreement[]> {
    const url = `${this.REST_API_SERVER}/api/Agreement`;
    return this.httpClient.get<Agreement[]>(url, this.httpOptions);
  }
  public getAgreementsById(idAgreement: number): Observable<Agreement> {
    const url = `${this.REST_API_SERVER}/api/Agreement/`+idAgreement;
    return this.httpClient.get<Agreement>(url, this.httpOptions);
  }
  public postAgreement(agreement: AgreementCreateDto): Observable<Agreement> {
    const url = `${this.REST_API_SERVER}/api/Agreement`;
    console.log(agreement);
    return this.httpClient.post<Agreement>(url, agreement, this.httpOptions);
  }
  public updateAgreement(agreement: AgreementEditDto, idAgreement: number): Observable<boolean> {
    const url = `${this.REST_API_SERVER}/api/Agreement/` + idAgreement;
    return this.httpClient.put<boolean>(url, agreement, this.httpOptions);
  }
  public deleteAgreement(idAgreement: number): Observable<boolean> {
    const url = `${this.REST_API_SERVER}/api/Agreement/` + idAgreement;
    return this.httpClient.delete<boolean>(url, this.httpOptions);
  }
  public getAgreementsPaginator(agreementPaginator: AgreementPaging): Observable<PageVM> {
    const url = `${this.REST_API_SERVER}/api/Agreement/paging?Status=` + agreementPaginator.status
      + `&QuoteNumber=` + agreementPaginator.quoteNumber
      + `&AgreementName=` + agreementPaginator.agreementName
      + `&AgreementType=` + agreementPaginator.agreementType
      + `&DistributorName=` + agreementPaginator.distributorName
      + `&EffectiveDate=` + (agreementPaginator.effectiveDate === undefined ? "" : formatDate(agreementPaginator.effectiveDate, 'yyyy-MM-dd', 'en'))
      + `&ExpirationDate=` + (agreementPaginator.expirationDate === undefined ? "" : formatDate(agreementPaginator.expirationDate, 'yyyy-MM-dd', 'en'))
      + `&CreatedDate=` + (agreementPaginator.createdDate === undefined ? "" : formatDate(agreementPaginator.createdDate, 'yyyy-MM-dd', 'en'))
      + `&Sorting=` + (agreementPaginator.sorting === undefined ? "" : agreementPaginator.sorting)
      + `&PageIndex=` + agreementPaginator.pageIndex
      + `&PageSize=` + agreementPaginator.pageSize + ``;
    return this.httpClient.get<PageVM>(url, this.httpOptions);
  }
}
