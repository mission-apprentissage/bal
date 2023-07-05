/* eslint-disable */

db.getSiblingDB("admin").createUser({
  user: "mna-bal",
  pwd: "{{ vault[env_type].MNA_BAL_MONGODB_USER_PASSWORD }}",
  roles: [{ role: "dbOwner", db: "mna-bal" }],
});

db.getSiblingDB("admin").createUser({
  user: "backup",
  pwd: "{{ vault[env_type].MNA_BAL_MONGODB_BACKUP_PASSWORD }}",
  roles: [
    { role: "backup", db: "admin" },
    { role: "restore", db: "admin" },
  ],
});

db.getSiblingDB("admin").createUser({
  user: "metabase",
  pwd: "{{ vault[env_type].MNA_BAL_MONGODB_METABASE_PASSWORD }}",
  roles: [{ role: "readAnyDatabase", db: "admin" }],
});
