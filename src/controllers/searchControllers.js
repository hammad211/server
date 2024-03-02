const { client } = require('../db');

const getSearchResult = async (req, res) => {
  try {
    const { subject, location } = req.body;

    if (subject && location) {
      // Case 1: Both subject and location provided
      const tutorQuery = 'SELECT * FROM tutor_info WHERE t_city = $1';
      const tutorResult = await client.query(tutorQuery, [location]);

      if (tutorResult.rows.length === 0) {
        return res.status(404).json('No tutors found for the given city');
      }

      const courseQuery = 'SELECT * FROM tutor_time WHERE course = $1';
      const courseResult = await client.query(courseQuery, [subject]);

      if (courseResult.rows.length === 0) {
        return res.status(404).json( 'No tutors found for the given course');
      }

      const finalResult = tutorResult.rows.map((tutor) => {
        const matchingCourses = courseResult.rows.filter((course) => course.t_reg_id === tutor.t_reg_id);
        return {
          tutor,
          courses: matchingCourses,
        };
      });

      if (finalResult.length === 0) {
        return res.status(404).json( 'No tutors found for the given city and course' );
      }

      return res.status(200).json(finalResult);
    } else if (subject) {
      // Case 2: Only subject provided
      const courseQuery = 'SELECT * FROM tutor_time WHERE course = $1';
      const courseResult = await client.query(courseQuery, [subject]);

      if (courseResult.rows.length === 0) {
        return res.status(404).json('No tutors found for the given course');
      }

      return res.status(200).json(courseResult.rows);
    } else {
      return res.status(400).json( 'Invalid request. Both subject and location are required.');
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error occurred' });
  }
};

module.exports = { getSearchResult };
