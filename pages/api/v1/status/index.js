import database from "infra/database";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const dataBaseVersionResult = await database.query("SHOW server_version;");
  const dataBaseVersionValue = dataBaseVersionResult.rows[0].server_version;

  const dataBaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );

  const dataBaseMaxConnectionsValue =
    dataBaseMaxConnectionsResult.rows[0].max_connections;

  const dataBaseOpenedConnectionsResult = await database.query({
    text: `SELECT count(*)::int FROM pg_stat_activity where datname = $1;`,
    values: [process.env.POSTGRES_DB],
  });

  const dataBaseOpenedConnectionsValue =
    dataBaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: dataBaseVersionValue,
        max_connections: parseInt(dataBaseMaxConnectionsValue),
        opened_connections: dataBaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
