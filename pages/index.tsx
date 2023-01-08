import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";

function getTrackingNumbers(): string[] {
  try {
    const storedTrackingNumbers =
      window.localStorage.getItem("trackingNumbers");
    return storedTrackingNumbers ? JSON.parse(storedTrackingNumbers) : [];
  } catch {
    return [];
  }
}

const HomePage: NextPage = () => {
  console.log(process.env.API_KEY);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>([]);
  const [deletedTrackingNumber, setDeletedTrackingNumber] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState("");

  const [deliveryStatus, setDeliveryStatus] = useState("");

  const addTrackingNumber = (trackingNumber: string) => {
    // Get the current tracking numbers from localStorage
    const trackingNumbers = JSON.parse(
      localStorage.getItem("trackingNumbers") || "[]"
    );

    // Add the new tracking number to the array
    trackingNumbers.push(trackingNumber);

    // Save the updated array back to localStorage
    localStorage.setItem("trackingNumbers", JSON.stringify(trackingNumbers));
    setTrackingNumbers(trackingNumbers);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingNumber(event.currentTarget.value);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTrackingNumber(trackingNumber);
    setTrackingNumber("");
    setShowForm(false);
  };

  useEffect(() => {
    // Make the API call to lookup the tracking number
    console.log(trackingNumbers);
  }, [trackingNumbers]);

  const handleDeleteTrackingNumber = (number: string) => {
    const trackingNumbers = JSON.parse(
      localStorage.getItem("trackingNumbers") || "[]"
    );

    // Add the new tracking number to the array
    const index = trackingNumber.indexOf(number);
    // Splice the array at the index of your object
    if (index) {
      trackingNumbers.splice(index, 1);

      // Save the updated array back to localStorage
      localStorage.setItem("trackingNumbers", JSON.stringify(trackingNumbers));
    }
    setTrackingNumbers((prevTrackingNumbers) =>
      prevTrackingNumbers.filter((n) => n !== number)
    );

    setDeletedTrackingNumber(number);
  };

  const handleUndoDelete = () => {
    // Save the updated array back to localStorage
    trackingNumbers.push(deletedTrackingNumber);
    localStorage.setItem("trackingNumbers", JSON.stringify(trackingNumbers));
    setDeletedTrackingNumber("");
  };

  useEffect(() => {
    const storedTrackingNumbers = getTrackingNumbers();
    setTrackingNumbers(storedTrackingNumbers);
  }, []);

  useEffect(() => {
    if (deletedTrackingNumber) {
      const timeoutId = setTimeout(() => {
        setDeletedTrackingNumber("");
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return (
    <div className="flex flex-col items-center px-5 py-10 bg-slate-600">
      <h1 className="text-3xl font-bold mb-5">Package Tracker</h1>
      {showForm ? (
        <div className="flex flex-col items-center min-w-full">
          <form
            className="flex flex-col items-center"
            onSubmit={(event) => {
              event.preventDefault();
              addTrackingNumber(trackingNumber);
              setTrackingNumber("");
              setSelectedCarrier("");
            }}
          >
            <input
              type="text"
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              placeholder="Tracking number"
              className="px-4 py-2 rounded-lg my-4 text-center mx-auto"
            />
            <div className="flex px-2">
              <label htmlFor="carrier-ups" className="ml-4">
                <input
                  type="radio"
                  id="carrier-ups"
                  name="carrier"
                  value="UPS"
                  checked={selectedCarrier === "UPS"}
                  onChange={(event) => setSelectedCarrier(event.target.value)}
                />
                UPS
              </label>
              <label htmlFor="carrier-fedex" className="ml-4">
                <input
                  type="radio"
                  id="carrier-fedex"
                  name="carrier"
                  value="Fedex"
                  checked={selectedCarrier === "Fedex"}
                  onChange={(event) => setSelectedCarrier(event.target.value)}
                />
                Fedex
              </label>
              <label htmlFor="carrier-canada-post" className="ml-4">
                <input
                  type="radio"
                  id="carrier-canada-post"
                  name="carrier"
                  value="Canada Post"
                  checked={selectedCarrier === "Canada Post"}
                  onChange={(event) => setSelectedCarrier(event.target.value)}
                />
                Canada Post
              </label>
              <label htmlFor="carrier-purolator" className="ml-4">
                <input
                  type="radio"
                  id="carrier-purolator"
                  name="carrier"
                  value="Purolator"
                  checked={selectedCarrier === "Purolator"}
                  onChange={(event) => setSelectedCarrier(event.target.value)}
                />
                Purolator
              </label>
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-lg bg-blue-500 text-white my-5 enabled:hover:bg-blue-700 disabled:bg-slate-700 enabled:bg-slate-800"
              disabled={selectedCarrier === "" || trackingNumber === ""}
            >
              Add
            </button>
          </form>
        </div>
      ) : (
        <button
          className="px-5 py-3 rounded-lg bg-slate-800 text-white hover:bg-blue-700 my-5"
          onClick={() => setShowForm(true)}
        >
          Add a tracking number
        </button>
      )}
      <Link
        href="/history"
        className="px-5 py-3 rounded-lg bg-slate-800 text-white hover:bg-blue-700 my-5"
      >
        View History
      </Link>
      <hr className="my-8" />
      <div className="px-5 py-8">
        <table className="table-auto w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-2">Tracking Number</th>
              <th className="px-4 py-2">Delivery Status</th>
              <th className="px-4 py-2">Alerts</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trackingNumbers.map((number) => (
              <tr key={number}>
                <td className="px-4 py-2">{number}</td>
                <td className="px-4 py-2">
                  {/* Display delivery status here */}
                </td>
                <td className="px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleDeleteTrackingNumber(number)}
                    className="px-2 py-1 rounded-full border-2 border-white text-white hover:bg-red-700"
                  >
                    &#128465;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {deletedTrackingNumber && (
          <div className="my-4 flex items-center">
            <p className="mr-2">{deletedTrackingNumber} deleted</p>
            <button
              onClick={handleUndoDelete}
              className="px-2 py-1 rounded-full border-2 border-white text-white hover:bg-green-700"
            >
              &#8617;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
