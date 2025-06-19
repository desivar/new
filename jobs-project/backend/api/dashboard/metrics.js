// Example Express.js route
app.get('/api/dashboard/metrics', async (req, res) => {
  const totalJobs = await Job.countDocuments();
  const activeJobs = await Job.countDocuments({ status: { $in: ['In Progress', 'Planning'] } });
  const completedJobs = await Job.countDocuments({ status: 'Completed' });
  const totalRevenue = await Job.aggregate([
    { $match: { status: 'Completed' } },
    { $group: { _id: null, total: { $sum: '$value' } } }
  ]);
  const pipelineValue = await Job.aggregate([
    { $match: { status: { $ne: 'Completed' } } },
    { $group: { _id: null, total: { $sum: '$value' } } }
  ]);
  
  res.json({
    totalJobs,
    activeJobs,
    completedJobs,
    totalRevenue: totalRevenue[0]?.total || 0,
    pipelineValue: pipelineValue[0]?.total || 0
  });
});