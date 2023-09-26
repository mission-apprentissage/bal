import { IModelDescriptor } from "./common";
import documentsModelDescriptor, { IDocument } from "./document.model";
import jobsModelDescriptor, { IJob } from "./job.model";
import sessionsModelDescriptor, { ISession } from "./session.model";
import usersModelDescriptor, { IUser } from "./user.model";

export const modelDescriptors: IModelDescriptor[] = [
  usersModelDescriptor,
  jobsModelDescriptor,
  sessionsModelDescriptor,
  documentsModelDescriptor,
];

export type IDocumentMap = {
  users: IUser;
  jobs: IJob;
  sessions: ISession;
  documents: IDocument;
};
