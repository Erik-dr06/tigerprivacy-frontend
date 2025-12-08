import React, { useState, useMemo } from "react";
import "./AdvertisersGrid.css";

export default function AdvertisersGrid({ advertisersData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Calculate statistics - use empty array if no data
  const stats = useMemo(() => {
    if (!advertisersData || advertisersData.length === 0) {
      return { total: 0 };
    }
    return { total: advertisersData.length };
  }, [advertisersData]);

  // Use advertisersData directly without filtering
  const filteredAdvertisers = advertisersData || [];
  const totalPages = Math.ceil(filteredAdvertisers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAdvertisers = filteredAdvertisers.slice(startIndex, endIndex);

  // Early return for empty data AFTER all hooks
  if (!advertisersData || advertisersData.length === 0) {
    return (
      <div className="advertisers-grid-container">
        <p className="no-advertisers">No advertiser data available.</p>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="advertisers-grid-container">
      {/* Summary Stats */}
      <div className="advertisers-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Advertisers with Your Information</div>
          <div className="stat-description">These advertisers have accessed your data or activity</div>
        </div>
      </div>


      {/* Compact Grid */}
      <div className="advertisers-grid-compact">
        {currentAdvertisers.map((advertiser, index) => (
          <div key={index} className="advertiser-card-compact">
            <span className="advertiser-name-compact">
              {advertiser.advertiser_name || "Unknown Advertiser"}
            </span>
            {advertiser.has_data_file_custom_audience ? (
              <span className="status-check-compact">✓</span>
            ) : (
              <span className="status-cross-compact">✗</span>
            )}
          </div>
        ))}
      </div>

      {/* Compact Pagination */}
      {totalPages > 1 && (
        <div className="advertisers-pagination-compact">
          <button
            className="pagination-button-compact"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <span className="pagination-info-compact">
            {startIndex + 1}-{Math.min(endIndex, filteredAdvertisers.length)} of {filteredAdvertisers.length}
          </span>
          <button
            className="pagination-button-compact"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

