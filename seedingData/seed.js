const fs = require('fs');
const csv = require('csv-parser');
const { client } = require("../src/db")
const bcrypt = require('bcryptjs');

// const files = ['users.csv', 'qualifyData.csv', 'tutor.csv',image.csv, time.csv];
const files = ['time.csv'];

async function readCsv(file) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function seedData() {
  try {
    for (const file of files) {
      const data = await readCsv(file);
      console.log(`Read data from file ${file}:`, data);
      await addTime(data);
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await client.end();
  }
}

async function insertDataToDatabase(data) {
  try {
    for (const row of data) {
      const hashedPassword = await bcrypt.hash(row.password, 10);

      const query = 'INSERT INTO users (name, email, password, roles, persona, qualify, image, time) VALUES ($1, $2, $3, $4, $5,$6,$7,$8)';
      const values = [row.name, row.email, hashedPassword, row.roles, row.persona, row.qualify, row.image, row.time];
      await client.query(query, values);
    }

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

async function addImage(data) {
  try {
    for (const row of data) {
     

      const query = 'INSERT INTO image (use_id, ima) VALUES ($1, $2)';
      const values = [row.use_id, row.ima];
      await client.query(query, values);
    }

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

async function addTime(data) {
  try {
    for (const row of data) {
     

      const query = 'INSERT INTO time_slots (user_id,day,start_time,value) VALUES ($1, $2, $3, $4)';
      const values = [row.user_id,row.day,row.start_time,row.value];
      await client.query(query, values);
    }

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}


async function reviews(review) {
  try {
    for (const row of review) {
      const insertDataQuery = `
        INSERT INTO reviews (s_reg_id, t_reg_id, comment, rating, c_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING * `;
      const insertDataValues = [
        row.s_reg_id,
        row.t_reg_id,
        row.comment,
        row.rating,
        row.c_id
      ];
      await client.query(insertDataQuery, insertDataValues);
      console.log('Student data inserted');
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}


async function addNewStudent(studentData) {
  try {
    for (const student of studentData) {
      const insertDataQuery = `
        INSERT INTO student_info (s_address, s_number, s_reg_id, s_lname, s_fname, s_city, s_gender)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING * `;
      const insertDataValues = [
        student.s_address,
        student.s_number,
        student.s_reg_id,
        student.s_lname,
        student.s_fname,
        student.s_city,
        student.s_gender,
      ];
      await client.query(insertDataQuery, insertDataValues);
      console.log('Student data inserted');
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

async function addNewQualify(qualifyData) {
  try {
    for (const qualify of qualifyData) {
      const insertData = `
        INSERT INTO qualify_info (t_degree, t_degreetype, t_degreeyear, t_institute, t_reg_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;
      const insertValue = [
        qualify.t_degree,
        qualify.t_degreetype,
        qualify.t_degreeyear,
        qualify.t_institute,
        qualify.t_reg_id,
      ];
      await client.query(insertData, insertValue);
      console.log('Qualify data inserted');
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

async function addNewTutor(tutorData) {
  try {
    for (const tutor of tutorData) {
      const insertData = `
        INSERT INTO tutor_info (t_name, t_lname, t_address, t_city, t_gender, t_reg_id,number,subject,price,about,longitude,latitude)
        VALUES ($1, $2, $3, $4, $5, $6,$7, $8, $9, $10, $11, $12)
        RETURNING *`;
      const insertValue = [
        tutor.t_name,
        tutor.t_lname,
        tutor.t_address,
        tutor.t_city,
        tutor.t_gender,
        tutor.t_reg_id,
        tutor.number,
        tutor.subject,
        tutor.price,
        tutor.about,
        tutor.longitude,
        tutor.latitude
      ];
      await client.query(insertData, insertValue);
      console.log('Tutor data inserted');
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}


seedData();
