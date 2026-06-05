import React from "react";
import "../CSS/homeskeletonCSS.css";

function HomeSkeleton({ sections = 5, cards = 5 }) {
  return (
    <div className="home-skeleton">
      {[...Array(sections)].map((_, sectionIndex) => (
        <section className="home-skeleton-section" key={sectionIndex}>
          <div className="home-skeleton-heading">
            <div className="home-skeleton-title">
              <div className="home-skeleton-line medium" />
            </div>
            <div className="home-skeleton-pill" />
          </div>
          <div className="home-skeleton-products">
            <div className="home-skeleton-row">
              {[...Array(cards)].map((_, cardIndex) => (
                <div className="home-skeleton-card" key={cardIndex}>
                  <div className="home-skeleton-image">
                    <span className="home-skeleton-lens left" />
                    <span className="home-skeleton-bridge" />
                    <span className="home-skeleton-lens right" />
                    <span className="home-skeleton-arm left" />
                    <span className="home-skeleton-arm right" />
                  </div>
                  <div className="home-skeleton-info">
                    <div className="home-skeleton-line wide" />
                    <div className="home-skeleton-line short" />
                    <div className="home-skeleton-detail-pill" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default HomeSkeleton;
