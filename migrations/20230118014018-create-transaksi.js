'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaksi', {
      id_transaksi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tgl_transaksi: {
        //type: Sequelize.TIMESTAMP
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
        allowNull: false
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id_user"
        }
      },
      id_meja: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "meja",
          key: "id_meja"
        }
      },
      nama_pelanggan: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('belum_bayar','lunas')
      },
      total: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaksi');
  }
};