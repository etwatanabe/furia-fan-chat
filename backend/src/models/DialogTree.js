const mongoose = require('mongoose');

// Esquema principal da árvore de diálogo
const DialogTreeSchema = new mongoose.Schema({
  treeId: {
    type: String,
    default: 'main',
    unique: true,
    index: true
  },
  teamName: {
    type: String,
    default: 'FURIA'
  },
  nodes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const DialogTree = mongoose.model('DialogTree', DialogTreeSchema);

module.exports = DialogTree;