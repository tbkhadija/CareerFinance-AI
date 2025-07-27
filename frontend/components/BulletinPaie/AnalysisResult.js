import React from 'react';

const AnalysisResult = ({ result }) => {
  return (
    <div>
      <h2>Résultat de l'analyse</h2>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default AnalysisResult; 