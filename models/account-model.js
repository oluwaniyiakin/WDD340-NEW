const pool = require("../database/")

exports.getAccountById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM accounts WHERE account_id = ?", [id]);
  return rows[0];
};

exports.updateAccount = async (id, first_name, last_name, email) => {
  const [result] = await pool.query(
      "UPDATE accounts SET first_name = ?, last_name = ?, email = ? WHERE account_id = ?",
      [first_name, last_name, email, id]
  );
  return result.affectedRows > 0;
};

exports.updatePassword = async (id, hashedPassword) => {
  const [result] = await pool.query(
      "UPDATE accounts SET password = ? WHERE account_id = ?",
      [hashedPassword, id]
  );
  return result.affectedRows > 0;
};
/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}
/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1";
      const email = await pool.query(sql, [account_email]);
      return email.rowCount; // Returns number of rows found (0 or 1)
    } catch (error) {
      return error.message;
    }
  }
  module.exports = {
    checkExistingEmail,
    // Other existing functions...
  };
    
/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

module.exports = { getAccountByEmail };



