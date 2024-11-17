
const oracledb = require('oracledb');
async function runApp()
{
  let connection;
  try {
    connection = await oracledb.getConnection({ user: "PROGEXAMENES", password: "Duocvalparaiso.123", connectionString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.sa-santiago-1.oraclecloud.com))(connect_data=(service_name=g762b87be595938_programacionexamenes_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))" });
    const result = await connection.execute(`SELECT * FROM prueba`);
    console.dir(result.rows, { depth: null });
  } catch (err) {
    console.error(err);
  } finally {
    if (connection)
      {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
      }
    }
  }
}
runApp();