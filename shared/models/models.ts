import { IModelDescriptor } from "./common";
import documentsModelDescriptor, { IDocument } from "./document.model";
import documentContentsModelDescriptor, {
  IDocumentContent,
} from "./documentContent.model";
import eventsModelDescriptor, { IEvent } from "./events/event.model";
import jobsModelDescriptor, { IJob } from "./job.model";
import organisationsModelDescriptor, {
  IOrganisation,
} from "./organisation.model";
import personsModelDescriptor, { IPerson } from "./person.model";
import sessionsModelDescriptor, { ISession } from "./session.model";
import usersModelDescriptor, { IUser } from "./user.model";

export const modelDescriptors: IModelDescriptor[] = [
  usersModelDescriptor,
  jobsModelDescriptor,
  organisationsModelDescriptor,
  personsModelDescriptor,
  eventsModelDescriptor,
  sessionsModelDescriptor,
  documentsModelDescriptor,
  documentContentsModelDescriptor,
];

export type IDocumentMap = {
  users: IUser;
  jobs: IJob;
  organisations: IOrganisation;
  persons: IPerson;
  events: IEvent;
  sessions: ISession;
  documents: IDocument;
  documentContents: IDocumentContent;
};
