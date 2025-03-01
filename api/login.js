const { createClient } = require('@supabase/supabase-js');
const bcryptjs = require('bcryptjs');

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);


module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
      // Check if the user exists in the 'users' table
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Supabase error:', error.message);
        return res.status(400).json({ error: 'Invalid username or password.' });
      }

      if (!user) {
        return res.status(400).json({ error: 'Invalid username or password.' });
      }

      // Compare the password with the hashed password in the database
      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid username or password.' });
      }

      // If password matches, return a success message
      return res.status(200).json({ message: 'Login successful!' });

    } catch (err) {
      console.error('Error during login:', err.message);
      return res.status(500).json({ error: 'Database error.' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }
};
