import documentsModelDescriptor from "shared/models/document.model";
import sessionsModelDescriptor from "shared/models/session.model";
import usersModelDescriptor from "shared/models/user.model";

export interface IModelDescriptor {
  schema: unknown;
  indexes: unknown;
  collectionName: string;
}

export const modelDescriptors: IModelDescriptor[] = [
  usersModelDescriptor,
  sessionsModelDescriptor,
  documentsModelDescriptor,
];
