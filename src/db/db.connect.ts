import mongoose from 'mongoose';

export const dbConnect = () => {
  const user = process.env.DB_USER;
  const passwd = process.env.DB_PASSWD;
  const uri = `mongodb+srv://${user}:${passwd}@cluster0.p2bwofa.mongodb.net/Curso_2023_Q3?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
