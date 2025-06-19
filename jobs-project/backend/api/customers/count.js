app.get('/api/customers/count', async (req, res) => {
  const count = await Customer.countDocuments();
  res.json({ count });
});