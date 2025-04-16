const Datastore = require('nedb');

const bookingsDB = new Datastore({ filename: './data/bookings.db', autoload: true });

const testBooking = {
  name: 'Test User',
  email: 'test@example.com',
  courseId: 'bE3I2iNrn2ry1pfP'
};

bookingsDB.insert(testBooking, (err, newDoc) => {
  if (err) {
    console.error('Failed to insert test booking:', err);
  } else {
    console.log('Inserted test booking:', newDoc);
  }
});