function preserveExerciseMetadata(exercises, existingDeck, editionName) {
  if (
    existingDeck?.edition !== editionName
    || !Array.isArray(existingDeck.exercises)
  ) {
    return exercises
  }

  const previousByNumber = new Map(
    existingDeck.exercises.map((exercise) => [String(exercise.number), exercise]),
  )
  return exercises.map((exercise) => {
    const previous = previousByNumber.get(String(exercise.number))
    return {
      ...exercise,
      ...(previous?.answerKey ? { answerKey: previous.answerKey } : {}),
      ...(previous?.interaction ? { interaction: previous.interaction } : {}),
    }
  })
}

function sourceNumberForArtifact(exercise) {
  return Object.prototype.hasOwnProperty.call(exercise, 'source_number')
    ? exercise.source_number
    : exercise.number
}

function preserveChoiceMetadata(deck, existingDeck) {
  if (!existingDeck?.choices || deck.edition !== existingDeck.edition) return deck
  const sourceProjection = (items) => items.map(({ answerKey, interaction, ...exercise }) => exercise)
  if (JSON.stringify(sourceProjection(deck.exercises)) !==
    JSON.stringify(sourceProjection(existingDeck.exercises))) return deck
  return { ...deck, choices: existingDeck.choices }
}

module.exports = { preserveExerciseMetadata, preserveChoiceMetadata, sourceNumberForArtifact }
