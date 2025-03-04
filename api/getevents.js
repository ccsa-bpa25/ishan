const { createClient } = require('@supabase/supabase-js');
const bcryptjs = require('bcryptjs');

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);


module.exports = async (req, res) => {
    console.log("This message will appear in the console.");

  if (req.method === 'POST') {
    const { emonth, eyear } = req.body;
      const edateval=eyear+"-"+emonth+"%";


    try {
      // Check if the user exists in the 'users' table
      const { data, error } = await supabase
        .from('events')
        .select()
      .like('eventdate','2025%');
        //.eq('username', username)
        //.();

      if (error) {
        console.error('Supabase error:', error.message);
        return res.status(400).json({ error: 'Invalid username or password.' });
      }

      // If password matches, return a success message
                const dataArray = data;
        console.log('Data stored in array:', dataArray);
        return res.status(200).json({ message: data });
        

    } catch (err) {
      console.error('Error during login:', err.message);
      return res.status(500).json({ error: 'Database error.' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }
};
