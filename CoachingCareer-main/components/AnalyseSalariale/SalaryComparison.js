import React from 'react';

const SalaryComparison = ({ data }) => {
  return (
    <div>
      <h2>Comparaison des salaires</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default SalaryComparison; 