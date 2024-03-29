export type Permission = "admin" | "support";

export type RoleNames = "none" | "admin" | "support";

export interface Role {
  name: RoleNames;
  permissions: Permission[];
}

export const NoneRole = {
  name: "none",
  permissions: [],
} satisfies Role;

export const SupportRole = {
  name: "support",
  permissions: ["support"],
} satisfies Role;

export const AdminRole = {
  name: "admin",
  permissions: ["admin"],
} satisfies Role;

export type AccessPermission =
  | Permission
  | { some: ReadonlyArray<AccessPermission> }
  | { every: ReadonlyArray<AccessPermission> };

export type AccessResourcePath = {
  type: "params" | "query";
  key: string;
};

export type AccessRessouces = {
  events?: ReadonlyArray<{
    _id: AccessResourcePath;
  }>;
  users?: ReadonlyArray<{
    _id: AccessResourcePath;
  }>;
};

export type UserWithType<T, V> = Readonly<{
  type: T;
  value: V;
}>;
