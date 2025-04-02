jest.setTimeout(30000);


process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
});