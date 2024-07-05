import catalogueEmailSiretDescriptor, { ICatalogueEmailSiret } from "./catalogueEmailSiret.model";
import { IModelDescriptor } from "./common";
import decaModelDescriptor, { IDeca } from "./deca.model/deca.model";
import decaHistoryModelDescriptor, { IDecaHistory } from "./deca.model/decaHistory.model";
import decaImportJobResultModelDescriptor, { IDecaImportJobResult } from "./deca.model/decaImportJobResult.model";
import documentsModelDescriptor, { IDocument } from "./document.model";
import documentContentsModelDescriptor, { IDocumentContent } from "./documentContent.model";
import emailDeniedModelDescriptor, { IEmailDenied } from "./emailDenied.model";
import eventsModelDescriptor, { IEvent } from "./events/event.model";
import mailingListModelDescriptor, { IMailingList } from "./mailingList.model";
import organisationsModelDescriptor, { IOrganisation } from "./organisation.model";
import personsModelDescriptor, { IPerson } from "./person.model";
import sessionsModelDescriptor, { ISession } from "./session.model";
import usersModelDescriptor, { IUser } from "./user.model";

export const modelDescriptors: IModelDescriptor[] = [
  usersModelDescriptor,
  organisationsModelDescriptor,
  personsModelDescriptor,
  eventsModelDescriptor,
  sessionsModelDescriptor,
  documentsModelDescriptor,
  documentContentsModelDescriptor,
  emailDeniedModelDescriptor,
  decaModelDescriptor,
  decaHistoryModelDescriptor,
  decaImportJobResultModelDescriptor,
  mailingListModelDescriptor,
  catalogueEmailSiretDescriptor,
];

export type IDocumentMap = {
  users: IUser;
  organisations: IOrganisation;
  persons: IPerson;
  events: IEvent;
  sessions: ISession;
  documents: IDocument;
  documentContents: IDocumentContent;
  mailingLists: IMailingList;
  emailDenied: IEmailDenied;
  deca: IDeca;
  decaHistory: IDecaHistory;
  decaImportJobResult: IDecaImportJobResult;
  catalogueEmailSirets: ICatalogueEmailSiret;
};
