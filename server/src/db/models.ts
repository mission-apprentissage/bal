import { IModelDescriptor } from "shared/models/common";
import documentsModelDescriptor from "shared/models/document.model";
import documentContentsModelDescriptor from "shared/models/documentContent.model";
import eventsModelDescriptor from "shared/models/events/event.model";
import jobsModelDescriptor from "shared/models/job.model";
import organisationsModelDescriptor from "shared/models/organisation.model";
import personsModelDescriptor from "shared/models/person.model";
import sessionsModelDescriptor from "shared/models/session.model";
import usersModelDescriptor from "shared/models/user.model";

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
