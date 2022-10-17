const createOrSelectUser = async (client, username) => {
  try {
    const user = await client.query(
      `
              WITH s AS (
                SELECT id, name
                FROM users
                WHERE name = ($1) 
            ), i AS (
                INSERT INTO users (name)
                SELECT CAST($1 AS VARCHAR)
                WHERE NOT EXISTS (SELECT 1 FROM s)
                RETURNING id, name
            )
            SELECT id, name
            FROM i
            UNION ALL
            SELECT id, name
            FROM s
            `,
      [username]
    );
    return user.rows[0];
  } catch (e) {
    console.log(e, "err");
    return null;
  }
};

module.exports = createOrSelectUser;
