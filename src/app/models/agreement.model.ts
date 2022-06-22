export interface Agreement{
  id:number;
  status:string;
  quoteNumber:string;
  agreementName:string;
  agreementType:string;
  distributorName:string;
  effectiveDate:Date;
  expirationDate:Date;
  createdDate:Date;
}
