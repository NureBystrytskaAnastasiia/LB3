const { query } = require('./db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function createUser({ first_name, email, password, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user_id = uuidv4();

  await query`
    INSERT INTO Users (user_id, first_name, email, password, role)
    VALUES (${user_id}, ${first_name}, ${email}, ${hashedPassword}, ${role})
  `;

  return user_id;
}

async function findUserByEmail(email) {
  const result = await query`SELECT * FROM Users WHERE email = ${email}`;
  return result.recordset[0];
}

async function getUserById(user_id) {
  const result = await query`SELECT * FROM Users WHERE user_id = ${user_id}`;
  return result.recordset[0];
}

module.exports = { createUser, findUserByEmail, getUserById };