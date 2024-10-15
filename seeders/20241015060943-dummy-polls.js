'use strict';

/** @type {import('sequelize-cli').Migration} */

const pollsData = [
  {
    title: "Favorite Country?",
    options: ["India", "UK", "US", "UAE"]
  },
  {
    title: "Best Programming Language?",
    options: ["JavaScript", "Python", "Java", "C++"]
  },
  {
    title: "Favorite Food?",
    options: ["Pizza", "Sushi", "Biryani", "Burgers"]
  },
  {
    title: "Preferred Mode of Transport?",
    options: ["Car", "Bike", "Bus", "Train"]
  },
  {
    title: "Best Sport?",
    options: ["Cricket", "Football", "Basketball", "Tennis"]
  },
  {
    title: "Favorite Music Genre?",
    options: ["Rock", "Pop", "Classical", "Jazz"]
  },
  {
    title: "Best Movie Genre?",
    options: ["Action", "Drama", "Comedy", "Thriller"]
  },
  {
    title: "Preferred Social Media?",
    options: ["Facebook", "Instagram", "Twitter", "LinkedIn"]
  },
  {
    title: "Best OS for Development?",
    options: ["Windows", "macOS", "Linux", "Ubuntu"]
  },
  {
    title: "Favorite Animal?",
    options: ["Dog", "Cat", "Lion", "Elephant"]
  }
];
module.exports = {
  async up(queryInterface, Sequelize) {
    const polls = [];
    const options = [];

    // Loop through the pollsData to create polls and options
    pollsData.forEach((poll, index) => {
      const pollIndex = index + 1; // poll_id starting from 1
      polls.push({
        title: poll.title,
        created_at: new Date(),
      });

      // Loop through options for each poll
      poll.options.forEach(optionText => {
        options.push({
          option_text: optionText,
          poll_id: pollIndex, // Use the poll's index as poll_id
        });
      });
    });

    // Bulk create polls and options
    await queryInterface.bulkInsert('polls', polls);
    await queryInterface.bulkInsert('options', options);
  },

  async down(queryInterface, Sequelize) {
    // Rollback by deleting the inserted options and polls
    await queryInterface.bulkDelete('options', null, {});
    await queryInterface.bulkDelete('polls', null, {});
  },
};