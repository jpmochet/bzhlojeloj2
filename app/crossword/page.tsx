'use client'

import { useState } from 'react'

const solutions: Record<string, string> = {
  "1,1":"B","1,2":"Z","1,3":"H","1,4":"L","1,5":"O","1,6":"J","1,7":"E","1,8":"L","1,9":"O","1,10":"J",
  "2,2":"L","2,3":"O","2,4":"G","2,5":"E","2,6":"M","2,7":"E","2,8":"N","2,9":"T",
  "3,2":"S","3,3":"A","3,4":"I","3,5":"S","3,6":"O","3,7":"N","3,8":"N","3,9":"I","3,10":"E",
  "4,2":"A","4,3":"N","4,4":"N","4,5":"U","4,6":"E","4,7":"L",
  "5,2":"P","5,3":"R","5,4":"O","5,5":"P","5,6":"R","5,7":"I","5,8":"E","5,9":"T","5,10":"A","5,11":"I","5,12":"R","5,13":"E",
  "6,2":"P","6,3":"R","6,4":"E","6,5":"S","6,6":"T","6,7":"A","6,8":"T","6,9":"A","6,10":"I","6,11":"R",
  "7,2":"P","7,3":"L","7,4":"A","7,5":"T","7,6":"E","7,7":"F","7,8":"O","7,9":"R","7,10":"M","7,11":"E",
  "8,2":"B","8,3":"R","8,4":"E","8,5":"T","8,6":"A","8,7":"G","8,8":"N","8,9":"E",
  "9,2":"S","9,3":"O","9,4":"L","9,5":"I","9,6":"D","9,7":"A","9,8":"I","9,9":"R","9,10":"E",
  "10,2":"I","10,3":"M","10,4":"P","10,5":"A","10,6":"C","10,7":"T",
  "11,2":"C","11,3":"O","11,4":"M","11,5":"M","11,6":"U","11,7":"N","11,8":"E",
  "12,2":"L","12,3":"O","12,4":"C","12,5":"A","12,6":"U","12,7":"X",
  "13,2":"P","13,3":"H","13,4":"A","13,5":"R","13,6":"E"
}

export default function CrosswordPage() {
  const [inputs, setInputs] = useState<Record<number, string>>({})
  const [result, setResult] = useState('')

  const gridLayout = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1],
    [-1, 2, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1],
    [-1, 3, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1],
    [-1, 4, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1],
    [-1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [-1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1],
    [-1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1],
    [-1, 8, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1],
    [-1, 9, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1],
    [-1, 10, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1],
    [-1, 11, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1],
    [-1, 12, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1],
    [-1, 13, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1],
  ]

  const handleInputChange = (index: number, value: string) => {
    setInputs(prev => ({
      ...prev,
      [index]: value.toUpperCase()
    }))
  }

  const checkAnswers = () => {
    let correct = 0
    let total = Object.keys(solutions).length

    for (let row = 1; row <= 13; row++) {
      for (let col = 1; col <= 13; col++) {
        const key = `${row},${col}`
        const cellIndex = (row - 1) * 13 + (col - 1)
        
        if (solutions[key]) {
          if (inputs[cellIndex]?.toUpperCase() === solutions[key]) {
            correct++
          }
        }
      }
    }

    setResult(
      correct === total
        ? '🎉 Parfait ! Grille entièrement correcte.'
        : `🌊 Score : ${correct} / ${total} cases correctes.`
    )
  }

  return (
    <div className="py-16 px-4">
      <div style={{ fontFamily: 'Arial', maxWidth: '900px', margin: 'auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '10px' }}>
          🧩 Mot Croisé – BZHlojeloj
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '30px' }}>
          Remplis la grille puis vérifie ton score.
        </p>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(13, 40px)',
          gap: '2px',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          {gridLayout.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              const cellIndex = rowIdx * 13 + colIdx
              const cellNumber = cell > 0 ? cell : null
              
              if (cell === -1) {
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#003049'
                    }}
                  />
                )
              }

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid #0077b6',
                    background: '#e6f7ff',
                    position: 'relative'
                  }}
                >
                  {cellNumber && (
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      fontSize: '10px',
                      color: '#003049',
                      fontWeight: 'bold'
                    }}>
                      {cellNumber}
                    </div>
                  )}
                  <input
                    type="text"
                    maxLength={1}
                    value={inputs[cellIndex] || ''}
                    onChange={(e) => handleInputChange(cellIndex, e.target.value)}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      textTransform: 'uppercase',
                      fontSize: '20px',
                      textAlign: 'center',
                      fontFamily: 'inherit',
                      padding: '0'
                    }}
                  />
                </div>
              )
            })
          )}
        </div>

        <button
          onClick={checkAnswers}
          style={{
            padding: '12px 24px',
            background: '#0077b6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'block',
            margin: '20px auto'
          }}
        >
          Vérifier mes réponses
        </button>

        {result && (
          <div style={{
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            marginTop: '20px',
            color: '#003049'
          }}>
            {result}
          </div>
        )}

        {/* Questions */}
        <div style={{ marginTop: '40px', fontSize: '16px', lineHeight: '1.6' }}>
          <h2>Questions horizontales</h2>
          <ul>
            <li>1. Plateforme bretonne de location solidaire.</li>
            <li>2. Logements proposés à l&apos;année, régulés et accessibles.</li>
            <li>3. Type de location touristique à court terme.</li>
            <li>4. Mode de location stable réservé aux habitants.</li>
            <li>5. Personne qui met son logement en location.</li>
            <li>6. Professionnel local qui réalise les services.</li>
            <li>7. Outil numérique qui organise les locations et la redistribution.</li>
            <li>8. Région où naît le projet.</li>
            <li>9. Modèle fondé sur le partage et l&apos;entraide.</li>
            <li>10. Effet concret du modèle sur le territoire.</li>
            <li>11. Territoire prioritaire pour les habitants.</li>
            <li>12. Professionnels indépendants du secteur.</li>
            <li>13. Guide lumineux en bord de côte breton.</li>
          </ul>

          <h2 style={{ marginTop: '20px' }}>Questions verticales</h2>
          <ul>
            <li>A. Ce que recherche l&apos;habitant : stabilité et ancrage local.</li>
            <li>B. Acteurs qui louent leur logement et participent au modèle solidaire.</li>
            <li>C. Prestations réalisées par les professionnels locaux.</li>
            <li>D. Mode de location stable financé par la redistribution.</li>
            <li>E. Professionnels du territoire intégrés dans le modèle.</li>
            <li>F. Résultat concret du modèle solidaire.</li>
            <li>G. Région d&apos;ancrage du projet.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
