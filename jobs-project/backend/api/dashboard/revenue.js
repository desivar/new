app.get('/api/dashboard/revenue', async (req, res) => {
  const monthlyData = await Job.aggregate([
    { $match: { status: 'Completed', completedAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) } } },
    {
      $group: {
        _id: { $month: '$completedAt' },
        revenue: { $sum: '$value' }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
  
  // Format for frontend
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formatted = monthlyData.map(item => ({
    month: months[item._id - 1],
    revenue: item.revenue
  }));
  
  res.json({ monthlyData: formatted });
});