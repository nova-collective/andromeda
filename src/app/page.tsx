import UserProfile from './components/UserProfile';

const demoWalletAddress = "0x742E4C2C5Dc63b6154F8a43c3c4a8A9F9c6a1B2c";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to Andromeda</h1>
      <p>a Web3 bookstore, from authors to readers</p>
      <UserProfile walletAddress={demoWalletAddress} />
    </div>
  );
}
