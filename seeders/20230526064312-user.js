'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) { 
    await queryInterface.bulkInsert('users', [
    {
    nama: 'johan',
    email: 'johan@gmail.com',
    password: '459395'
    },{
      nama: 'sahara',
      email: 'sahara@gmail.com',
      password: '352355'
      },{
        nama: 'raul',
        email: 'raul@gmail.com',
        password: '5457765'
        },{
          nama: 'rabani',
          email: 'rabani@gmail.com',
          password: '3454546'
          },{
            nama: 'parlay',
            email: 'parlay@gmail.com',
            password: '1232444'
            },{
              nama: 'pepen',
              email: 'pepen@gmail.com',
              password: '54765765'
              },{
                nama: 'milea',
                email: 'milea@gmail.com',
                password: '54556365'
                },{
                  nama: 'anhar',
                  email: 'anhar@gmail.com',
                  password: '2357765'
                  },{
                    nama: 'zuchri',
                    email: 'zuchri@gmail.com',
                    password: '54342765'
                    },{
                      nama: 'ramon',
                      email: 'ramon@gmail.com',
                      password: '5457765'
                      }
  ], {});
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  
  }
};
