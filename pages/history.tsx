import { NextPage } from "next";
import { useRouter } from "next/router";

const HistoryPage: NextPage = () => {
  const router = useRouter();

  return (
    <div className="px-5 py-10">
      <h1 className="text-3xl font-bold mb-5">Tracking History</h1>
      {/* Display a list of tracking numbers here */}
      <button
        className="px-5 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-700 my-5"
        onClick={() => router.back()}
      >
        Go Back
      </button>
    </div>
  );
};

export default HistoryPage;
