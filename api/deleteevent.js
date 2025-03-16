const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
      //alert(username);
      //alert(password);
      //alert(Date);
    const { ev_id } = req.body;

    // Validate that username and password are provided
    //if (!username || !password) {
      //return res.status(400).json({ error: 'Username and password are required.' });
    //}

    try {
      // Check if the username already exists in the PostgreSQL 'users' table
     /* const { data: existingUser, error: authError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists.' });
      }

      // Hash the password for PostgreSQL storage (if needed)
      const hashedPassword = await bcrypt.hash(password, 10);
*/
      // Insert user data into the PostgreSQL database (additional table in Supabase)
      const { data, error: dbError } = await supabase
        .from('events')
        .delete()
        .eq('id',ev_id)
      
      if (dbError) {
        console.error('Error deleting from the database:', dbError);
        return res.status(500).json({ error: 'Error deleting event from the database.', details: dbError });
      }

      // Send a success response
      return res.status(201).json({ message: 'Event deleted successfully!', user: data });
    } catch (err) {
      console.error('Error:', err.message);
      return res.status(500).json({ error: 'Internal Server Error.' });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }
};
