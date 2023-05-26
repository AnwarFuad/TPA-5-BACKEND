'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('todos', [{
     title: 'Belajar Sequelize',
     deskripsi: 'mencoba mempraktikan sequelize masing masing'
     },{
      title: 'Mempelajari Docker',
      deskripsi: 'Menginstall docker dan mencobanya'
     },
     {
      title:'Tugas TPA-4',
      deskripsi:'Membuat database tentan online retail'
     },
     {
      title: 'Tugas TPA-5',
      deskripsi:'Membuat web service restful api dengan express.js'
     }
    ], {});
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('People', null, {});
  
  }
};
