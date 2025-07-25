import type { BouncerDomain } from "./bouncer.domain.model";
import { bouncerDomailModelDescriptor } from "./bouncer.domain.model";
import type { BouncerEmail } from "./bouncer.email.model";
import { bouncerEmailModelDescriptor } from "./bouncer.email.model";
import type { ICatalogueEmailSiret } from "./catalogueEmailSiret.model";
import catalogueEmailSiretDescriptor from "./catalogueEmailSiret.model";
import type { IModelDescriptor } from "./common";
import type { ILbaEmailBlacklist } from "./data/lba.emailBlacklist.model";
import lbaEmailBlackListedModelDescriptor from "./data/lba.emailBlacklist.model";
import type { ILbaRecruteursSiretEmail } from "./data/lba.recruteurs.siret.email.model";
import lbaRecruteursSiretEmailModelDescriptor from "./data/lba.recruteurs.siret.email.model";
import type { IDeca } from "./deca.model/deca.model";
import decaModelDescriptor from "./deca.model/deca.model";
import type { IDecaHistory } from "./deca.model/decaHistory.model";
import decaHistoryModelDescriptor from "./deca.model/decaHistory.model";
import type { IDecaImportJobResult } from "./deca.model/decaImportJobResult.model";
import decaImportJobResultModelDescriptor from "./deca.model/decaImportJobResult.model";
import type { IDocument } from "./document.model";
import documentsModelDescriptor from "./document.model";
import type { IDocumentContent } from "./documentContent.model";
import documentContentsModelDescriptor from "./documentContent.model";
import type { IEmailDenied } from "./emailDenied.model";
import emailDeniedModelDescriptor from "./emailDenied.model";
import type { IEvent } from "./events/event.model";
import eventsModelDescriptor from "./events/event.model";
import type { IMailingList } from "./mailingList.model";
import mailingListModelDescriptor from "./mailingList.model";
import type { IOrganisation } from "./organisation.model";
import organisationsModelDescriptor from "./organisation.model";
import type { IPerson } from "./person.model";
import personsModelDescriptor from "./person.model";
import type { ISession } from "./session.model";
import sessionsModelDescriptor from "./session.model";
import type { IUser } from "./user.model";
import usersModelDescriptor from "./user.model";

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
  bouncerEmailModelDescriptor,
  bouncerDomailModelDescriptor,
  lbaEmailBlackListedModelDescriptor,
  lbaRecruteursSiretEmailModelDescriptor,
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
  ["deca.import.job.result"]: IDecaImportJobResult;
  catalogueEmailSirets: ICatalogueEmailSiret;
  ["bouncer.email"]: BouncerEmail;
  ["bouncer.domain"]: BouncerDomain;
  ["lba.emailblacklists"]: ILbaEmailBlacklist;
  ["lba.recruteurs.siret.email"]: ILbaRecruteursSiretEmail;
};
