const connectDB = async () => {
  try {
    console.log('🔍 Attempting database connection...');
    console.log('📊 DB Config:', {
      database: process.env.MYSQLDATABASE,
      user: process.env.MYSQLUSER,
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      password: process.env.MYSQLPASSWORD ? '***' : 'MISSING'
    });
    
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};