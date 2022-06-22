import { Sort } from "../shared/enums/sort.model";


export interface AgreementPaging {
  status:string;
  quoteNumber:string;
  agreementName:string;
  agreementType:string;
  distributorName:string;
  effectiveDate?:Date;
  expirationDate?:Date;
  createdDate?:Date;
  sorting?:Sort;
  pageIndex:number;
  pageSize:number;
}
