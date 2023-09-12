import { Db, MongoClient } from "mongodb";
import { MAILING_LIST_STATUS } from "shared/models/mailingList.model";

export const up = async (db: Db, _client: MongoClient) => {
  const jobs = await db.collection("jobs").find({ name: "generate:mailing-list" }).toArray();

  await Promise.all(
    jobs.map(async (job) => {
      db.collection("mailingLists").insertOne({
        source: job.payload.source,
        document_id: job.payload.document_id,
        added_by: job.payload.user_id,
        status: MAILING_LIST_STATUS.DONE,
        campaign_name: "Voeux affelnet",
        email: "mail_responsable_1",
        secondary_email: "mail_responsable_2",
        identifier_columns: ["email", "nom_eleve", "prenom_eleve"],
        output_columns: [
          { column: "email", output: "email", grouped: false },
          { column: "nom_eleve", output: "nom_eleve", grouped: false },
          { column: "prenom_eleve", output: "prenom_eleve", grouped: false },
          {
            column: "libelle_etab_accueil",
            output: "libelle_etab_accueil",
            grouped: true,
          },
          {
            column: "libelle_formation",
            output: "libelle_formation",
            grouped: true,
          },
          {
            column: "lien_prdv",
            output: "lien_prdv",
            grouped: true,
          },
          {
            column: "lien_lba",
            output: "lien_lba",
            grouped: true,
          },
        ],
        updated_at: job.updated_at,
        created_at: job.created_at,
      });
    })
  );
};

export const down = async (_db: Db, _client: MongoClient) => {
  // TODO write the statements to rollback your migration (if possible)
  // Example:
  // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
};
