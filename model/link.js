const mongoose = require('mongoose');

let link = new mongoose.Schema({
    id: String,
    link: String,
});

let link_per_ad = mongoose.model('link_per_ad', link);

module.exports = link_per_ad;