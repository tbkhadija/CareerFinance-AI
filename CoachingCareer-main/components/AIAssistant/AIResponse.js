import React from 'react';

const AIResponse = ({ response }) => {
  return (
    <div>
      <h2>Réponse de l'IA</h2>
      <pre>{response}</pre>
    </div>
  );
};

export default AIResponse; 