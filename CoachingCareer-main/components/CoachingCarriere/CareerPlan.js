import React from 'react';

const CareerPlan = ({ plan }) => {
  return (
    <div>
      <h2>Plan de carrière</h2>
      <pre>{JSON.stringify(plan, null, 2)}</pre>
    </div>
  );
};

export default CareerPlan; 