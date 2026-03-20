const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,  // database name
  process.env.MYSQLUSER,      // username
  process.env.MYSQLPASSWORD,  // password
  {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    dialect: 'mysql',
    logging: false
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };