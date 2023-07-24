import { IModelDescriptor } from "./common";
import documentsModelDescriptor, { IDocumentDocument } from "./document.model";
import documentContentsModelDescriptor, {
  IDocumentContentDocument,
} from "./documentContent.model";
import eventsModelDescriptor, { IEventDocument } from "./events/event.model";
import jobsModelDescriptor, { IJobDocument } from "./job.model";
import organisationsModelDescriptor, {
  IOrganisationDocument,
} from "./organisation.model";
import personsModelDescriptor, { IPersonDocument } from "./person.model";
import sessionsModelDescriptor, { ISessionDocument } from "./session.model";
import usersModelDescriptor, { IUserDocument } from "./user.model";

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
  users: IUserDocument;
  jobs: IJobDocument;
  organisations: IOrganisationDocument;
  persons: IPersonDocument;
  events: IEventDocument;
  sessions: ISessionDocument;
  documents: IDocumentDocument;
  documentContents: IDocumentContentDocument;
};
