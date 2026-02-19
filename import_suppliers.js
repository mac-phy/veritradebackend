const fs = require('fs');
const csv = require('csv-parser');
const { sequelize } = require('./config/db');
const Supplier = require('./models/Supplier');

const importSuppliers = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const suppliers = [];
    const seenRegistrationNumbers = new Set();
    
    fs.createReadStream('suppliers_data.csv')
      .pipe(csv())  // Removed separator - let it auto-detect
      .on('data', (row) => {
        // Skip if registration number is duplicate
        if (seenRegistrationNumbers.has(row.registration_number)) {
          return;
        }
        seenRegistrationNumbers.add(row.registration_number);

        suppliers.push({
          supplier_id: row.supplier_id || null,
          business_name: row.business_name || 'Unknown',
          registration_number: row.registration_number,
          status: row.status === 'registered' ? 'registered' : 'not_found',
          registration_date: row.registration_date || null,
          business_type: row.business_type || null,
          industry_category: row.industry_category || null,
          state: row.state || null,
          verification_status: row.verification_status || null,
          verification_reason: row.verification_reason || null
        });
      })
      .on('end', async () => {
        console.log(`📄 CSV file read complete. Found ${suppliers.length} unique records.`);
        console.log('⏳ Importing into database...');
        
        // Clear existing data first
        await Supplier.destroy({ where: {} });
        
        // Import in batches
        const batchSize = 500;
        for (let i = 0; i < suppliers.length; i += batchSize) {
          const batch = suppliers.slice(i, i + batchSize);
          await Supplier.bulkCreate(batch, { 
            validate: true,
            ignoreDuplicates: true
          });
          console.log(`✅ Imported batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(suppliers.length/batchSize)}`);
        }
        
        const count = await Supplier.count();
        console.log(`✅ Import complete! Total suppliers in database: ${count}`);
        process.exit(0);
      })
      .on('error', (error) => {
        console.error('❌ CSV parsing error:', error.message);
        process.exit(1);
      });
      
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

importSuppliers();