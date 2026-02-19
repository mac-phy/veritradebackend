const fs = require('fs');
const csv = require('csv-parser');
const { sequelize } = require('./config/db');
const Supplier = require('./models/Supplier');

const importSuppliers = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const suppliers = [];
    
    fs.createReadStream('suppliers_data.csv')
      .pipe(csv({ separator: '\t' }))  // Tab-separated based on your CSV
      .on('data', (row) => {
        suppliers.push({
          supplier_id: row.supplier_id,
          business_name: row.business_name,
          registration_number: row.registration_number,
          status: row.status === 'registered' ? 'registered' : 'not_found',
          registration_date: row.registration_date || null,
          business_type: row.business_type,
          industry_category: row.industry_category,
          state: row.state,
          verification_status: row.verification_status,
          verification_reason: row.verification_reason
        });
      })
      .on('end', async () => {
        console.log(`📄 CSV file read complete. Found ${suppliers.length} records.`);
        console.log('⏳ Importing into database...');
        
        await Supplier.bulkCreate(suppliers, { 
          ignoreDuplicates: true
        });
        
        const count = await Supplier.count();
        console.log(`✅ Import complete! Total suppliers in database: ${count}`);
        process.exit(0);
      });
      
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

importSuppliers();