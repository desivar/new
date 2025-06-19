app.get('/api/jobs', async (req, res) => {
  const { limit = 10, sort = '-createdAt' } = req.query;
  const jobs = await Job.find()
    .populate('customer', 'name')
    .sort(sort)
    .limit(parseInt(limit));
  
  res.json({ jobs });
});