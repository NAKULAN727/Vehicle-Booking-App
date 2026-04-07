const { NlpManager } = require('node-nlp');

// Create the NLP Manager specifically initialized for English with Neural Network parameters
const manager = new NlpManager({ languages: ['en'], forceNER: true, logLevel: 'warn' });

async function trainChatbotModel() {
  console.log("Training Custom Local NLP Model...");

  // Intent: Greeting
  manager.addDocument('en', 'hi', 'agent.greeting');
  manager.addDocument('en', 'hello', 'agent.greeting');
  manager.addDocument('en', 'hey there', 'agent.greeting');
  manager.addDocument('en', 'good morning', 'agent.greeting');
  manager.addDocument('en', 'good afternoon', 'agent.greeting');

  // Intent: Find General Drivers
  manager.addDocument('en', 'show me drivers', 'driver.find');
  manager.addDocument('en', 'find a driver', 'driver.find');
  manager.addDocument('en', 'who is available', 'driver.find');
  manager.addDocument('en', 'list available drivers', 'driver.find');
  manager.addDocument('en', 'need a driver', 'driver.find');
  manager.addDocument('en', 'any driver around', 'driver.find');

  // Intent: Find Experienced Drivers
  manager.addDocument('en', 'experienced driver', 'driver.experience');
  manager.addDocument('en', 'driver with experience', 'driver.experience');
  manager.addDocument('en', 'who is the most experienced', 'driver.experience');
  manager.addDocument('en', 'highly trained driver', 'driver.experience');
  manager.addDocument('en', 'best driver', 'driver.experience');
  manager.addDocument('en', 'i want a senior driver', 'driver.experience');

  // Intent: Find Drivers with Cars
  manager.addDocument('en', 'driver with a car', 'driver.car');
  manager.addDocument('en', 'need a cab', 'driver.car');
  manager.addDocument('en', 'find an suv', 'driver.car');
  manager.addDocument('en', 'sedan or hatchback', 'driver.car');
  manager.addDocument('en', 'book a vehicle', 'driver.car');
  manager.addDocument('en', 'need a ride with a car', 'driver.car');

  // Intent: Check Bookings
  manager.addDocument('en', 'check my booking', 'booking.check');
  manager.addDocument('en', 'my trips', 'booking.check');
  manager.addDocument('en', 'ride history', 'booking.check');
  manager.addDocument('en', 'what is the status of my ride', 'booking.check');
  manager.addDocument('en', 'show bookings', 'booking.check');

  // Intent: Instructions to process a booking
  manager.addDocument('en', 'how to book', 'booking.help');
  manager.addDocument('en', 'how do i reserve', 'booking.help');
  manager.addDocument('en', 'booking process', 'booking.help');
  manager.addDocument('en', 'how to hire', 'booking.help');

  // Intent: General Help
  manager.addDocument('en', 'help me', 'agent.help');
  manager.addDocument('en', 'what can you do', 'agent.help');
  manager.addDocument('en', 'options', 'agent.help');
  manager.addDocument('en', 'support', 'agent.help');

  // Train and save the NLP Network model
  await manager.train();
  manager.save();
  console.log("✅ Custom Neural NLP Model successfully trained and mapped!");
}

module.exports = {
  manager,
  trainChatbotModel
};
