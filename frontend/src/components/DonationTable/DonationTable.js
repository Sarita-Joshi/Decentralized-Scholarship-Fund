import React, { useState } from "react";
import { FaSort, FaFilter } from 'react-icons/fa';
import "./DonationTable.css";

const DonationTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterFund, setFilterFund] = useState("");

  const donations = [
    {
      id: 1,
      address: "0xABC123...",
      amount: 5,
      date: "2024-11-15",
      fund: "Gym Fund",
    },
    {
      id: 2,
      address: "0xDEF456...",
      amount: 10,
      date: "2024-11-14",
      fund: "Animal Welfare",
    },
    {
      id: 3,
      address: "0xGHI789...",
      amount: 2,
      date: "2024-11-13",
      fund: "Community Support",
    },
  ];

  // Generate dynamic color for fund tag based on fund name
  const getDynamicColor = (fund) => {
    const colors = [
      "#d4edda",
      "#fff3cd",
      "#f8d7da",
      "#d1ecf1",
      "#f2d7ee",
      "#e8e8e8",
    ]; // Array of predefined colors
    let hash = 0;
    for (let i = 0; i < fund.length; i++) {
      hash = fund.charCodeAt(i) + ((hash << 5) - hash); // Simple hash
    }
    const index = Math.abs(hash) % colors.length; // Map hash to a color
    return colors[index];
  };

  // Search Filter
  const filteredDonations = donations
    .filter((donation) =>
      donation.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((donation) => (filterFund ? donation.fund === filterFund : true));

  // Sort Functionality
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    if (sortBy === "address") return a.address.localeCompare(b.address);
    if (sortBy === "amount") return a.amount - b.amount;
    if (sortBy === "date") return new Date(a.date) - new Date(b.date);
    return 0;
  });

  return (
    <div className="donation-table">
      <div className="controls">
        <input
          type="text"
          placeholder="Search by address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="dropdown-with-icon">
          <FaSort className="icon" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort</option> {/* Hidden text for icon */}
            <option value="address">Address</option>
            <option value="amount">Amount</option>
            <option value="date">Date</option>
          </select>
        </div>

        {/* Filter Dropdown with Icon */}
        <div className="dropdown-with-icon">
          <FaFilter className="icon" />
          <select
            value={filterFund}
            onChange={(e) => setFilterFund(e.target.value)}
          >
            <option value="">Filter</option> {/* Hidden text for icon */}
            {[...new Set(donations.map((d) => d.fund))].map((fund) => (
              <option key={fund} value={fund}>
                {fund}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Amount (ETH)</th>
            <th>Date</th>
            <th>Fund</th>
          </tr>
        </thead>
        <tbody>
          {sortedDonations.map((donation) => (
            <tr key={donation.id}>
              <td>{donation.address}</td>
              <td>{donation.amount}</td>
              <td>{donation.date}</td>
              <td>
                <span
                  className="fund-tag"
                  style={{
                    backgroundColor: getDynamicColor(donation.fund),
                    color: "#fff",
                  }}
                >
                  {donation.fund}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationTable;
