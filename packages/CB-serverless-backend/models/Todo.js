const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({  
  title: String,
  description: String,
  dueDate: Date,
  userId: String,
});

export default () => {
  return mongoose
}
export default mongoose.model('Todo', TodoSchema);