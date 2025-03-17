const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    
    const { title, details, ev_id } = req.body;

  
    try {
 
      // Insert user data into the PostgreSQL database (additional table in Supabase)
      const { data, error: dbError } = await supabase
        .from('events')
        .update({
        name: title, // Dynamic value from request body
        description: details  // Dynamic value from request body
      })
      .eq('id', ev_id);
        
      if (dbError) {
        console.error('Error updating the database:', dbError);
        return res.status(500).json({ error: 'Error updating event into database.', details: dbError });
      }

      // Send a success response
      return res.status(201).json({ message: 'Event registered successfully!', user: data });
    } catch (err) {
      console.error('Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error.' });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }
};
