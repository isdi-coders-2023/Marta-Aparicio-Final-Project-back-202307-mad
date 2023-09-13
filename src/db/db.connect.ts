import mongoose from 'mongoose';

export const dbConnect = () => {
  const user = process.env.DB_USER;
  const passwd = process.env.DB_PASSWD;
  const uri = `mongodb+srv://${user}:${passwd}@cluster0.gwqrsix.mongodb.net/?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
