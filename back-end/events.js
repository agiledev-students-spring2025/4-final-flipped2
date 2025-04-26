import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }  // Format: HH:mm
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
