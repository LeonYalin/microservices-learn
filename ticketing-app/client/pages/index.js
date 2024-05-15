import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  const text = currentUser ? 'You are signed in' : 'You are NOT signed in';
  return <h1>{text}</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;
